<?php
declare(strict_types=1);

require_once __DIR__ . '/env.php';
systempro_load_env();

const CACHE_TTL_SECONDS = 900;
const PROVIDER_ITEM_LIMIT = 5;
const MAX_ITEMS = 40;
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
            'provider' => 'github',
            'label' => 'GitHub / zokipokidev',
            'user' => getenv('FEED_GITHUB_USER') ?: 'zokipokidev',
            'enabled' => true,
        ],
        [
            'id' => 'hackernews',
            'kind' => 'hackernews',
            'provider' => 'hackernews',
            'label' => 'Hacker News',
            'enabled' => getenv('FEED_HACKER_NEWS_ENABLED') !== '0',
        ],
    ];

    $redditUrls = getenv('FEED_REDDIT_RSS_URLS')
        ?: 'https://www.reddit.com/r/artificial/new/.rss?limit=5,https://www.reddit.com/r/SaaS/new/.rss?limit=5';

    foreach (array_filter(array_map('trim', explode(',', $redditUrls))) as $index => $url) {
        if (!allowed_feed_url($url)) {
            continue;
        }

        $sources[] = [
            'id' => 'reddit-' . ($index + 1),
            'kind' => 'rss',
            'provider' => 'reddit',
            'label' => 'Reddit signal',
            'url' => $url,
            'enabled' => true,
        ];
    }

    $linkedInToken = trim((string) getenv('LINKEDIN_ACCESS_TOKEN'));
    $linkedInOrganizationId = preg_replace('/[^0-9]/', '', (string) getenv('LINKEDIN_ORGANIZATION_ID'));
    $linkedInVersion = preg_replace('/[^0-9]/', '', (string) getenv('LINKEDIN_API_VERSION'));

    if ($linkedInToken && $linkedInOrganizationId && $linkedInVersion) {
        $sources[] = [
            'id' => 'linkedin-systempro',
            'kind' => 'linkedin',
            'provider' => 'linkedin',
            'label' => 'LinkedIn / SystemPro',
            'token' => $linkedInToken,
            'organization_id' => $linkedInOrganizationId,
            'api_version' => $linkedInVersion,
            'enabled' => true,
        ];
    }

    if (getenv('X_BEARER_TOKEN') && getenv('X_USER_ID')) {
        $sources[] = [
            'id' => 'x',
            'kind' => 'x',
            'provider' => 'x',
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
        'provider' => $source['provider'] ?? null,
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

function http_get_many(array $urls, array $headers = []): array
{
    if (!$urls) {
        return [];
    }

    if (!function_exists('curl_multi_init')) {
        return array_map(static fn(string $url): ?string => http_get($url, $headers), $urls);
    }

    $multi = curl_multi_init();
    $handles = [];

    foreach ($urls as $key => $url) {
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
        curl_multi_add_handle($multi, $curl);
        $handles[$key] = $curl;
    }

    do {
        $status = curl_multi_exec($multi, $active);
        if ($active) {
            curl_multi_select($multi, 1.0);
        }
    } while ($active && $status === CURLM_OK);

    $responses = [];
    foreach ($handles as $key => $curl) {
        $httpStatus = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $body = curl_multi_getcontent($curl);
        $responses[$key] = $body !== false && $httpStatus >= 200 && $httpStatus < 300 ? (string) $body : null;
        curl_multi_remove_handle($multi, $curl);
        curl_close($curl);
    }
    curl_multi_close($multi);

    return $responses;
}

function default_provider_for_kind(string $kind): string
{
    return match ($kind) {
        'github' => 'github',
        'rss' => 'reddit',
        'hackernews' => 'hackernews',
        'linkedin', 'social' => 'linkedin',
        'x' => 'x',
        default => 'systempro',
    };
}

function default_content_type_for_kind(string $kind, string $origin): string
{
    return match ($kind) {
        'offer' => 'offer',
        'regional' => 'regional',
        'post', 'linkedin', 'social', 'x' => 'post',
        'github' => 'repository',
        'rss', 'hackernews' => 'discussion',
        default => $origin === 'internal' ? 'post' : 'update',
    };
}

function feed_item(
    string $source,
    string $title,
    string $text,
    string $href,
    ?string $publishedAt,
    string $kind,
    int $priority = 0,
    string $origin = 'external',
    bool $featured = false,
    array $metadata = []
): array
{
    $promoted = !empty($metadata['promoted']);
    $contentType = (string) ($metadata['content_type'] ?? default_content_type_for_kind($kind, $origin));

    return [
        'source' => truncate_text($source, 80),
        'title' => truncate_text($title, 90),
        'text' => truncate_text($text, 190),
        'href' => $href,
        'published_at' => $publishedAt,
        'kind' => $kind,
        'origin' => $origin,
        'provider' => (string) ($metadata['provider'] ?? default_provider_for_kind($kind)),
        'content_type' => $promoted ? 'ad' : $contentType,
        'promoted' => $promoted,
        'featured' => $featured,
        'metrics' => is_array($metadata['metrics'] ?? null) ? $metadata['metrics'] : [],
        'priority' => $priority,
    ];
}

function is_internal_href(string $href): bool
{
    return isset($href[0]) && ($href[0] === '#' || $href[0] === '/');
}

function manual_items(): array
{
    $path = __DIR__ . '/../signal-feed.json';
    $items = json_decode((string) @file_get_contents($path), true);

    if (!is_array($items)) {
        return [];
    }

    return array_values(array_filter(array_map(static function (array $item): ?array {
        if (!empty($item['fallback_only']) || empty($item['title']) || empty($item['href'])) {
            return null;
        }

        $href = (string) $item['href'];
        $origin = (string) ($item['origin'] ?? (is_internal_href($href) ? 'internal' : 'external'));
        $metadata = [
            'provider' => (string) ($item['provider'] ?? ($origin === 'internal' ? 'systempro' : 'community')),
            'promoted' => !empty($item['promoted']),
            'metrics' => is_array($item['metrics'] ?? null) ? $item['metrics'] : [],
        ];
        if (!empty($item['content_type'])) {
            $metadata['content_type'] = (string) $item['content_type'];
        }

        return feed_item(
            (string) ($item['source'] ?? 'Campaign'),
            (string) $item['title'],
            (string) ($item['text'] ?? ''),
            $href,
            atom_date((string) ($item['published_at'] ?? '')),
            (string) ($item['kind'] ?? 'manual'),
            (int) ($item['priority'] ?? ($origin === 'external' ? 6 : 1)),
            $origin,
            !empty($item['featured']),
            $metadata
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
                'rss',
                2,
                'external',
                false,
                ['provider' => (string) ($source['provider'] ?? 'reddit'), 'content_type' => 'discussion']
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
                'rss',
                2,
                'external',
                false,
                ['provider' => (string) ($source['provider'] ?? 'reddit'), 'content_type' => 'discussion']
            );
        }
    }

    return array_slice($items, 0, PROVIDER_ITEM_LIMIT);
}

function github_items(array $source): array
{
    $user = preg_replace('/[^A-Za-z0-9-]/', '', (string) ($source['user'] ?? ''));
    if (!$user) {
        return [];
    }

    $raw = http_get(
        'https://api.github.com/users/' . $user . '/repos?sort=pushed&type=owner&per_page=15',
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
            4,
            'external',
            false,
            ['provider' => 'github', 'content_type' => 'repository']
        );

        if (count($items) >= PROVIDER_ITEM_LIMIT) {
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
            8,
            'external',
            false,
            ['provider' => 'x', 'content_type' => 'post']
        );
    }

    return $items;
}

function topic_relevance_score(string $title): int
{
    $keywords = [
        'ai', 'artificial intelligence', 'llm', 'machine learning', 'agent',
        'software', 'developer', 'programming', 'database', 'security',
        'open source', 'github', 'linux', 'cloud', 'web', 'api',
    ];
    $score = 0;

    foreach ($keywords as $keyword) {
        if (preg_match('/\b' . preg_quote($keyword, '/') . '\b/i', $title)) {
            $score += str_contains($keyword, ' ') ? 3 : 1;
        }
    }

    return $score;
}

function community_rank_score(array $story): float
{
    $relevance = topic_relevance_score((string) ($story['title'] ?? ''));
    $points = max(0, (int) ($story['score'] ?? 0));
    $comments = max(0, (int) ($story['descendants'] ?? 0));
    $ageHours = max(0, (time() - (int) ($story['time'] ?? time())) / 3600);
    $freshness = max(0, 48 - $ageHours);

    return ($relevance * 100) + ($points * 0.35) + ($comments * 0.65) + $freshness;
}

function hackernews_items(array $source): array
{
    $rawIds = http_get('https://hacker-news.firebaseio.com/v0/topstories.json');
    $ids = $rawIds ? json_decode($rawIds, true) : null;
    if (!is_array($ids)) {
        return [];
    }

    $urls = [];
    foreach (array_slice($ids, 0, 40) as $id) {
        $id = (int) $id;
        if ($id > 0) {
            $urls[$id] = 'https://hacker-news.firebaseio.com/v0/item/' . $id . '.json';
        }
    }

    $stories = [];
    foreach (http_get_many($urls, ['Accept: application/json']) as $id => $body) {
        $story = $body ? json_decode($body, true) : null;
        if (!is_array($story) || ($story['type'] ?? '') !== 'story' || empty($story['title'])) {
            continue;
        }

        $story['_rank'] = community_rank_score($story);
        $story['_relevance'] = topic_relevance_score((string) $story['title']);
        $stories[] = $story;
    }

    $relevantStories = array_values(array_filter($stories, static fn(array $story): bool => $story['_relevance'] > 0));
    usort($relevantStories, static fn(array $a, array $b): int => $b['_rank'] <=> $a['_rank']);

    return array_map(static function (array $story) use ($source): array {
        $points = max(0, (int) ($story['score'] ?? 0));
        $comments = max(0, (int) ($story['descendants'] ?? 0));
        $id = (int) $story['id'];

        return feed_item(
            (string) ($source['label'] ?? 'Hacker News'),
            (string) $story['title'],
            $points . ' points and ' . $comments . ' comments in the current engineering discussion.',
            'https://news.ycombinator.com/item?id=' . $id,
            gmdate(DATE_ATOM, (int) ($story['time'] ?? time())),
            'hackernews',
            3,
            'external',
            false,
            [
                'provider' => 'hackernews',
                'content_type' => 'discussion',
                'metrics' => ['score' => $points, 'comments' => $comments],
            ]
        );
    }, array_slice($relevantStories, 0, PROVIDER_ITEM_LIMIT));
}

function linkedin_post_title(string $commentary, bool $promoted): string
{
    $fallback = $promoted ? 'SystemPro sponsored update' : 'SystemPro company update';
    if ($commentary === '') {
        return $fallback;
    }

    $sentence = preg_split('/(?<=[.!?])\s+/', $commentary, 2)[0] ?? $commentary;
    return truncate_text($sentence, 90);
}

function linkedin_items(array $source): array
{
    $organizationUrn = 'urn:li:organization:' . $source['organization_id'];
    $query = http_build_query([
        'author' => $organizationUrn,
        'q' => 'author',
        'count' => PROVIDER_ITEM_LIMIT,
        'sortBy' => 'CREATED',
    ]);
    $raw = http_get('https://api.linkedin.com/rest/posts?' . $query, [
        'Authorization: Bearer ' . $source['token'],
        'X-Restli-Protocol-Version: 2.0.0',
        'Linkedin-Version: ' . $source['api_version'],
        'Accept: application/json',
    ]);
    $payload = $raw ? json_decode($raw, true) : null;
    if (!is_array($payload['elements'] ?? null)) {
        return [];
    }

    $items = [];
    foreach ($payload['elements'] as $post) {
        if (!is_array($post) || empty($post['id']) || ($post['lifecycleState'] ?? '') !== 'PUBLISHED') {
            continue;
        }

        $commentary = normalize_spaces((string) ($post['commentary'] ?? ''));
        $adContext = is_array($post['adContext'] ?? null) ? $post['adContext'] : [];
        $promoted = !empty($adContext) || !empty($adContext['isDsc']);
        $publishedAt = (int) ($post['publishedAt'] ?? $post['createdAt'] ?? 0);

        $items[] = feed_item(
            (string) ($source['label'] ?? 'LinkedIn / SystemPro'),
            linkedin_post_title($commentary, $promoted),
            $commentary ?: ($promoted ? 'Sponsored update from the SystemPro company page.' : 'Post from the SystemPro company page.'),
            'https://www.linkedin.com/feed/update/' . (string) $post['id'] . '/',
            $publishedAt > 0 ? gmdate(DATE_ATOM, (int) floor($publishedAt / 1000)) : null,
            'linkedin',
            $promoted ? 5 : 7,
            'external',
            false,
            ['provider' => 'linkedin', 'content_type' => $promoted ? 'ad' : 'post', 'promoted' => $promoted]
        );
    }

    return array_slice($items, 0, PROVIDER_ITEM_LIMIT);
}

function collect_source_items(array $source): array
{
    return match ((string) ($source['kind'] ?? '')) {
        'manual' => manual_items(),
        'github' => github_items($source),
        'rss' => rss_items($source),
        'hackernews' => hackernews_items($source),
        'linkedin' => linkedin_items($source),
        'x' => x_items($source),
        default => [],
    };
}

function compare_feed_items(array $left, array $right): int
{
    $priority = ($right['priority'] ?? 0) <=> ($left['priority'] ?? 0);
    if ($priority !== 0) {
        return $priority;
    }

    return strtotime((string) ($right['published_at'] ?? ''))
        <=> strtotime((string) ($left['published_at'] ?? ''));
}

function prepare_public_items(array $items): array
{
    usort($items, 'compare_feed_items');

    return array_map(static function (array $item): array {
        unset($item['priority']);
        return $item;
    }, array_slice($items, 0, MAX_ITEMS));
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

        $items = array_merge($items, collect_source_items($source));
    }

    $publicItems = prepare_public_items($items);

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
                'Hacker News uses its open official API; topic relevance, points, comments, and freshness determine ranking.',
                'LinkedIn company posts require LINKEDIN_ACCESS_TOKEN, LINKEDIN_ORGANIZATION_ID, LINKEDIN_API_VERSION, and r_organization_social access.',
                'LinkedIn items with adContext are exposed as promoted ads; other company items are exposed as posts.',
                'Discord has no global public trending feed; only configure server-specific ingestion when a bot is authorized in that server.',
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
