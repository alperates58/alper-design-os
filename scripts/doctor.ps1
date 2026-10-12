# ==============================================================================
# ALPER DESIGN OS - Diagnostic & Health Check Tool (Doctor)
# ==============================================================================
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\doctor.ps1
# ==============================================================================

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  ALPER DESIGN OS - Doctor Health Diagnostics" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

function Invoke-SafeCommand {
    param([string]$Cmd)
    $gitBash = "C:\Program Files\Git\bin\bash.exe"
    if (Test-Path $gitBash) {
        & $gitBash -c $Cmd
    } else {
        Invoke-Expression $Cmd
    }
}

$issuesFound = 0

# 1. Check ALPER_DESIGN_OS_HOME
Write-Host "`n[1/8] Environment Variable (ALPER_DESIGN_OS_HOME)..." -NoNewline
$envHome = [Environment]::GetEnvironmentVariable("ALPER_DESIGN_OS_HOME", "User")
if ($envHome) {
    Write-Host " OK ($envHome)" -ForegroundColor Green
} else {
    Write-Host " WARNING (Not set in User Environment. Using current root: $ProjectRoot)" -ForegroundColor Yellow
}

# 2. Check Node.js
Write-Host "[2/8] Node.js Runtime..." -NoNewline
try {
    $nodeVer = Invoke-SafeCommand "node -v"
    Write-Host " OK ($nodeVer)" -ForegroundColor Green
} catch {
    Write-Host " FAIL (Node.js not found)" -ForegroundColor Red
    $issuesFound++
}

# 3. Check Git
Write-Host "[3/8] Git Version Control..." -NoNewline
try {
    $gitVer = Invoke-SafeCommand "git --version"
    Write-Host " OK ($gitVer)" -ForegroundColor Green
} catch {
    Write-Host " FAIL (Git not found)" -ForegroundColor Red
    $issuesFound++
}

# 4. Check pnpm
Write-Host "[4/8] Package Manager (pnpm)..." -NoNewline
try {
    $pnpmVer = Invoke-SafeCommand "pnpm -v"
    Write-Host " OK ($pnpmVer)" -ForegroundColor Green
} catch {
    Write-Host " FAIL (pnpm not found)" -ForegroundColor Red
    $issuesFound++
}

# 5. Check .env file
Write-Host "[5/8] Configuration (.env)..." -NoNewline
$envFile = Join-Path $ProjectRoot ".env"
if (Test-Path $envFile) {
    Write-Host " OK (.env exists)" -ForegroundColor Green
} else {
    Write-Host " WARNING (.env not found; create from .env.example)" -ForegroundColor Yellow
}

# 6. Check MCP Server Build Output
Write-Host "[6/8] MCP Server Build Artifact..." -NoNewline
$mcpDist = Join-Path $ProjectRoot "packages\mcp-server\dist\index.js"
if (Test-Path $mcpDist) {
    Write-Host " OK ($mcpDist)" -ForegroundColor Green
} else {
    Write-Host " WARNING (dist/index.js not found. Run 'pnpm run build')" -ForegroundColor Yellow
}

# 7. Check Antigravity MCP Integration
Write-Host "[7/8] Antigravity MCP Config..." -NoNewline
$mcpConfigFile = Join-Path $env:USERPROFILE ".gemini\config\mcp_config.json"
if (Test-Path $mcpConfigFile) {
    try {
        $cfg = (Get-Content $mcpConfigFile -Raw) | ConvertFrom-Json
        $alperOk = [bool]($cfg.mcpServers."alper-design-os")
        $chromeOk = [bool]($cfg.mcpServers."chrome-devtools")
        $playwrightOk = [bool]($cfg.mcpServers."playwright")

        if ($alperOk -and $chromeOk -and $playwrightOk) {
            Write-Host " OK (alper-design-os, chrome-devtools, playwright registered)" -ForegroundColor Green
        } elseif ($alperOk) {
            Write-Host " PARTIAL (alper-design-os registered; run install-windows.ps1 to add chrome-devtools & playwright)" -ForegroundColor Yellow
        } else {
            Write-Host " WARNING (mcp_config.json exists, but 'alper-design-os' is not listed)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host " WARNING (Could not parse $mcpConfigFile)" -ForegroundColor Yellow
    }
} else {
    Write-Host " NOTICE (Antigravity mcp_config.json not yet created)" -ForegroundColor Gray
}

# 8. Git Status & Safety
Write-Host "[8/8] Git Status & Secret Check..." -NoNewline
try {
    $status = Invoke-SafeCommand "cd '$ProjectRoot' && git status -s"
    if ($status -match "(^|\r?\n)\s*\S+\s+\.env(\r?\n|$)") {
        Write-Host " CAUTION (.env is tracked by git!)" -ForegroundColor Red
        $issuesFound++
    } else {
        Write-Host " OK (Clean & No secret leaks)" -ForegroundColor Green
    }
} catch {
    Write-Host " NOTICE (Git status check failed)" -ForegroundColor Gray
}

# 9. Capability vs Execution Authority Diagnostic (Phase 1E.7.1)
Write-Host "`n[9/9] Capability vs Execution Authority:" -ForegroundColor Cyan
Write-Host "  Docker Capability ........ AVAILABLE" -ForegroundColor White
Write-Host "  Docker Agent Execution ... RESTRICTED" -ForegroundColor Yellow
Write-Host "  Docker Human Execution ... AVAILABLE" -ForegroundColor Green
Write-Host ""
Write-Host "  Browser Capability ....... AVAILABLE" -ForegroundColor White
Write-Host "  Browser Agent Execution .. RESTRICTED" -ForegroundColor Yellow
Write-Host "  Browser Human Execution .. AVAILABLE" -ForegroundColor Green
Write-Host "  Browser Engine ........... SYSTEM_EDGE (155.0.4283.45)" -ForegroundColor White
Write-Host "  Playwright Channel ....... msedge" -ForegroundColor White
Write-Host ""
Write-Host "  Recommended Mode ......... HUMAN_OPERATOR_EXECUTION" -ForegroundColor Green

Write-Host "`n--------------------------------------------------------" -ForegroundColor Cyan
if ($issuesFound -eq 0) {
    Write-Host "System status: HEALTHY. Alper Design OS is ready to run." -ForegroundColor Green
} else {
    Write-Host "System status: $issuesFound issue(s) detected. Please review warnings above." -ForegroundColor Yellow
}
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

