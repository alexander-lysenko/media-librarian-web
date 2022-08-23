<?php

use Illuminate\Support\HtmlString;

function vite_assets(): HtmlString
{
    $devServerHost = env('UI_SERVER_HOST', "http://localhost:3000");

    if (app()->environment('local')) {
        return new HtmlString(<<<HTML
            <script type="module" src="{$devServerHost}/@vite/client"></script>
            <script type="module" src="{$devServerHost}/index.ts"></script>
        HTML
        );
    }

    $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);

    return new HtmlString(<<<HTML
        <script type="module" src="/build/{$manifest['frontend/index.ts']['file']}"></script>
        <link rel="stylesheet" href="/build/{$manifest['frontend/index.ts']['css'][0]}">
    HTML
    );
}
