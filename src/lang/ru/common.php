<?php

/** @see /vendor/laravel/framework/src/Illuminate/Translation/lang/ */
return [
    /*
    |--------------------------------------------------------------------------
    | Различные языковые строки без категории
    |--------------------------------------------------------------------------
    */
    'auth' => [
        'invalid' => 'Неверные адрес email и/или пароль.',
        'success' => 'Успешный вход.',
    ],
    'signup' => [
        'created' => 'Ваш аккаунт успешно создан.',
        'mustConfirmEmail' => 'Вам необходимо подтвердить адрес e-mail для активации аккаунта.',
    ],
    'password' => [
        'reset' => 'Пароль сброшен. Теперь Вы можете войти в аккаунт с новым паролем.',
        'sent' => 'Мы отправили Вам ссылку электронным письмом. Проверьте почтовый ящик.',
        'throttled' => 'Please wait before retrying.',
        'token' => 'This password reset token is invalid.',
        'user' => "We can't find a user with that email address.",
    ],
];
