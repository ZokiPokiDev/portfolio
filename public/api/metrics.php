<?php
declare(strict_types=1);

require_once __DIR__ . '/env.php';
systempro_load_env();

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

function request_param(string $key, $default = '')
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

function safe_text($value, int $limit = 500): string
{
    $value = trim(strip_tags((string) $value));
    $value = (string) preg_replace('/\s+/', ' ', $value);

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $limit);
    }

    return substr($value, 0, $limit);
}

function safe_multiline($value, int $limit = 2000): string
{
    $value = trim(strip_tags((string) $value));
    $value = (string) preg_replace("/\r\n|\r/", "\n", $value);
    $value = (string) preg_replace("/\n{3,}/", "\n\n", $value);

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $limit);
    }

    return substr($value, 0, $limit);
}

function storage_dir(): string
{
    $dir = getenv('METRICS_STORAGE_DIR');

    if (!$dir) {
        $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'systempro-portfolio-metrics';
    }

    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }

    return $dir;
}

function storage_file(string $name): string
{
    return storage_dir() . DIRECTORY_SEPARATOR . $name;
}

function ip_hash(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    $salt = getenv('METRICS_HASH_SALT') ?: __DIR__;

    return hash('sha256', $ip . '|' . $salt);
}

function sqlite_available(): bool
{
    return class_exists('PDO') && in_array('sqlite', PDO::getAvailableDrivers(), true);
}

function metrics_db(): ?PDO
{
    static $pdo = null;
    static $checked = false;

    if ($checked) {
        return $pdo;
    }

    $checked = true;

    if (!sqlite_available()) {
        return null;
    }

    try {
        $pdo = new PDO('sqlite:' . storage_file('metrics.sqlite'));
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec('CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT NOT NULL,
            path TEXT,
            source TEXT,
            campaign TEXT,
            region TEXT,
            referrer TEXT,
            user_agent TEXT,
            ip_hash TEXT,
            metadata_json TEXT,
            created_at TEXT NOT NULL
        )');
        $pdo->exec('CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT NOT NULL,
            company TEXT,
            region TEXT,
            project_type TEXT,
            budget TEXT,
            timeline TEXT,
            message TEXT,
            source TEXT,
            campaign TEXT,
            path TEXT,
            user_agent TEXT,
            ip_hash TEXT,
            created_at TEXT NOT NULL
        )');
    } catch (Throwable $exception) {
        $pdo = null;
    }

    return $pdo;
}

function append_jsonl(string $file, array $record): void
{
    @file_put_contents(storage_file($file), json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function metadata_json($metadata): string
{
    if (!is_array($metadata)) {
        return '{}';
    }

    return json_encode($metadata, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

function store_event(array $event): string
{
    $pdo = metrics_db();

    if ($pdo) {
        $statement = $pdo->prepare('INSERT INTO events
            (event_name, path, source, campaign, region, referrer, user_agent, ip_hash, metadata_json, created_at)
            VALUES
            (:event_name, :path, :source, :campaign, :region, :referrer, :user_agent, :ip_hash, :metadata_json, :created_at)');
        $statement->execute($event);
        return 'sqlite';
    }

    append_jsonl('events.jsonl', $event);
    return 'jsonl';
}

function store_lead(array $lead): string
{
    $pdo = metrics_db();

    if ($pdo) {
        $statement = $pdo->prepare('INSERT INTO leads
            (name, email, company, region, project_type, budget, timeline, message, source, campaign, path, user_agent, ip_hash, created_at)
            VALUES
            (:name, :email, :company, :region, :project_type, :budget, :timeline, :message, :source, :campaign, :path, :user_agent, :ip_hash, :created_at)');
        $statement->execute($lead);
        return 'sqlite';
    }

    append_jsonl('leads.jsonl', $lead);
    return 'jsonl';
}

function event_record(): array
{
    return [
        'event_name' => safe_text(request_param('event', 'event'), 80),
        'path' => safe_text(request_param('path', ''), 240),
        'source' => safe_text(request_param('source', ''), 80),
        'campaign' => safe_text(request_param('campaign', ''), 120),
        'region' => safe_text(request_param('region', ''), 80),
        'referrer' => safe_text(request_param('referrer', ''), 300),
        'user_agent' => safe_text($_SERVER['HTTP_USER_AGENT'] ?? '', 300),
        'ip_hash' => ip_hash(),
        'metadata_json' => metadata_json(request_param('metadata', [])),
        'created_at' => gmdate(DATE_ATOM),
    ];
}

function lead_record(): array
{
    return [
        'name' => safe_text(request_param('name', ''), 120),
        'email' => safe_text(request_param('email', ''), 180),
        'company' => safe_text(request_param('company', ''), 160),
        'region' => safe_text(request_param('region', ''), 80),
        'project_type' => safe_text(request_param('project_type', ''), 120),
        'budget' => safe_text(request_param('budget', ''), 80),
        'timeline' => safe_text(request_param('timeline', ''), 80),
        'message' => safe_multiline(request_param('message', ''), 2000),
        'source' => safe_text(request_param('source', ''), 80),
        'campaign' => safe_text(request_param('campaign', ''), 120),
        'path' => safe_text(request_param('path', ''), 240),
        'user_agent' => safe_text($_SERVER['HTTP_USER_AGENT'] ?? '', 300),
        'ip_hash' => ip_hash(),
        'created_at' => gmdate(DATE_ATOM),
    ];
}

function summary_from_sqlite(PDO $pdo): array
{
    $eventCounts = $pdo->query('SELECT event_name, COUNT(*) AS total FROM events GROUP BY event_name ORDER BY total DESC')->fetchAll(PDO::FETCH_ASSOC);
    $leadCounts = $pdo->query('SELECT region, project_type, COUNT(*) AS total FROM leads GROUP BY region, project_type ORDER BY total DESC')->fetchAll(PDO::FETCH_ASSOC);
    $recentLeads = $pdo->query('SELECT created_at, name, email, company, region, project_type, budget, timeline, source, campaign FROM leads ORDER BY id DESC LIMIT 20')->fetchAll(PDO::FETCH_ASSOC);

    return [
        'store' => 'sqlite',
        'events' => $eventCounts,
        'leads' => $leadCounts,
        'recent_leads' => $recentLeads,
    ];
}

function summary_from_jsonl(): array
{
    $eventLines = is_file(storage_file('events.jsonl')) ? file(storage_file('events.jsonl'), FILE_SKIP_EMPTY_LINES) : [];
    $leadLines = is_file(storage_file('leads.jsonl')) ? file(storage_file('leads.jsonl'), FILE_SKIP_EMPTY_LINES) : [];
    $eventTotal = is_array($eventLines) ? count($eventLines) : 0;
    $leadTotal = is_array($leadLines) ? count($leadLines) : 0;

    return [
        'store' => 'jsonl',
        'events' => [['event_name' => 'all', 'total' => $eventTotal]],
        'leads' => [['region' => 'all', 'project_type' => 'all', 'total' => $leadTotal]],
        'recent_leads' => [],
    ];
}

function require_summary_secret(): void
{
    $secret = getenv('METRICS_DASHBOARD_SECRET') ?: '';

    if ($secret === '' || request_param('secret', '') !== $secret) {
        json_response(['error' => 'summary_not_allowed'], 403);
    }
}

$route = (string) request_param('route', 'event');

try {
    switch ($route) {
        case 'ping':
            json_response([
                'ok' => true,
                'store' => metrics_db() ? 'sqlite' : 'jsonl',
                'time' => gmdate(DATE_ATOM),
            ]);
            break;

        case 'event':
            if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
                json_response(['error' => 'event_requires_post'], 405);
            }

            $record = event_record();
            $store = store_event($record);
            json_response(['ok' => true, 'store' => $store]);
            break;

        case 'lead':
            if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
                json_response(['error' => 'lead_requires_post'], 405);
            }

            if (trim((string) request_param('website', '')) !== '') {
                json_response(['ok' => true, 'stored' => false]);
            }

            $lead = lead_record();
            if (!filter_var($lead['email'], FILTER_VALIDATE_EMAIL) || $lead['message'] === '') {
                json_response(['error' => 'invalid_lead'], 422);
            }

            $store = store_lead($lead);
            store_event(array_merge(event_record(), [
                'event_name' => 'lead_created',
                'path' => $lead['path'],
                'source' => $lead['source'],
                'campaign' => $lead['campaign'],
                'region' => $lead['region'],
                'metadata_json' => metadata_json([
                    'project_type' => $lead['project_type'],
                    'budget' => $lead['budget'],
                    'timeline' => $lead['timeline'],
                ]),
            ]));

            json_response(['ok' => true, 'store' => $store]);
            break;

        case 'summary':
            require_summary_secret();
            $pdo = metrics_db();
            json_response($pdo ? summary_from_sqlite($pdo) : summary_from_jsonl());
            break;

        default:
            json_response(['error' => 'unknown_route', 'route' => $route], 404);
    }
} catch (Throwable $exception) {
    json_response([
        'error' => 'metrics_error',
        'message' => $exception->getMessage(),
    ], 500);
}
