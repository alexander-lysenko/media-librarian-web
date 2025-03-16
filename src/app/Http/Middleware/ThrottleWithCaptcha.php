<?php

namespace App\Http\Middleware;

use App\Rules\TurnstileCaptchaRule;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Exceptions\MissingRateLimiterException;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

/**
 * A middleware to simulate API throttling and force using CAPTCHA to unlock rate limiter.
 * When the rate limit exceeds, providing the CAPTCHA response is mandatory to proceed.
 * CAPTCHA response may be optionally provided even when the rate limit is not exceeded,
 * to avoid automated requests or prevent request forgery, then its verification will still perform and may even fail.
 * When verification succeeded, rate limiter will reset anyway.
 *
 * @see https://peterbabic.dev/blog/throttle-with-recaptcha-laravel-middleware/
 * @see https://bannister.me/blog/custom-throttle-middleware
 */
class ThrottleWithCaptcha extends ThrottleRequests
{
    /**
     * Handle an incoming request.
     *
     * $this->limiter->hit() is invoked in the beginning intentionally
     * because $this->limiter->tooManyAttempts() gets triggerred when the remaining attempts amount is less than 0,
     * thus setting $maxAttempts to 1 really produces 1 clean attempt
     * and setting $maxAttempts to 0 immediately triggers `tooManyAttempts()` and forces to use Captcha.
     *
     * @param Request $request
     * @param Closure $next
     * @param int $maxAttempts
     * @param int $decayMinutes
     * @param string $prefix
     *
     * @return Response
     * @throws MissingRateLimiterException
     */
    public function handle($request, Closure $next, $maxAttempts = 3, $decayMinutes = 600, $prefix = ''): Response
    {
        $errorMessage = '';
        $key = $prefix . $this->resolveRequestSignature($request);
        $maxAttempts = $this->resolveMaxAttempts($request, $maxAttempts);
        $validator = Validator::make($request->input(), [
            'cf-turnstile-response' => ['required', 'string', new TurnstileCaptchaRule($request->ip())],
        ]);

        $this->limiter->hit($key, decaySeconds: $decayMinutes * 60);

        if ($this->limiter->tooManyAttempts($key, $maxAttempts) || $request->has('cf-turnstile-response')) {
            try {
                $validator->stopOnFirstFailure()->validate();
                $this->limiter->clear($key);
            } catch (ValidationException $exception) {
                $errorMessage = $exception->validator->errors()->first();
            }
        }

        /** @var JsonResponse $response */
        $response = $next($request);
        $rateLimitHeaders = $this->getHeaders(
            maxAttempts: $maxAttempts,
            remainingAttempts: $this->calculateRemainingAttempts($key, $maxAttempts),
            retryAfter: $this->limiter->availableIn($key),
            response: $response
        );

        $response->headers->add($rateLimitHeaders);
        if ($errorMessage) {
            $response->setData(['message' => $errorMessage])->setStatusCode(code: Response::HTTP_TOO_MANY_REQUESTS);
        }

        return $response;
    }
}
