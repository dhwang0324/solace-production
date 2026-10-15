<?php
// Contact form handler for solaceproduction.com (runs on Hostinger PHP).
// Receives the form on /contact/ and emails it to the studio inbox.
// No credentials are stored here; mail goes out through the server's own mail().

const TO_EMAIL   = 'dani@solaceproduction.com';
const FROM_EMAIL = 'no-reply@solaceproduction.com'; // must be on the site's own domain so the mail is not marked as spoofed
const SITE_NAME  = 'Solace Productions';
const MAX_PER_HOUR = 5; // per visitor, to stop floods

$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

function finish(bool $ok, int $status, string $message, bool $wantsJson): void {
    http_response_code($status);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message]);
    } else {
        header('Location: /contact/?' . ($ok ? 'sent=1' : 'error=1'), true, 303);
    }
    exit;
}

function clean(string $v, int $max): string {
    $v = trim(str_replace("\0", '', $v));
    return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max);
}
// One line only: removes anything that could add extra mail headers
function oneLine(string $v): string { return trim(preg_replace('/[\r\n]+/', ' ', $v)); }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}

// Hidden field that real visitors never fill in: pretend success and drop the message
if (!empty($_POST['company'])) {
    finish(true, 200, 'Thanks, your message is on its way.', $wantsJson);
}

$name    = oneLine(clean((string)($_POST['name'] ?? ''), 120));
$email   = oneLine(clean((string)($_POST['email'] ?? ''), 200));
$message = clean((string)($_POST['message'] ?? ''), 5000);
$needs   = [];
if (isset($_POST['needs']) && is_array($_POST['needs'])) {
    foreach (array_slice($_POST['needs'], 0, 12) as $n) { $needs[] = oneLine(clean((string)$n, 60)); }
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    finish(false, 422, 'Please add your name, a valid email and a message.', $wantsJson);
}

// Simple rate limit per visitor (files in the server's temp folder)
$ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$file = sys_get_temp_dir() . '/solace-form-' . md5($ip) . '.json';
$now  = time();
$hits = [];
if (is_file($file)) { $hits = json_decode((string)@file_get_contents($file), true) ?: []; }
$hits = array_values(array_filter($hits, fn($t) => $t > $now - 3600));
if (count($hits) >= MAX_PER_HOUR) {
    finish(false, 429, 'Too many messages just now. Please email ' . TO_EMAIL . ' instead.', $wantsJson);
}
$hits[] = $now;
@file_put_contents($file, json_encode($hits), LOCK_EX);

$subject = 'New enquiry from ' . $name . ' (' . SITE_NAME . ' website)';
$body = "New message from the contact form\r\n\r\n"
      . "Name: $name\r\n"
      . "Email: $email\r\n"
      . 'Needs: ' . ($needs ? implode(', ', $needs) : 'not specified') . "\r\n\r\n"
      . "Message:\r\n" . str_replace(["\r\n", "\r"], "\n", $message) . "\r\n";
$body = str_replace("\n", "\r\n", str_replace("\r\n", "\n", $body));

$headerName = trim(preg_replace('/[<>",;:]+/', '', $name)); // keeps the visitor's name from altering the Reply-To header
$headers = [
    'From: ' . SITE_NAME . ' website <' . FROM_EMAIL . '>',
    'Reply-To: ' . ($headerName !== '' ? $headerName . ' ' : '') . '<' . $email . '>', // hitting Reply in Gmail answers the visitor
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: solaceproduction.com contact form',
];
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$sent = @mail(TO_EMAIL, $encodedSubject, $body, implode("\r\n", $headers), '-f' . FROM_EMAIL);
if (!$sent) {
    finish(false, 500, 'We could not send that just now. Please email ' . TO_EMAIL . ' instead.', $wantsJson);
}
finish(true, 200, 'Thanks, your message is on its way. We reply personally.', $wantsJson);
