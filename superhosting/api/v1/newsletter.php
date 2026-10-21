<?php
// POST /api/v1/newsletter (PHP port of api/v1/newsletter.js)
require __DIR__ . '/_lib.php';

require_post();
rate_limit_or_429();
$b = read_body();

validate_or_400(array(
    'email' => array(
        chk_required($b, 'email', 'Моля, въведете имейл адрес.'),
        chk_email($b, 'email', 'Моля, въведете валиден имейл адрес.'),
        chk_max($b, 'email', 180, 'Имейл адресът е твърде дълъг.'),
    ),
));

$email = str_of($b, 'email');
notify('Нов абонат за бюлетина — ' . $email, array(
    'Клиент се абонира за бюлетина от сайта.',
    '',
    'Имейл: ' . $email,
    'Дата: ' . (new DateTime('now', new DateTimeZone('Europe/Sofia')))->format('d.m.Y H:i'),
    '',
    'Моля, добавете адреса в списъка за бюлетина и му изпращайте новините на OCHSNER.',
), $email);

accepted();
