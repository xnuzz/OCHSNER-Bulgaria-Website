<?php
// POST /api/v1/contact (PHP port of api/v1/contact.js)
require __DIR__ . '/_lib.php';

require_post();
rate_limit_or_429();
$b = read_body();

validate_or_400(array(
    'name' => array(
        chk_required($b, 'name', 'Моля, въведете вашето име.'),
        chk_max($b, 'name', 120, 'Името е твърде дълго.'),
    ),
    'phone' => array(
        chk_required($b, 'phone', 'Моля, въведете телефон за връзка.'),
        chk_phone($b, 'phone', 'Моля, въведете валиден телефонен номер.'),
    ),
    'email' => array(
        chk_required($b, 'email', 'Моля, въведете имейл адрес.'),
        chk_email($b, 'email', 'Моля, въведете валиден имейл адрес.'),
        chk_max($b, 'email', 180, 'Имейл адресът е твърде дълъг.'),
    ),
    'requestType' => array(
        chk_one_of($b, 'requestType', array('HEAT_PUMP_INTEREST', 'EXISTING_CUSTOMER', 'OTHER'), 'Моля, изберете тип запитване.'),
    ),
    'city' => array(
        chk_max($b, 'city', 120, 'Името на населеното място е твърде дълго.'),
    ),
    'message' => array(
        chk_required($b, 'message', 'Моля, опишете накратко вашето запитване.'),
        chk_min($b, 'message', 10, 'Съобщението трябва да е между 10 и 4000 символа.'),
        chk_max($b, 'message', 4000, 'Съобщението трябва да е между 10 и 4000 символа.'),
    ),
    'gdprConsent' => array(
        chk_true($b, 'gdprConsent', 'Необходимо е съгласие с политиката за поверителност.'),
    ),
));

$city = str_of($b, 'city');
notify('Ново запитване от сайта — ' . $b['requestType'], array(
    'Име: ' . str_of($b, 'name'),
    'Телефон: ' . str_of($b, 'phone'),
    'Имейл: ' . str_of($b, 'email'),
    'Град: ' . ($city !== '' ? $city : '—'),
    'Тип: ' . $b['requestType'],
    '',
    str_of($b, 'message'),
), str_of($b, 'email'));

accepted();
