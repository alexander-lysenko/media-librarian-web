<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Language Lines For Mail Templates
    |--------------------------------------------------------------------------
    */
    'common' => [
        'greeting' => 'Hello :username,',
        'expiresIn' => 'This link expires in',
        'hours' => '{1} :count hour|[2,*] :count hours',
        'youCanContactUs' => 'You may also :contactus to ask for assistance in deleting your data from our services.',
        'contactUs' => 'contact us', // lowercase
        'noReply' => 'Replying to this message is unnecessary since it was generated automatically.',
    ],
    'verification' => [
        'title' => 'Please Confirm Your Email Address',
        'actionText' => 'Confirm Email',
        'intro' => [
            'first' => 'You have received this message as you are registered on :application with this e-mail address.',
            'common' => 'You have received this message because you requested a change of e-mail address for your account on :application.',
        ],
        'followTheWhiteRabbit' => 'A simple step is required to confirm that is really you - just follow the confirmation link by clicking the button below:',
        'troubles' => 'If you\'re having trouble clicking the ":actionText" button, copy and paste the URL below into your web browser:',
        'mistake' => [
            'first' => "If you have never signed up for our service or you think you received the message by mistake, please ignore it and don't take any actions!",
            'common' => "If you didn't initiate email address change or you think you received the message by mistake, please ignore it and don't take any actions!",
        ],
    ],
    'passwordReset' => [
        'title' => 'Password Reset',
        'actionText' => 'Reset Password',
        'intro' => 'You have received this message because you (or someone else) requested password reset on :application for account :email',
        'followTheWhiteRabbit' => 'If that was you, then confirm the password change by clicking the button below:',
        'troubles' => 'If you\'re having trouble clicking the ":actionText" button, copy and paste the URL below into your web browser:',
        'mistake' => "If you didn't initiate this request or you think you received the message by a mistake, please ignore it and don't take any actions!",
    ],
];
