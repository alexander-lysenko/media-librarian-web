<?php

namespace App\Providers;

use App\Events\PasswordResetLinkSent;
use App\Events\Registered;
use App\Listeners\RevokeKeysAfterPasswordReset;
use App\Listeners\SendPasswordResetNotification;
use App\Listeners\SendEmailVerificationNotification;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        PasswordResetLinkSent::class => [
            SendPasswordResetNotification::class,
        ],
        PasswordReset::class => [
            RevokeKeysAfterPasswordReset::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
