<x-mail::layout xmlns:x-mail="">
    {{-- Greeting --}}
    @if (! empty($greeting))
        # {{ $greeting }}
    @else
        # @lang('Hello!')
    @endif


    {{-- Action Button --}}
    {{--    @isset($actionText)--}}
    {{--        @component('mail::button', ['url' => $actionUrl, 'color' => $color])--}}
    {{--            {{ $actionText }}--}}
    {{--        @endcomponent--}}
    {{--    @endisset--}}


    {{-- Salutation --}}
    {{--    @if (! empty($salutation))--}}
    {{--        {{ $salutation }}--}}
    {{--    @else--}}
    {{--        @lang('Regards'),<br>--}}
    {{--        {{ config('app.name') }}--}}
    {{--    @endif--}}

    {{-- Subcopy --}}
    {{--    @isset($actionText)--}}
    {{--        @slot('subcopy')--}}
    {{--            @lang(--}}
    {{--                "If you're having trouble clicking the \":actionText\" button, copy and paste the URL below\n".--}}
    {{--                'into your web browser:',--}}
    {{--                [--}}
    {{--                    'actionText' => $actionText,--}}
    {{--                ]--}}
    {{--            ) <span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span>--}}
    {{--        @endslot--}}
    {{--    @endisset--}}
</x-mail::layout>
