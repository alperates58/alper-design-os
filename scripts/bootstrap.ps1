# ==============================================================================
# ALPER DESIGN OS - Canonical Bootstrap PowerShell Script (Windows)
# ==============================================================================
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir

Write-Host "=== ALPER DESIGN OS BOOTSTRAP (POWERSHELL) ===" -ForegroundColor Cyan
Write-Host "Repository Root: $RepoRoot"

# 1. Check Node.js
try {
    $nodeVer = & node -v
    Write-Host "Node.js detected: $nodeVer" -ForegroundColor Green
    $major = [int]($nodeVer.TrimStart('v').Split('.')[0])
    if ($major -lt 20) {
        Write-Error "Node.js version $nodeVer is below canonical minimum requirement (>= 20.0.0)."
        exit 1
    }
} catch {
    Write-Error "Node.js is not found or execution is restricted. Please install Node.js >= 20.0.0."
    exit 1
}

# 2. Check Git
try {
    $gitVer = & git --version
    Write-Host "Git detected: $gitVer" -ForegroundColor Green
} catch {
    Write-Error "Git is not installed or not in PATH."
    exit 1
}

# 3. Delegate to canonical bootstrap engine
Set-Location $RepoRoot
& node "$RepoRoot\scripts\bootstrap.js" $args
if ($LASTEXITCODE -ne 0) {
    Write-Error "Bootstrap failed with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
}
