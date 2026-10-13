<?php
// POST /api/v1/partner-applications (PHP port of api/v1/partner-applications.js)
require __DIR__ . '/_lib.php';

require_post();
rate_limit_or_429();
$b = read_body();

validate_or_400(array(
    'companyName' => array(
        chk_required($b, 'companyName', 'Моля, въведете име на фирмата.'),
        chk_max($b, 'companyName', 180, 'Името на фирмата е твърде дълго.'),
    ),
    'activity' => array(
        chk_one_of($b, 'activity', array('INSTALLER', 'HVAC_COMPANY', 'BUILDER', 'ARCHITECT', 'OTHER'), 'Моля, изберете вид дейност.'),
    ),
    'contactPerson' => array(
        chk_required($b, 'contactPerson', 'Моля, въведете лице за контакт.'),
        chk_max($b, 'contactPerson', 120, 'Името е твърде дълго.'),
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
    'city' => array(
        chk_max($b, 'city', 120, 'Името на населеното място е твърде дълго.'),
    ),
    'message' => array(
        chk_max($b, 'message', 4000, 'Съобщението е твърде дълго.'),
    ),
    'gdprConsent' => array(
        chk_true($b, 'gdprConsent', 'Необходимо е съгласие с политиката за поверителност.'),
    ),
));

$city = str_of($b, 'city');
notify('Нова партньорска заявка — ' . str_of($b, 'companyName'), array(
    'Фирма: ' . str_of($b, 'companyName'),
    'Дейност: ' . $b['activity'],
    'Лице за контакт: ' . str_of($b, 'contactPerson'),
    'Телефон: ' . str_of($b, 'phone'),
    'Имейл: ' . str_of($b, 'email'),
    'Град: ' . ($city !== '' ? $city : '—'),
    '',
    str_of($b, 'message'),
), str_of($b, 'email'));

accepted();
