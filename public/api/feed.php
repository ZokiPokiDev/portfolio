<?php
declare(strict_types=1);

require_once __DIR__ . '/env.php';
systempro_load_env();

const CACHE_TTL_SECONDS = 900;
const MAX_ITEMS = 12;
const USER_AGENT = 'SystemProPortfolioFeed/1.0 (+https://systempro.tech)';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function request_json(): array
{
    static $json = null;

    if ($json !== null) {
        return $json;
    }

    $raw = file_get_contents('php://input');
    if (!$raw) {
        $json = [];
        return $json;
    }

    $decoded = json_decode($raw, true);
    $json = is_array($decoded) ? $decoded : [];

    return $json;
}

function request_param(string $key, $default = null)
{
    $body = request_json();

    if (array_key_exists($key, $_GET)) {
        return $_GET[$key];
    }

    if (array_key_exists($key, $_POST)) {
        return $_POST[$key];
    }

    if (array_key_exists($key, $body)) {
        return $body[$key];
    }

    return $default;
}

function request_int(string $key, int $default, int $min, int $max): int
{
    $value = (int) request_param($key, $default);
    return min($max, max($min, $value));
}

function ends_with(string $value, string $suffix): bool
{
    if ($suffix === '') {
        return true;
    }

    return substr($value, -strlen($suffix)) === $suffix;
}

function normalize_spaces(string $value): string
{
    return trim((string) preg_replace('/\s+/', ' ', $value));
}

function truncate_text(string $value, int $limit = 180): string
{
    $value = normalize_spaces(html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8'));

    if (function_exists('mb_strlen') && function_exists('mb_substr')) {
        return mb_strlen($value) > $limit ? mb_substr($value, 0, $limit - 3) . '...' : $value;
    }

    return strlen($value) > $limit ? substr($value, 0, $limit - 3) . '...' : $value;
}

function atom_date(?string $value): ?string
{
    if (!$value) {
        return null;
    }

    $timestamp = strtotime($value);
    return $timestamp ? gmdate(DATE_ATOM, $timestamp) : null;
}

function allowed_feed_url(string $url): bool
{
    $host = strtolower((string) parse_url($url, PHP_URL_HOST));

    if ($host === '') {
        return false;
    }

    return in_array($host, ['reddit.com', 'www.reddit.com', 'old.reddit.com'], true)
        || ends_with($host, '.reddit.com');
}

function source_definitions(): array
{
    $sources = [
        [
            'id' => 'manual',
            'kind' => 'manual',
            'label' => 'Curated campaign notes',
            'enabled' => true,
        ],
        [
            'id' => 'github',
            'kind' => 'github',
            'label' => 'GitHub / zokipokidev',
            'user' => getenv('FEED_GITHUB_USER') ?: 'zokipokidev',
            'enabled' => true,
        ],
    ];

    $redditUrls = getenv('FEED_REDDIT_RSS_URLS')
        ?: 'https://www.reddit.com/r/artificial/.rss?limit=2,https://www.reddit.com/r/SaaS/.rss?limit=2';

    foreach (array_filter(array_map('trim', explode(',', $redditUrls))) as $index => $url) {
        if (!allowed_feed_url($url)) {
            continue;
        }

        $sources[] = [
            'id' => 'reddit-' . ($index + 1),
            'kind' => 'rss',
            'label' => 'Reddit signal',
            'url' => $url,
            'enabled' => true,
        ];
    }

    if (getenv('X_BEARER_TOKEN') && getenv('X_USER_ID')) {
        $sources[] = [
            'id' => 'x',
            'kind' => 'x',
            'label' => 'X / API',
            'user_id' => getenv('X_USER_ID'),
            'username' => getenv('X_USERNAME') ?: '',
            'enabled' => true,
        ];
    }

    return $sources;
}

function public_source(array $source): array
{
    return array_filter([
        'id' => $source['id'] ?? null,
        'kind' => $source['kind'] ?? null,
        'label' => $source['label'] ?? null,
        'url' => $source['url'] ?? null,
        'enabled' => $source['enabled'] ?? false,
    ], static function ($value): bool {
        return $value !== null;
    });
}

function cache_file(): string
{
    $cacheDir = __DIR__ . '/cache';

    if ((!is_dir($cacheDir) && !@mkdir($cacheDir, 0755, true)) || !is_writable($cacheDir)) {
        return rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'systempro-feed-' . md5(__DIR__) . '.json';
    }

    return $cacheDir . '/feed.json';
}

function read_cache(): ?array
{
    $file = cache_file();

    if (!is_file($file)) {
        return null;
    }

    $payload = json_decode((string) file_get_contents($file), true);
    if (!is_array($payload)) {
        return null;
    }

    if (($payload['expires_at'] ?? 0) < time()) {
        return null;
    }

    return $payload;
}

function write_cache(array $payload): void
{
    @file_put_contents(cache_file(), json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function http_get(string $url, array $headers = []): ?string
{
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 3,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_USERAGENT => USER_AGENT,
            CURLOPT_HTTPHEADER => $headers,
        ]);

        $body = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        curl_close($curl);

        return $body !== false && $status >= 200 && $status < 300 ? (string) $body : null;
    }

    $context = stream_context_create([
        'http' => [
            'timeout' => 8,
            'header' => implode("\r\n", array_merge(['User-Agent: ' . USER_AGENT], $headers)),
        ],
    ]);

    $body = @file_get_contents($url, false, $context);
    return $body === false ? null : (string) $body;
}

function feed_item(string $source, string $title, string $text, string $href, ?string $publishedAt, string $kind, int $priority = 0): array
{
    return [
        'source' => truncate_text($source, 80),
        'title' => truncate_text($title, 90),
        'text' => truncate_text($text, 190),
        'href' => $href,
        'published_at' => $publishedAt,
        'kind' => $kind,
        'priority' => $priority,
    ];
}

function manual_items(): array
{
    $path = __DIR__ . '/../signal-feed.json';
    $items = json_decode((string) @file_get_contents($path), true);

    if (!is_array($items)) {
        return [];
    }

    return array_values(array_filter(array_map(static function (array $item): ?array {
        if (empty($item['title']) || empty($item['href'])) {
            return null;
        }

        return feed_item(
            (string) ($item['source'] ?? 'Campaign'),
            (string) $item['title'],
            (string) ($item['text'] ?? ''),
            (string) $item['href'],
            atom_date((string) ($item['published_at'] ?? '')),
            'manual',
            20
        );
    }, $items)));
}

function atom_link(SimpleXMLElement $entry): string
{
    foreach ($entry->link as $link) {
        $attributes = $link->attributes();
        if (isset($attributes['href'])) {
            return (string) $attributes['href'];
        }
    }

    return (string) $entry->link;
}

function rss_items(array $source): array
{
    if (empty($source['url'])) {
        return [];
    }

    $raw = http_get($source['url'], ['Accept: application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8']);
    if (!$raw || !function_exists('simplexml_load_string')) {
        return [];
    }

    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($raw, 'SimpleXMLElement', LIBXML_NONET | LIBXML_NOCDATA);
    libxml_clear_errors();

    if (!$xml) {
        return [];
    }

    $items = [];

    if (isset($xml->channel->item)) {
        foreach ($xml->channel->item as $entry) {
            $items[] = feed_item(
                (string) ($source['label'] ?? 'RSS'),
                (string) $entry->title,
                (string) ($entry->description ?? ''),
                (string) $entry->link,
                atom_date((string) ($entry->pubDate ?? '')),
                'rss'
            );
        }
    } elseif (isset($xml->entry)) {
        foreach ($xml->entry as $entry) {
            $items[] = feed_item(
                (string) ($source['label'] ?? 'Atom'),
                (string) $entry->title,
                (string) ($entry->summary ?: $entry->content),
                atom_link($entry),
                atom_date((string) ($entry->updated ?: $entry->published)),
                'rss'
            );
        }
    }

    return $items;
}

function github_items(array $source): array
{
    $user = preg_replace('/[^A-Za-z0-9-]/', '', (string) ($source['user'] ?? ''));
    if (!$user) {
        return [];
    }

    $raw = http_get(
        'https://api.github.com/users/' . $user . '/repos?sort=pushed&type=owner&per_page=5',
        ['Accept: application/vnd.github+json']
    );

    $repos = $raw ? json_decode($raw, true) : null;
    if (!is_array($repos)) {
        return [];
    }

    $items = [];
    foreach ($repos as $repo) {
        if (!is_array($repo) || !empty($repo['fork'])) {
            continue;
        }

        $items[] = feed_item(
            'GitHub / ' . gmdate('M j', strtotime((string) ($repo['pushed_at'] ?? 'now'))),
            (string) ($repo['name'] ?? 'Repository update'),
            (string) ($repo['description'] ?? 'Recent repository activity.'),
            (string) ($repo['html_url'] ?? 'https://github.com/' . $user),
            atom_date((string) ($repo['pushed_at'] ?? '')),
            'github',
            4
        );

        if (count($items) >= 3) {
            break;
        }
    }

    return $items;
}

function x_items(array $source): array
{
    $token = getenv('X_BEARER_TOKEN');
    $userId = preg_replace('/[^0-9]/', '', (string) ($source['user_id'] ?? ''));

    if (!$token || !$userId) {
        return [];
    }

    $raw = http_get(
        'https://api.x.com/2/users/' . $userId . '/tweets?max_results=5&tweet.fields=created_at&exclude=retweets,replies',
        ['Authorization: Bearer ' . $token]
    );

    $payload = $raw ? json_decode($raw, true) : null;
    if (!is_array($payload['data'] ?? null)) {
        return [];
    }

    $username = trim((string) ($source['username'] ?? ''));
    $items = [];

    foreach ($payload['data'] as $tweet) {
        if (!is_array($tweet) || empty($tweet['id'])) {
            continue;
        }

        $href = $username
            ? 'https://x.com/' . rawurlencode($username) . '/status/' . rawurlencode((string) $tweet['id'])
            : 'https://x.com/i/web/status/' . rawurlencode((string) $tweet['id']);

        $items[] = feed_item(
            'X / API',
            'Recent X update',
            (string) ($tweet['text'] ?? ''),
            $href,
            atom_date((string) ($tweet['created_at'] ?? '')),
            'x',
            8
        );
    }

    return $items;
}

function collect_items(bool $force = false): array
{
    if (!$force) {
        $cached = read_cache();
        if ($cached) {
            $cached['cached'] = true;
            return $cached;
        }
    }

    $sources = source_definitions();
    $items = [];

    foreach ($sources as $source) {
        if (empty($source['enabled'])) {
            continue;
        }

        switch ($source['kind']) {
            case 'manual':
                $items = array_merge($items, manual_items());
                break;
            case 'github':
                $items = array_merge($items, github_items($source));
                break;
            case 'rss':
                $items = array_merge($items, rss_items($source));
                break;
            case 'x':
                $items = array_merge($items, x_items($source));
                break;
        }
    }

    usort($items, static function (array $a, array $b): int {
        $priority = ($b['priority'] ?? 0) <=> ($a['priority'] ?? 0);
        if ($priority !== 0) {
            return $priority;
        }

        return strtotime((string) ($b['published_at'] ?? '')) <=> strtotime((string) ($a['published_at'] ?? ''));
    });

    $publicItems = array_map(static function (array $item): array {
        unset($item['priority']);
        return $item;
    }, array_slice($items, 0, MAX_ITEMS));

    $payload = [
        'generated_at' => gmdate(DATE_ATOM),
        'expires_at' => time() + CACHE_TTL_SECONDS,
        'cached' => false,
        'items' => $publicItems,
        'sources' => array_map('public_source', $sources),
    ];

    write_cache($payload);

    return $payload;
}

$route = (string) request_param('route', 'items');
$limit = request_int('limit', 6, 1, MAX_ITEMS);

try {
    switch ($route) {
        case 'ping':
            json_response(['ok' => true, 'time' => gmdate(DATE_ATOM)]);
            break;
        case 'sources':
            json_response([
            'sources' => array_map('public_source', source_definitions()),
            'notes' => [
                'Reddit RSS feeds are public but can rate-limit, so this endpoint caches responses.',
                'LinkedIn has no simple public RSS; use curated JSON here or add approved API credentials later.',
                'X has no simple public RSS; set X_BEARER_TOKEN, X_USER_ID, and optionally X_USERNAME to enable API fetches.',
            ],
            ]);
            break;
        case 'refresh':
            if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
                json_response(['error' => 'refresh_requires_post'], 405);
            }

            $secret = getenv('FEED_REFRESH_SECRET') ?: '';
            if ($secret === '' || request_param('secret') !== $secret) {
                json_response(['error' => 'refresh_not_allowed'], 403);
            }

            $payload = collect_items(true);
            $payload['items'] = array_slice($payload['items'], 0, $limit);
            json_response($payload);
            break;
        case 'items':
            $payload = collect_items(false);
            $payload['items'] = array_slice($payload['items'], 0, $limit);
            json_response($payload);
            break;
        default:
            json_response(['error' => 'unknown_route', 'route' => $route], 404);
    }
} catch (Throwable $exception) {
    json_response([
        'error' => 'feed_error',
        'message' => $exception->getMessage(),
    ], 500);
}
