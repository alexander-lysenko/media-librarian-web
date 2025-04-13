{{--@component('mail::message')--}}
<x-mail::message>
    <h1>{{ trans('mail.verification.title') }}</h1>
    <p>{{ trans('mail.common.greeting', ['username' => $username]) }}<br />
        @if ($isFirstMessage)
            {{ trans('mail.verification.intro.first', ['application' => config('app.name')]) }}
        @else
            {{ trans('mail.verification.intro.common', ['application' => config('app.name')]) }}
        @endif
    </p>
    <p>
        {{ trans('mail.verification.followTheWhiteRabbit') }}
        <x-mail::button :url="$confirmationLink">
            {{ trans('mail.verification.actionText') }}
        </x-mail::button>
    </p>
    <p>
        {{ trans('mail.verification.troubles', ['actionText' => trans('mail.verification.actionText')]) }}<br />
        <code class="break-all">{{ $confirmationLink }}</code>
        {{ trans('mail.common.expiresIn') . ' ' .  trans_choice('mail.common.hours', 48) }}
    </p>
    <small>
        {{ $isFirstMessage ? trans('mail.verification.mistake.first') : trans('mail.verification.mistake.common')}}
    </small>
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
