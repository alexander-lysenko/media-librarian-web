{{--@component('mail::message')--}}
<x-mail::message>
    <h1>{{ trans('email.confirm.title') }}</h1>
    <p>{{ trans('email.confirm.hello', ['username' => $username]) }},</p>
    @if ($isFirstMessage)
        {{ trans('email.confirm.intro.first', ['application' => config('app.name')]) }}
    @else
        {{ trans('email.confirm.intro.common', ['application' => config('app.name')]) }}
    @endif
    {{ trans('email.confirm.followTheWhiteRabbit') }}
    <x-mail::button :url="$confirmationLink">
        {{ trans('email.confirm.actionText') }}
    </x-mail::button>
    <p>{{ trans('email.confirm.troubles', ['actionText' => trans('email.confirm.actionText')]) }}</p>
    <code>{{ $confirmationLink }}</code>
    <br />
    <br />
    <p>{{ trans('email.confirm.expiresIn') . trans_choice('email.common.hours', 48, ['value' => 48]) }}</p>
    <small>{{ $isFirstMessage ? trans('email.confirm.mistake.first') : trans('email.confirm.mistake.common')}}</small>
    <br />
    <small>{!! trans('email.confirm.contactUs', [
        'contactus' => "<a href='mailto:$contactEmail'>" . trans('common.contactUs_lc') . '</a>',
    ]) !!}</small>
    <x-mail::subcopy>
        {{ config('app.name') }}
        <br />
        <small>{{ trans('email.common.noReply') }}</small>
    </x-mail::subcopy>
</x-mail::message>
{{--@endcomponent--}}
