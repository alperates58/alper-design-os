<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel Logistics Dispatch</title>
    </head>
    <body class="font-sans antialiased">
        <div class="dispatch-container">
            <header>
                <h2>Active Fleet Vehicles</h2>
            </header>
            @if(count($vehicles) > 0)
                <ul>
                    @foreach($vehicles as $vehicle)
                        <li>{{ $vehicle->plate }} - {{ $vehicle->status }}</li>
                    @endforeach
                </ul>
            @else
                <p>No active vehicles in transit.</p>
            @endif
        </div>
    </body>
</html>
