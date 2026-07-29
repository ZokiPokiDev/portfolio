<?php
declare(strict_types=1);

require_once __DIR__ . '/env.php';
systempro_load_env();

// =============================================================================
// BOOTSTRAP
// =============================================================================

setup_headers();
handle_options_request();

// =============================================================================
// HEADERS & CORS
// =============================================================================

/** @return void */
function setup_headers(): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

/** @return void */
function handle_options_request(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// =============================================================================
// RESPONSE HANDLING
// =============================================================================

/** @param array<string, mixed> $payload @return void */
function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/** @param string $error @param int $status @param string $message @param array<string, mixed> $extra @return never */
function json_error(string $error, int $status = 400, string $message = '', array $extra = []): void
{
    $payload = ['error' => $error];
    if ($message !== '') {
        $payload['message'] = $message;
    }
    if (!empty($extra)) {
        $payload = array_merge($payload, $extra);
    }
    json_response($payload, $status);
}

// =============================================================================
// REQUEST UTILITIES
// =============================================================================

/** @return array<string, mixed> */
function request_json(): array
{
    static $json = null;

    if ($json !== null) {
        return $json;
    }

    $raw = file_get_contents('php://input') ?: '';
    $decoded = json_decode($raw, true);
    $json = is_array($decoded) ? $decoded : [];

    return $json;
}

/**
 * Get request parameter from GET, POST, or JSON body.
 * Uses a functional approach with multiple sources checked in order.
 * 
 * @param string $key
 * @param mixed $default
 * @return mixed
 */
function request_param(string $key, $default = null)
{
    $sources = [
        $_GET,
        $_POST,
        request_json(),
    ];

    foreach ($sources as $source) {
        if (is_array($source) && array_key_exists($key, $source)) {
            return $source[$key];
        }
    }

    return $default;
}

/**
 * Curried function to get param with default.
 * @param string $key
 * @return callable
 */
function get_param(string $key): callable
{
    return fn($default = null) => request_param($key, $default);
}

// =============================================================================
// REQUEST DATA EXTRACTION
// =============================================================================

/** @return string */
function get_http_referer(): string
{
    return safe_text($_SERVER['HTTP_REFERER'] ?? '', 500);
}

/** @return string */
function get_user_agent(): string
{
    return safe_text($_SERVER['HTTP_USER_AGENT'] ?? '', 500);
}

/** @return string */
function get_client_ip(): string
{
    // Check for forwarded IPs (behind proxy)
    $headers = [
        'HTTP_CF_CONNECTING_IP',     // Cloudflare
        'HTTP_X_FORWARDED_FOR',      // Standard proxy
        'HTTP_X_REAL_IP',            // Nginx
        'REMOTE_ADDR',               // Direct connection
    ];
    
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = $_SERVER[$header];
            // Handle comma-separated list (X-Forwarded-For can have multiple IPs)
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

// =============================================================================
// SANITIZATION
// ==============================================================================

/** @param mixed $value @return string */
function sanitize_string($value): string
{
    return (string) $value;
}

/** @param string $value @param int $limit @return string */
function truncate_string(string $value, int $limit): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $limit);
    }
    return substr($value, 0, $limit);
}

/** @param string $value @return string */
function strip_html_tags(string $value): string
{
    return strip_tags($value);
}

/** @param string $value @return string */
function normalize_whitespace(string $value): string
{
    return (string) preg_replace('/\s+/', ' ', $value);
}

/** @param string $value @return string */
function normalize_line_breaks(string $value): string
{
    $value = (string) preg_replace("/\r\n|\r/", "\n", $value);
    return (string) preg_replace("/\n{3,}/", "\n\n", $value);
}

/**
 * Compose multiple string transformations.
 * @param callable ...$functions
 * @return callable
 */
function compose_string_transforms(callable ...$functions): callable
{
    return function(string $value) use ($functions): string {
        return array_reduce(
            $functions,
            fn(string $carry, callable $fn) => $fn($carry),
            $value
        );
    };
}

/** @param mixed $value @param int $limit @return string */
function safe_text($value, int $limit = 500): string
{
    $transform = compose_string_transforms(
        'sanitize_string',
        'strip_html_tags',
        'trim',
        'normalize_whitespace',
        fn(string $v) => truncate_string($v, $limit)
    );
    return $transform($value);
}

/** @param mixed $value @param int $limit @return string */
function safe_multiline($value, int $limit = 2000): string
{
    $transform = compose_string_transforms(
        'sanitize_string',
        'strip_html_tags',
        'trim',
        'normalize_line_breaks',
        fn(string $v) => truncate_string($v, $limit)
    );
    return $transform($value);
}

// =============================================================================
// BOT DETECTION
// =============================================================================

/** @return bool */
function is_bot(): bool
{
    $userAgent = strtolower(get_user_agent());
    
    $botKeywords = [
        'bot',
        'crawl',
        'spider',
        'slurp',
        'googlebot',
        'bingbot',
        'yandex',
        'baidu',
        'duckduck',
        'facebot',
        'twitterbot',
        'slackbot',
        'discord',
        'whatsapp',
        'telegram',
        'headless',
        'phantom',
        'puppeteer',
        'playwright',
    ];
    
    foreach ($botKeywords as $keyword) {
        if (strpos($userAgent, $keyword) !== false) {
            return true;
        }
    }
    
    return false;
}

// =============================================================================
// GEO-LOCATION (Simple IP-based region detection)
// =============================================================================

/** @return string */
function detect_region_from_ip(): string
{
    // Try to get from Cloudflare headers first
    $country = strtoupper($_SERVER['HTTP_CF_IPCOUNTRY'] ?? '');
    if ($country !== '' && strlen($country) === 2) {
        return $country;
    }
    
    // Try other common headers
    $headers = [
        'HTTP_GEOIP_COUNTRY_CODE',
        'HTTP_X_COUNTRY_CODE',
        'HTTP_X_GEOIP_COUNTRY',
    ];
    
    foreach ($headers as $header) {
        $country = strtoupper($_SERVER[$header] ?? '');
        if ($country !== '' && strlen($country) === 2) {
            return $country;
        }
    }
    
    // If no header available, return empty (will be set from request param if provided)
    return '';
}

/** @return string */
function detect_city_from_ip(): string
{
    // Try Cloudflare city
    $city = $_SERVER['HTTP_CF_IPCTY'] ?? '';
    if ($city !== '') {
        return safe_text($city, 80);
    }
    
    return '';
}

// =============================================================================
// STORAGE
// =============================================================================

/** @return string */
function storage_dir(): string
{
    $dir = getenv('METRICS_STORAGE_DIR') ?: null;

    if ($dir === null || $dir === '') {
        $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'systempro-portfolio-metrics';
    }

    if (!is_dir($dir)) {
        if (!@mkdir($dir, 0700, true)) {
            error_log("Failed to create storage directory: {$dir}");
        }
    }

    // Ensure directory is readable and writable
    if (!is_readable($dir) || !is_writable($dir)) {
        error_log("Storage directory is not accessible: {$dir}");
    }

    return $dir;
}

/** @param string $name @return string */
function storage_file(string $name): string
{
    return storage_dir() . DIRECTORY_SEPARATOR . $name;
}

/**
 * Ensure storage file exists and is writable.
 * @param string $name @return bool
 */
function ensure_storage_file(string $name): bool
{
    $file = storage_file($name);
    $dir = dirname($file);
    
    if (!is_dir($dir)) {
        return false;
    }
    
    if (!is_writable($dir)) {
        return false;
    }
    
    return true;
}

// =============================================================================
// IDENTIFICATION
// =============================================================================

/** @return string */
function ip_hash(): string
{
    $ip = get_client_ip();
    $salt = getenv('METRICS_HASH_SALT') ?: __DIR__;
    return hash('sha256', $ip . '|' . $salt);
}

/** @return string */
function get_visitor_id(): string
{
    // Check for existing visitor cookie
    if (isset($_COOKIE['visitor_id'])) {
        return hash('sha256', $_COOKIE['visitor_id'] . '|' . getenv('METRICS_HASH_SALT'));
    }
    
    // Generate new visitor ID based on IP + user agent
    $identifier = get_client_ip() . '|' . get_user_agent();
    return hash('sha256', $identifier . '|' . getenv('METRICS_HASH_SALT'));
}

// =============================================================================
// DATABASE
// =============================================================================

/** @return bool */
function sqlite_available(): bool
{
    return class_exists('PDO') && in_array('sqlite', PDO::getAvailableDrivers(), true);
}

/** @return ?PDO */
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

    $file = storage_file('metrics.sqlite');
    
    try {
        $pdo = new PDO('sqlite:' . $file);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        initialize_database_schema($pdo);
    } catch (Throwable $exception) {
        error_log("Database initialization failed: " . $exception->getMessage());
        $pdo = null;
    }

    return $pdo;
}

/** @param PDO $pdo @return void */
function initialize_database_schema(PDO $pdo): void
{
    $statements = [
        'CREATE TABLE IF NOT EXISTS events (' .
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' .
            'event_name TEXT NOT NULL,' .
            'path TEXT,' .
            'source TEXT,' .
            'campaign TEXT,' .
            'region TEXT,' .
            'city TEXT,' .
            'referrer TEXT,' .
            'user_agent TEXT,' .
            'ip_hash TEXT,' .
            'visitor_id TEXT,' .
            'is_bot INTEGER DEFAULT 0,' .
            'metadata_json TEXT,' .
            'created_at TEXT NOT NULL' .
        ')',
        'CREATE TABLE IF NOT EXISTS leads (' .
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' .
            'name TEXT,' .
            'email TEXT NOT NULL,' .
            'company TEXT,' .
            'region TEXT,' .
            'city TEXT,' .
            'project_type TEXT,' .
            'budget TEXT,' .
            'timeline TEXT,' .
            'message TEXT,' .
            'source TEXT,' .
            'campaign TEXT,' .
            'path TEXT,' .
            'user_agent TEXT,' .
            'ip_hash TEXT,' .
            'visitor_id TEXT,' .
            'created_at TEXT NOT NULL' .
        ')',
        // Indexes for faster queries
        'CREATE INDEX IF NOT EXISTS idx_events_path ON events(path)',
        'CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at)',
        'CREATE INDEX IF NOT EXISTS idx_events_ip_hash ON events(ip_hash)',
        'CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events(visitor_id)',
        'CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name)',
        'CREATE INDEX IF NOT EXISTS idx_events_region ON events(region)',
        'CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at)',
        'CREATE INDEX IF NOT EXISTS idx_leads_region ON leads(region)',
    ];

    array_map(fn(string $sql) => $pdo->exec($sql), $statements);
}

// =============================================================================
// JSONL STORAGE (FALLBACK)
// =============================================================================

/** @param string $file @param array<string, mixed> $record @return bool */
function append_jsonl(string $file, array $record): bool
{
    if (!ensure_storage_file($file)) {
        return false;
    }
    
    $content = json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL;
    $bytes = @file_put_contents(storage_file($file), $content, FILE_APPEND | LOCK_EX);
    return $bytes !== false;
}

/** @param mixed $metadata @return string */
function metadata_json($metadata): string
{
    if (!is_array($metadata)) {
        return '{}';
    }
    return json_encode($metadata, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

// =============================================================================
// EVENT STORAGE
// =============================================================================

/** @param PDO $pdo @param array<string, mixed> $event @return bool */
function store_event_sqlite(PDO $pdo, array $event): bool
{
    try {
        $statement = $pdo->prepare('INSERT INTO events ' .
            '(event_name, path, source, campaign, region, city, referrer, user_agent, ip_hash, visitor_id, is_bot, metadata_json, created_at) ' .
            'VALUES ' .
            '(:event_name, :path, :source, :campaign, :region, :city, :referrer, :user_agent, :ip_hash, :visitor_id, :is_bot, :metadata_json, :created_at)');
        return $statement->execute($event);
    } catch (Throwable $e) {
        error_log("Event storage failed: " . $e->getMessage());
        return false;
    }
}

/** @param array<string, mixed> $event @return string */
function store_event(array $event): string
{
    $pdo = metrics_db();
    
    if ($pdo !== null) {
        if (store_event_sqlite($pdo, $event)) {
            return 'sqlite';
        }
    }
    
    if (append_jsonl('events.jsonl', $event)) {
        return 'jsonl';
    }
    
    return 'failed';
}

// =============================================================================
// PAGEVIEW & CLICK TRACKING
// =============================================================================

/** @param string $path @param string $title @param array<string, mixed> $extra @return array<string, mixed> */
function pageview_event(string $path, string $title = '', array $extra = []): array
{
    $base = base_record_data();
    $region = request_param('region', detect_region_from_ip());
    $city = request_param('city', detect_city_from_ip());
    
    return array_merge($base, [
        'event_name' => 'pageview',
        'path' => safe_text($path, 500),
        'source' => safe_text(request_param('source', ''), 80),
        'campaign' => safe_text(request_param('campaign', ''), 120),
        'region' => safe_text($region, 80),
        'city' => safe_text($city, 80),
        'referrer' => safe_text(request_param('referrer', get_http_referer()), 500),
        'user_agent' => get_user_agent(),
        'ip_hash' => ip_hash(),
        'visitor_id' => get_visitor_id(),
        'is_bot' => is_bot() ? 1 : 0,
        'metadata_json' => metadata_json(array_merge([
            'title' => safe_text($title, 200),
            'host' => parse_url($path, PHP_URL_HOST) ?: '',
        ], $extra)),
    ]);
}

/** @param string $element @param string $path @param array<string, mixed> $extra @return array<string, mixed> */
function click_event(string $element, string $path, array $extra = []): array
{
    $base = base_record_data();
    $region = request_param('region', detect_region_from_ip());
    $city = request_param('city', detect_city_from_ip());
    
    return array_merge($base, [
        'event_name' => 'click',
        'path' => safe_text($path, 500),
        'source' => safe_text(request_param('source', ''), 80),
        'campaign' => safe_text(request_param('campaign', ''), 120),
        'region' => safe_text($region, 80),
        'city' => safe_text($city, 80),
        'referrer' => safe_text(request_param('referrer', get_http_referer()), 500),
        'user_agent' => get_user_agent(),
        'ip_hash' => ip_hash(),
        'visitor_id' => get_visitor_id(),
        'is_bot' => is_bot() ? 1 : 0,
        'metadata_json' => metadata_json(array_merge([
            'element' => safe_text($element, 200),
            'element_type' => safe_text($extra['element_type'] ?? 'button', 50),
            'text' => safe_text($extra['text'] ?? '', 200),
        ], $extra)),
    ]);
}

// =============================================================================
// LEAD STORAGE & NOTIFICATIONS
// =============================================================================

/** @param PDO $pdo @param array<string, mixed> $lead @return bool */
function store_lead_sqlite(PDO $pdo, array $lead): bool
{
    try {
        $statement = $pdo->prepare('INSERT INTO leads ' .
            '(name, email, company, region, city, project_type, budget, timeline, message, source, campaign, path, user_agent, ip_hash, visitor_id, created_at) ' .
            'VALUES ' .
            '(:name, :email, :company, :region, :city, :project_type, :budget, :timeline, :message, :source, :campaign, :path, :user_agent, :ip_hash, :visitor_id, :created_at)');
        return $statement->execute($lead);
    } catch (Throwable $e) {
        error_log("Lead storage failed: " . $e->getMessage());
        return false;
    }
}

/** @param array<string, mixed> $lead @return string */
function store_lead(array $lead): string
{
    $pdo = metrics_db();
    
    if ($pdo !== null) {
        if (store_lead_sqlite($pdo, $lead)) {
            return 'sqlite';
        }
    }
    
    if (append_jsonl('leads.jsonl', $lead)) {
        return 'jsonl';
    }
    
    return 'failed';
}

// =============================================================================
// NOTIFICATION OBSERVERS
// =============================================================================

/** @return string */
function get_notification_email(): string
{
    return getenv('LEAD_NOTIFICATION_EMAIL') ?: 'panev.zoran.te@gmail.com';
}

/** @return string */
function get_notification_from(): string
{
    return getenv('LEAD_NOTIFICATION_FROM') ?: 'noreply@system-pro.tech';
}

/** @param array<string, mixed> $lead @return array<string, string> */
function build_email_headers(array $lead): array
{
    $from = get_notification_from();
    $replyTo = $lead['email'] ?? $from;
    
    return [
        'From' => $from,
        'Reply-To' => $replyTo,
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-Type' => 'text/plain; charset=UTF-8',
    ];
}

/** @param array<string, mixed> $lead @return string */
function build_email_subject(array $lead): string
{
    $identifier = $lead['company'] ?: $lead['name'] ?: 'Unknown';
    return 'New Project Lead: ' . $identifier;
}

/** @param array<string, mixed> $lead @return string */
function build_email_body(array $lead): string
{
    $fields = [
        'Name' => 'name',
        'Email' => 'email',
        'Company' => 'company',
        'Region' => 'region',
        'City' => 'city',
        'Project Type' => 'project_type',
        'Budget' => 'budget',
        'Timeline' => 'timeline',
        'Message' => 'message',
        'Path' => 'path',
        'Source' => 'source',
        'Campaign' => 'campaign',
    ];
    
    $lines = array_map(
        fn(string $label, string $key) => $label . ": " . ($lead[$key] ?? 'N/A'),
        array_keys($fields),
        array_values($fields)
    );
    
    return "New lead submission:\n\n" . implode("\n", $lines) . "\n";
}

/** @param array<string, mixed> $lead @return bool */
function send_lead_notification(array $lead): bool
{
    $to = get_notification_email();
    $subject = build_email_subject($lead);
    $body = build_email_body($lead);
    $headers = build_email_headers($lead);
    
    $headerString = array_reduce(
        array_keys($headers),
        fn(string $carry, string $key) => $carry . $key . ': ' . $headers[$key] . "\r\n",
        ''
    );
    
    $result = @mail($to, $subject, $body, rtrim($headerString));
    
    if (!$result) {
        error_log("Failed to send lead notification to: {$to}");
    }
    
    return $result;
}

// =============================================================================
// RECORD BUILDERS
// =============================================================================

/** @return array<string, mixed> */
function base_record_data(): array
{
    return [
        'user_agent' => get_user_agent(),
        'ip_hash' => ip_hash(),
        'visitor_id' => get_visitor_id(),
        'is_bot' => is_bot() ? 1 : 0,
        'created_at' => gmdate(DATE_ATOM),
    ];
}

/** @return array<string, mixed> */
function event_record(): array
{
    $base = base_record_data();
    $region = request_param('region', detect_region_from_ip());
    $city = request_param('city', detect_city_from_ip());
    
    return array_merge($base, [
        'event_name' => safe_text(request_param('event', 'event'), 80),
        'path' => safe_text(request_param('path', ''), 500),
        'source' => safe_text(request_param('source', ''), 80),
        'campaign' => safe_text(request_param('campaign', ''), 120),
        'region' => safe_text($region, 80),
        'city' => safe_text($city, 80),
        'referrer' => safe_text(request_param('referrer', get_http_referer()), 500),
        'metadata_json' => metadata_json(request_param('metadata', [])),
    ]);
}

/** @return array<string, mixed> */
function lead_record(): array
{
    $base = base_record_data();
    $region = request_param('region', detect_region_from_ip());
    $city = request_param('city', detect_city_from_ip());
    
    return array_merge($base, [
        'name' => safe_text(request_param('name', ''), 120),
        'email' => safe_text(request_param('email', ''), 180),
        'company' => safe_text(request_param('company', ''), 160),
        'region' => safe_text($region, 80),
        'city' => safe_text($city, 80),
        'project_type' => safe_text(request_param('project_type', ''), 120),
        'budget' => safe_text(request_param('budget', ''), 80),
        'timeline' => safe_text(request_param('timeline', ''), 80),
        'message' => safe_multiline(request_param('message', ''), 2000),
        'source' => safe_text(request_param('source', ''), 80),
        'campaign' => safe_text(request_param('campaign', ''), 120),
        'path' => safe_text(request_param('path', ''), 500),
    ]);
}

/** @param array<string, mixed> $lead @return array<string, mixed> */
function lead_created_event(array $lead): array
{
    $base = event_record();
    
    return array_merge($base, [
        'event_name' => 'lead_created',
        'path' => $lead['path'],
        'source' => $lead['source'],
        'campaign' => $lead['campaign'],
        'region' => $lead['region'],
        'city' => $lead['city'],
        'metadata_json' => metadata_json([
            'project_type' => $lead['project_type'],
            'budget' => $lead['budget'],
            'timeline' => $lead['timeline'],
        ]),
    ]);
}

// =============================================================================
// SUMMARY & ANALYTICS
// =============================================================================

/** @param PDO $pdo @return array<string, mixed> */
function query_event_counts(PDO $pdo): array
{
    $results = $pdo->query(
        'SELECT event_name, COUNT(*) AS total FROM events GROUP BY event_name ORDER BY total DESC'
    )->fetchAll(PDO::FETCH_ASSOC);
    
    return is_array($results) ? $results : [];
}

/** @param PDO $pdo @return array<string, mixed> */
function query_lead_aggregates(PDO $pdo): array
{
    $results = $pdo->query(
        'SELECT region, project_type, COUNT(*) AS total FROM leads GROUP BY region, project_type ORDER BY total DESC'
    )->fetchAll(PDO::FETCH_ASSOC);
    
    return is_array($results) ? $results : [];
}

/** @param PDO $pdo @return array<string, mixed> */
function query_recent_leads(PDO $pdo): array
{
    $results = $pdo->query(
        'SELECT created_at, name, email, company, region, city, project_type, budget, timeline, source, campaign FROM leads ORDER BY id DESC LIMIT 20'
    )->fetchAll(PDO::FETCH_ASSOC);
    
    return is_array($results) ? $results : [];
}

/** @param PDO $pdo @return array<string, mixed> */
function query_pageview_stats(PDO $pdo, string $period = '7 days'): array
{
    $results = $pdo->query(
        "SELECT path, COUNT(*) AS views, COUNT(DISTINCT ip_hash) AS unique_visitors, " .
        "COUNT(DISTINCT visitor_id) AS unique_users, COUNT(DISTINCT region) AS regions " .
        "FROM events WHERE event_name = 'pageview' AND created_at >= datetime('now', '-{$period}') " .
        "GROUP BY path ORDER BY views DESC LIMIT 50"
    )->fetchAll(PDO::FETCH_ASSOC);
    
    return is_array($results) ? $results : [];
}

/** @param PDO $pdo @return array<string, mixed> */
function query_click_stats(PDO $pdo, string $period = '7 days'): array
{
    // Extract element from metadata_json
    $results = $pdo->query(
        "SELECT path, metadata_json, COUNT(*) AS clicks FROM events " .
        "WHERE event_name = 'click' AND created_at >= datetime('now', '-{$period}') " .
        "GROUP BY path, metadata_json ORDER BY clicks DESC LIMIT 50"
    )->fetchAll(PDO::FETCH_ASSOC);
    
    // Parse metadata to get element
    return array_map(function(array $row) {
        $meta = json_decode($row['metadata_json'], true);
        $row['element'] = $meta['element'] ?? 'unknown';
        $row['element_type'] = $meta['element_type'] ?? 'button';
        unset($row['metadata_json']);
        return $row;
    }, $results);
}

/** @param PDO $pdo @return array<string, mixed> */
function query_visitor_stats(PDO $pdo): array
{
    // Total visitors
    $totalVisitors = $pdo->query("SELECT COUNT(DISTINCT visitor_id) AS total FROM events")
        ->fetch(PDO::FETCH_ASSOC);
    
    // Active visitors (last 30 minutes)
    $activeVisitors = $pdo->query(
        "SELECT COUNT(DISTINCT visitor_id) AS active FROM events " .
        "WHERE created_at >= datetime('now', '-30 minutes')"
    )->fetch(PDO::FETCH_ASSOC);
    
    // Visitors by region
    $visitorsByRegion = $pdo->query(
        "SELECT region, COUNT(DISTINCT visitor_id) AS visitors FROM events " .
        "WHERE region != '' GROUP BY region ORDER BY visitors DESC"
    )->fetchAll(PDO::FETCH_ASSOC);
    
    // Visitors by city
    $visitorsByCity = $pdo->query(
        "SELECT city, COUNT(DISTINCT visitor_id) AS visitors FROM events " .
        "WHERE city != '' GROUP BY city ORDER BY visitors DESC LIMIT 20"
    )->fetchAll(PDO::FETCH_ASSOC);
    
    return [
        'total' => $totalVisitors['total'] ?? 0,
        'active' => $activeVisitors['active'] ?? 0,
        'by_region' => $visitorsByRegion,
        'by_city' => $visitorsByCity,
    ];
}

/** @param PDO $pdo @return array<string, mixed> */
function query_traffic_sources(PDO $pdo, string $period = '30 days'): array
{
    $results = $pdo->query(
        "SELECT referrer, COUNT(*) AS visits FROM events " .
        "WHERE referrer != '' AND created_at >= datetime('now', '-{$period}') " .
        "GROUP BY referrer ORDER BY visits DESC LIMIT 20"
    )->fetchAll(PDO::FETCH_ASSOC);
    
    return is_array($results) ? $results : [];
}

/** @param PDO $pdo @return array<string, mixed> */
function query_daily_stats(PDO $pdo, int $days = 30): array
{
    $results = $pdo->query(
        "SELECT date(created_at) AS day, COUNT(*) AS total, " .
        "COUNT(DISTINCT ip_hash) AS unique_ips, " .
        "COUNT(DISTINCT visitor_id) AS unique_visitors " .
        "FROM events WHERE created_at >= date('now', '-{$days} days') " .
        "GROUP BY date(created_at) ORDER BY day DESC"
    )->fetchAll(PDO::FETCH_ASSOC);
    
    return is_array($results) ? $results : [];
}

/** @param PDO $pdo @return array<string, mixed> */
function summary_from_sqlite(PDO $pdo): array
{
    return [
        'store' => 'sqlite',
        'events' => query_event_counts($pdo),
        'leads' => query_lead_aggregates($pdo),
        'recent_leads' => query_recent_leads($pdo),
        'pageviews' => query_pageview_stats($pdo),
        'clicks' => query_click_stats($pdo),
        'visitors' => query_visitor_stats($pdo),
        'traffic_sources' => query_traffic_sources($pdo),
        'daily' => query_daily_stats($pdo),
    ];
}

/** @return array<string> */
function read_jsonl_lines(string $file): array
{
    if (!is_file(storage_file($file))) {
        return [];
    }
    
    $lines = file(storage_file($file), FILE_SKIP_EMPTY_LINES);
    return is_array($lines) ? $lines : [];
}

/** @return array<string, mixed> */
function summary_from_jsonl(): array
{
    $eventLines = read_jsonl_lines('events.jsonl');
    $leadLines = read_jsonl_lines('leads.jsonl');
    
    // Count pageviews and clicks from events
    $pageviews = 0;
    $clicks = 0;
    
    foreach ($eventLines as $line) {
        $event = json_decode($line, true);
        if (is_array($event)) {
            if (($event['event_name'] ?? '') === 'pageview') {
                $pageviews++;
            }
            if (($event['event_name'] ?? '') === 'click') {
                $clicks++;
            }
        }
    }
    
    return [
        'store' => 'jsonl',
        'events' => [['event_name' => 'all', 'total' => count($eventLines)]],
        'leads' => [['region' => 'all', 'project_type' => 'all', 'total' => count($leadLines)]],
        'recent_leads' => [],
        'pageviews' => [['path' => 'all', 'views' => $pageviews, 'unique_visitors' => 0, 'unique_users' => 0, 'regions' => 0]],
        'clicks' => [],
        'visitors' => ['total' => 0, 'active' => 0, 'by_region' => [], 'by_city' => []],
        'traffic_sources' => [],
        'daily' => [],
    ];
}

// =============================================================================
// AUTHORIZATION
// =============================================================================

/** @return string */
function get_dashboard_secret(): string
{
    return getenv('METRICS_DASHBOARD_SECRET') ?: '';
}

/** @return void */
function require_summary_secret(): void
{
    $secret = get_dashboard_secret();
    
    if ($secret === '' || request_param('secret', '') !== $secret) {
        json_error('summary_not_allowed', 403);
    }
}

// =============================================================================
// VALIDATION
// =============================================================================

/** @param string $email @return bool */
function is_valid_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/** @param array<string, mixed> $lead @return bool */
function is_valid_lead(array $lead): bool
{
    return is_valid_email($lead['email'] ?? '') && ($lead['message'] ?? '') !== '';
}

/** @return bool */
function is_spam_request(): bool
{
    return trim((string) request_param('website', '')) !== '';
}

// =============================================================================
// HTTP METHOD UTILITIES
// =============================================================================

/** @return string */
function request_method(): string
{
    return $_SERVER['REQUEST_METHOD'] ?? 'GET';
}

/** @param string $method @return bool */
function is_post_request(string $method): bool
{
    return strtoupper($method) === 'POST';
}

/** @return bool */
function is_post(): bool
{
    return is_post_request(request_method());
}

// =============================================================================
// ROUTE HANDLERS (ACTIONS)
// =============================================================================

/** @return void */
function handle_ping(): void
{
    json_response([
        'ok' => true,
        'store' => metrics_db() ? 'sqlite' : 'jsonl',
        'time' => gmdate(DATE_ATOM),
    ]);
}

/** @return void */
function handle_event(): void
{
    if (!is_post()) {
        json_error('event_requires_post', 405);
    }
    
    $record = event_record();
    $store = store_event($record);
    
    json_response(['ok' => true, 'store' => $store]);
}

/** @return void */
function handle_pageview(): void
{
    if (!is_post()) {
        json_error('pageview_requires_post', 405);
    }
    
    $path = request_param('path', '');
    $title = request_param('title', '');
    $extra = request_param('metadata', []);
    
    if (empty($path)) {
        json_error('path_required', 400);
    }
    
    $record = pageview_event($path, $title, is_array($extra) ? $extra : []);
    $store = store_event($record);
    
    json_response(['ok' => true, 'store' => $store, 'event' => 'pageview']);
}

/** @return void */
function handle_click(): void
{
    if (!is_post()) {
        json_error('click_requires_post', 405);
    }
    
    $element = request_param('element', '');
    $path = request_param('path', '');
    $extra = request_param('metadata', []);
    
    if (empty($element)) {
        json_error('element_required', 400);
    }
    
    $record = click_event($element, $path, is_array($extra) ? $extra : []);
    $store = store_event($record);
    
    json_response(['ok' => true, 'store' => $store, 'event' => 'click']);
}

/** @return void */
function handle_lead(): void
{
    if (!is_post()) {
        json_error('lead_requires_post', 405);
    }
    
    if (is_spam_request()) {
        json_response(['ok' => true, 'stored' => false]);
    }
    
    $lead = lead_record();
    
    if (!is_valid_lead($lead)) {
        json_error('invalid_lead', 422);
    }
    
    $store = store_lead($lead);
    $emailSent = send_lead_notification($lead);
    
    // Observer pattern: trigger event on lead creation
    store_event(lead_created_event($lead));
    
    json_response(['ok' => true, 'store' => $store, 'email_sent' => $emailSent]);
}

/** @return void */
function handle_summary(): void
{
    require_summary_secret();
    
    $pdo = metrics_db();
    $summary = $pdo ? summary_from_sqlite($pdo) : summary_from_jsonl();
    
    json_response($summary);
}

/** @return void */
function handle_stats(): void
{
    require_summary_secret();
    
    $pdo = metrics_db();
    if (!$pdo) {
        json_response(summary_from_jsonl());
        return;
    }
    
    $period = request_param('period', '7 days');
    
    json_response([
        'pageviews' => query_pageview_stats($pdo, $period),
        'clicks' => query_click_stats($pdo, $period),
        'visitors' => query_visitor_stats($pdo),
        'traffic_sources' => query_traffic_sources($pdo, $period),
        'daily' => query_daily_stats($pdo),
    ]);
}

/** @param string $route @return void */
function handle_unknown_route(string $route): void
{
    json_error('unknown_route', 404, '', ['route' => $route]);
}

// =============================================================================
// ROUTER
// =============================================================================

/** @return array<string, callable> */
function get_route_handlers(): array
{
    return [
        'ping' => 'handle_ping',
        'event' => 'handle_event',
        'pageview' => 'handle_pageview',
        'click' => 'handle_click',
        'lead' => 'handle_lead',
        'summary' => 'handle_summary',
        'stats' => 'handle_stats',
    ];
}

/** @return callable */
function get_router(): callable
{
    $handlers = get_route_handlers();
    
    return function(string $route) use ($handlers): void {
        $handler = $handlers[$route] ?? null;
        
        if ($handler !== null && function_exists($handler)) {
            $handler();
            return;
        }
        
        handle_unknown_route($route);
    };
}

/** @return void */
function run_router(): void
{
    $route = (string) request_param('route', 'event');
    $router = get_router();
    
    try {
        $router($route);
    } catch (Throwable $exception) {
        json_response([
            'error' => 'metrics_error',
            'message' => $exception->getMessage(),
        ], 500);
    }
}

// =============================================================================
// ENTRY POINT
// =============================================================================

run_router();
