<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Media Librarian</title>

    <!-- Scripts and CSS import -->
    {{ vite_assets() }}
</head>
<body class="antialiased">
<div id="root"></div>
</body>
</html>
