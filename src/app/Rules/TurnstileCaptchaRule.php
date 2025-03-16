<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;

/**
 * A request validation rule to verify Turnstile Captcha via Cloudflare API
 * For custom translations:
 * - custom rule name is "captcha"
 * - key "validation.captcha.serverError" provides the following message: "An error occurred when verifying captcha",
 * and the message may be overridden in the translation files
 *
 * @see https://github.com/romanzipp/Laravel-Turnstile
 * @noinspection PhpClassCanBeReadonlyInspection
 */
class TurnstileCaptchaRule implements ValidationRule
{
    public function __construct(private readonly string $remoteIp) {}

    /**
     * @inheritdoc
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $serverErrorMessage = Lang::has('validation.captcha.serverError')
            ? trans('validation.captcha.serverError')
            : 'An error occurred when verifying captcha';

        try {
            $response = Http::withHeaders(['Accept' => 'application/json'])
                ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => env('CF_TURNSTILE_SECRET'),
                    'response' => $value,
                    'remoteip' => $this->remoteIp,
                ]);

            $response->throwIfServerError();
            $result = $response->json('success', false);

            if ($result === false) {
                $fail(trans("validation.custom.$attribute.captcha"));
            }
        } catch (ConnectionException|RequestException $e) {
            Log::error($e);
            $fail($serverErrorMessage);
        }
    }
}
