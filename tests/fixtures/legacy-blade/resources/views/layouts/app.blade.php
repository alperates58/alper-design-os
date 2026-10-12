<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Legacy Laravel Portal</title>
    <link rel="stylesheet" href="/css/bootstrap-3.css">
    <link rel="stylesheet" href="/css/legacy.css">
</head>
<body style="background-color: #eef2f5;">
    <div class="navbar navbar-default" style="margin-bottom: 0px; border-radius: 0;">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="/dashboard">Blade Legacy App</a>
            </div>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="/profile">My Account</a></li>
                <li>
                    <form method="POST" action="/logout">
                        @csrf
                        <button type="submit" class="btn btn-link navbar-btn">Logout</button>
                    </form>
                </li>
            </ul>
        </div>
    </div>

    <div class="container-fluid" style="margin-top: 15px;">
        @yield('content')
    </div>
</body>
</html>
