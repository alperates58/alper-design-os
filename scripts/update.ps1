# ==============================================================================
# ALPER DESIGN OS - Update Script (Portable)
# ==============================================================================
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\update.ps1
# ==============================================================================

[CmdletBinding()]
param (
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  ALPER DESIGN OS - Updating Project" -ForegroundColor Cyan
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

# 1. Git pull
Write-Host "`n[*] Pulling latest changes from Git..." -ForegroundColor Yellow
Invoke-SafeCommand "cd '$ProjectRoot' && git pull"

# 2. Dependency sync
Write-Host "`n[*] Updating dependencies with pnpm..." -ForegroundColor Yellow
Invoke-SafeCommand "cd '$ProjectRoot' && pnpm install"
Invoke-SafeCommand "cd '$ProjectRoot' && pnpm approve-builds --all"

# 3. Rebuild
Write-Host "`n[*] Rebuilding packages..." -ForegroundColor Yellow
Invoke-SafeCommand "cd '$ProjectRoot' && pnpm run build"

# 4. Run tests
if (-not $SkipTests) {
    Write-Host "`n[*] Running tests..." -ForegroundColor Yellow
    Invoke-SafeCommand "cd '$ProjectRoot' && pnpm test"
}

# 5. Doctor verification
Write-Host "`n[*] Running doctor verification..." -ForegroundColor Yellow
& "$ScriptDir\doctor.ps1"

Write-Host "`n[+] ALPER DESIGN OS update completed successfully!" -ForegroundColor Green
