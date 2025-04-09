{{--@component('mail::message')--}}
<x-mail::message>
    <h1>{{ trans('email.resetPass.title') }}</h1>
    <p>
        {{ trans('email.resetPass.hello', ['username' => $username]) }}<br />
        {{ trans('email.resetPass.intro', ['application' => config('app.name'), 'email' => $email]) }}
    </p>
    <p>
        {{ trans('email.resetPass.followTheWhiteRabbit') }}
        <x-mail::button :url="$resetPasswordLink">
            {{ trans('email.resetPass.actionText') }}
        </x-mail::button>
    </p>
    <p>
        {{ trans('email.resetPass.troubles', ['actionText' => trans('email.resetPass.actionText')]) }}<br />
        <code class="break-all">{{ $resetPasswordLink }}</code>
        {{ trans('email.common.expiresIn') . trans_choice('email.common.hours', 4) }}
    </p>
    <small>{{ trans('email.resetPass.mistake')}}</small>
    <br />
    <small>{!! trans('email.resetPass.contactUs', [
        'contactus' => "<a href='mailto:$contactEmail'>" . trans('common.contactUs_lc') . '</a>',
    ]) !!}</small>
    <x-mail::subcopy>
        {{ config('app.name') }}
        <br />
        <small>{{ trans('email.common.noReply') }}</small>
    </x-mail::subcopy>
</x-mail::message>
{{--@endcomponent--}}
