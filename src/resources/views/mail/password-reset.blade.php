{{--@component('mail::message')--}}
<x-mail::message>
    <h1>{{ trans('mail.passwordReset.title') }}</h1>
    <p>
        {{ trans('mail.common.greeting', ['username' => $username]) }}<br />
        {{ trans('mail.passwordReset.intro', ['application' => config('app.name'), 'email' => $email]) }}
    </p>
    <p>
        {{ trans('mail.passwordReset.followTheWhiteRabbit') }}
        <x-mail::button :url="$resetPasswordLink">
            {{ trans('mail.passwordReset.actionText') }}
        </x-mail::button>
    </p>
    <p>
        {{ trans('mail.passwordReset.troubles', ['actionText' => trans('mail.passwordReset.actionText')]) }}<br />
        <code class="break-all">{{ $resetPasswordLink }}</code>
        {{ trans('mail.common.expiresIn') . ' ' .  trans_choice('mail.common.hours', 4) }}
    </p>
    <small>{{ trans('mail.passwordReset.mistake')}}</small>
    <br />
    <small>{!! trans('mail.common.youCanContactUs', [
        'contactus' => "<a href='mailto:$contactEmail'>" . trans('mail.common.contactUs') . '</a>',
    ]) !!}</small>
    <x-mail::subcopy>
        {{ config('app.name') }}
        <br />
        <small>{{ trans('mail.common.noReply') }}</small>
    </x-mail::subcopy>
</x-mail::message>
{{--@endcomponent--}}
