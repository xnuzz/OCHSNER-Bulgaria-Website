<?php
/*
 * Shared code for the PHP form endpoints on SuperHosting. Ports api/_lib/{http,
 * ratelimit,notify}.js: same validation, same Bulgarian messages, same JSON shapes,
 * so the Vue app cannot tell which backend answered.
 *
 * Mail goes through PHP mail() (the server's own Exim), so no SMTP password is needed.
 */

const NOTIFY_EMAIL = 'info@ochsner.bg';
const MAIL_FROM = 'no-reply@ochsner.bg';

const RL_WINDOW = 600; // 10 minutes
const RL_MAX_PER_IP = 5;
const RL_MAX_GLOBAL = 60;

if (basename($_SERVER['SCRIPT_FILENAME']) === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

function send_json($status, $payload)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function api_error($status, $message, $fieldErrors = array())
{
    send_json($status, array(
        'status' => $status,
        'message' => $message,
        'fieldErrors' => (object) $fieldErrors,
        'timestamp' => gmdate('Y-m-d\TH:i:s.v\Z'),
    ));
}

function require_post()
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Allow: POST');
        api_error(405, 'Методът не е разрешен.');
    }
}

function read_body()
{
    $raw = file_get_contents('php://input', false, null, 0, 65537);
    if (strlen($raw) > 65536) api_error(413, 'Заявката е твърде голяма.');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : array();
}

// --- field checks (same rules as api/_lib/http.js) ---------------------------

function str_of($b, $k)
{
    return isset($b[$k]) && is_string($b[$k]) ? trim($b[$k]) : '';
}

function len($s)
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen(utf8_decode($s));
}

function chk_required($b, $k, $msg) { return str_of($b, $k) !== '' ? null : $msg; }
function chk_max($b, $k, $max, $msg) { return len(str_of($b, $k)) <= $max ? null : $msg; }
function chk_min($b, $k, $min, $msg) { return len(str_of($b, $k)) >= $min ? null : $msg; }
function chk_phone($b, $k, $msg) { return preg_match('/^[0-9+()\-\s]{6,40}$/', str_of($b, $k)) ? null : $msg; }
function chk_email($b, $k, $msg) { return preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', str_of($b, $k)) ? null : $msg; }
function chk_one_of($b, $k, $allowed, $msg)
{
    if (!isset($b[$k])) return $msg;
    return in_array($b[$k], $allowed, true) ? null : $msg;
}
function chk_true($b, $k, $msg) { return isset($b[$k]) && $b[$k] === true ? null : $msg; }

/** First failing check per field wins; each field maps to a list of check results. */
function collect_errors($fields)
{
    $errors = array();
    foreach ($fields as $field => $results) {
        foreach ($results as $r) {
            if ($r !== null) { $errors[$field] = $r; break; }
        }
    }
    return $errors;
}

function validate_or_400($fields)
{
    $errors = collect_errors($fields);
    if ($errors) api_error(400, 'Моля, проверете попълнените данни.', $errors);
}

function accepted()
{
    send_json(201, array(
        'id' => (int) round(microtime(true) * 1000),
        'message' => 'Благодарим ви! Получихме вашето запитване и ще се свържем с вас в рамките на един работен ден.',
    ));
}

// --- rate limit (per IP + global, file-backed so it survives between requests) ---

function rate_limit_or_429()
{
    $file = sys_get_temp_dir() . '/ochsner-form-ratelimit.json';
    $fh = fopen($file, 'c+');
    if (!$fh) return; // never block a real lead because the counter is unavailable
    flock($fh, LOCK_EX);
    $hits = json_decode(stream_get_contents($fh), true);
    if (!is_array($hits)) $hits = array();

    $now = time();
    foreach ($hits as $key => $stamps) {
        $live = array_values(array_filter($stamps, function ($t) use ($now) { return $now - $t < RL_WINDOW; }));
        if ($live) $hits[$key] = $live; else unset($hits[$key]);
    }

    $ipKey = 'ip:' . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown');
    $ipHits = isset($hits[$ipKey]) ? $hits[$ipKey] : array();
    $globalHits = isset($hits['global']) ? $hits['global'] : array();
    $overIp = count($ipHits) >= RL_MAX_PER_IP;
    $overGlobal = count($globalHits) >= RL_MAX_GLOBAL;

    if (!$overIp && !$overGlobal) {
        $hits[$ipKey] = array_merge($ipHits, array($now));
        $hits['global'] = array_merge($globalHits, array($now));
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);

    if ($overIp || $overGlobal) {
        $oldest = $overIp ? $ipHits[0] : $globalHits[0];
        header('Retry-After: ' . max(1, RL_WINDOW - ($now - $oldest)));
        api_error(429, 'Получихме твърде много заявки от това устройство. Моля, опитайте отново след няколко минути.');
    }
}

// --- mail ---------------------------------------------------------------------

function notify($subject, $lines, $replyTo)
{
    $body = implode("\n", $lines);
    $headers = implode("\r\n", array(
        'From: OCHSNER България <' . MAIL_FROM . '>',
        // Validated by chk_email (no whitespace), so it cannot inject headers.
        'Reply-To: ' . $replyTo,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ));
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    if (!@mail(NOTIFY_EMAIL, $encodedSubject, $body, $headers, '-f' . MAIL_FROM)) {
        // Never fail the visitor over mail, but keep the lead recoverable from the error log.
        error_log("[MAIL — FAILED]\n$subject\n$body");
    }
}
