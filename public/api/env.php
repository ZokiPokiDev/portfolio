<?php
declare(strict_types=1);

function systempro_env_candidates(): array
{
    return [
        __DIR__ . '/.env',
        dirname(__DIR__) . '/.env',
        dirname(__DIR__, 2) . '/.env',
    ];
}

function systempro_unquote_env_value(string $value): string
{
    $value = trim($value);
    $length = strlen($value);

    if ($length >= 2) {
        $first = $value[0];
        $last = $value[$length - 1];

        if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
            $value = substr($value, 1, -1);
        }
    }

    return strtr($value, [
        '\n' => "\n",
        '\r' => "\r",
        '\t' => "\t",
        '\"' => '"',
        "\\'" => "'",
        '\\\\' => '\\',
    ]);
}

function systempro_load_env(?string $path = null): void
{
    static $loaded = false;

    if ($loaded) {
        return;
    }

    $loaded = true;
    $candidates = $path ? [$path] : systempro_env_candidates();

    foreach ($candidates as $candidate) {
        if (!is_readable($candidate)) {
            continue;
        }

        $lines = file($candidate, FILE_IGNORE_NEW_LINES);
        if (!is_array($lines)) {
            continue;
        }

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || substr($line, 0, 1) === '#') {
                continue;
            }

            if (substr($line, 0, 7) === 'export ') {
                $line = trim(substr($line, 7));
            }

            $separator = strpos($line, '=');
            if ($separator === false) {
                continue;
            }

            $key = trim(substr($line, 0, $separator));
            $value = systempro_unquote_env_value(substr($line, $separator + 1));

            if (!preg_match('/^[A-Z][A-Z0-9_]*$/', $key)) {
                continue;
            }

            if (getenv($key) !== false) {
                continue;
            }

            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}
