# ==============================================================================
# ALPER DESIGN OS - Windows Installation Script (Portable)
# ==============================================================================
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\install-windows.ps1
#
# This script is completely portable across any Windows machine.
# It resolves paths dynamically without hardcoded usernames or absolute paths.
# ==============================================================================

[CmdletBinding()]
param (
    [switch]$SkipTests,
    [switch]$SkipAntigravityConfig
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  ALPER DESIGN OS - Windows Portable Installer" -ForegroundColor Cyan
Write-Host "  'Understand the product before designing the interface.'" -ForegroundColor DarkCyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "[*] Project Root: $ProjectRoot" -ForegroundColor Yellow

# ------------------------------------------------------------------------------
# 1. Set ALPER_DESIGN_OS_HOME environment variable
# ------------------------------------------------------------------------------
Write-Host "`n[*] Configuring ALPER_DESIGN_OS_HOME environment variable..." -ForegroundColor Yellow
try {
    $currentEnv = [Environment]::GetEnvironmentVariable("ALPER_DESIGN_OS_HOME", "User")
    if ($currentEnv -ne $ProjectRoot) {
        [Environment]::SetEnvironmentVariable("ALPER_DESIGN_OS_HOME", $ProjectRoot, "User")
        Write-Host "[+] User Environment Variable ALPER_DESIGN_OS_HOME set to: $ProjectRoot" -ForegroundColor Green
    } else {
        Write-Host "[=] ALPER_DESIGN_OS_HOME already configured correctly." -ForegroundColor DarkGray
    }
} catch {
    Write-Host "[!] Could not persist ALPER_DESIGN_OS_HOME to registry (restricted privileges). Session variable set." -ForegroundColor Yellow
}
$env:ALPER_DESIGN_OS_HOME = $ProjectRoot

# ------------------------------------------------------------------------------
# 2. Check Prerequisites (Node.js, Git, pnpm)
# ------------------------------------------------------------------------------
Write-Host "`n[*] Checking system prerequisites..." -ForegroundColor Yellow

# Helper to run commands via CMD safely without ExecutionPolicy restrictions
function Invoke-SafeCommand {
    param([string]$Cmd)
    cmd.exe /d /c $Cmd
}

# Node.js check
try {
    $nodeVer = Invoke-SafeCommand "node -v"
    Write-Host "[+] Node.js detected: $nodeVer" -ForegroundColor Green
} catch {
    Write-Error "[-] Node.js is not found. Please install Node.js (v20+ recommended) from https://nodejs.org/"
    exit 1
}

# Git check
try {
    $gitVer = Invoke-SafeCommand "git --version"
    Write-Host "[+] Git detected: $gitVer" -ForegroundColor Green
} catch {
    Write-Error "[-] Git is not found. Please install Git for Windows from https://git-scm.com/"
    exit 1
}

# pnpm check
$pnpmInstalled = $false
try {
    $pnpmVer = Invoke-SafeCommand "pnpm -v"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[+] pnpm detected: $pnpmVer" -ForegroundColor Green
        $pnpmInstalled = $true
    }
} catch {
    $pnpmInstalled = $false
}

if (-not $pnpmInstalled) {
    Write-Host "[!] pnpm not found globally. Installing pinned pnpm@9.15.4 via npm..." -ForegroundColor Yellow
    Invoke-SafeCommand "npm.cmd install -g pnpm@9.15.4"
    $pnpmVer = Invoke-SafeCommand "pnpm.cmd -v"
    Write-Host "[+] pnpm installed successfully: $pnpmVer" -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# 3. Environment File (.env) Setup
# ------------------------------------------------------------------------------
Write-Host "`n[*] Setting up local environment configuration..." -ForegroundColor Yellow
$envPath = Join-Path $ProjectRoot ".env"
$envExamplePath = Join-Path $ProjectRoot ".env.example"

if (-not (Test-Path $envPath)) {
    if (Test-Path $envExamplePath) {
        try {
            $envContent = Get-Content $envExamplePath -Raw
            $envContent = $envContent -replace "ALPER_DESIGN_OS_HOME=.*", "ALPER_DESIGN_OS_HOME=$ProjectRoot"
            [System.IO.File]::WriteAllText($envPath, $envContent, [System.Text.Encoding]::UTF8)
            Write-Host "[+] Created .env file configured with ALPER_DESIGN_OS_HOME." -ForegroundColor Green
        } catch {
            Write-Host "[!] Note: Could not create .env automatically. Please copy from .env.example." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "[=] .env file already exists. Preserving existing secrets." -ForegroundColor DarkGray
}

# ------------------------------------------------------------------------------
# 4. Install Dependencies
# ------------------------------------------------------------------------------
Write-Host "`n[*] Installing monorepo dependencies with pnpm (frozen lockfile)..." -ForegroundColor Yellow
Invoke-SafeCommand "cd /d `"$ProjectRoot`" && pnpm.cmd install --frozen-lockfile"

# ------------------------------------------------------------------------------
# 5. Build Workspace Packages
# ------------------------------------------------------------------------------
Write-Host "`n[*] Building all packages (Design Core, Adapters, Analyzer, MCP Server)..." -ForegroundColor Yellow
Invoke-SafeCommand "cd /d `"$ProjectRoot`" && npm.cmd run build"

# ------------------------------------------------------------------------------
# 6. Run Test Suite
# ------------------------------------------------------------------------------
if (-not $SkipTests) {
    Write-Host "`n[*] Running test suite..." -ForegroundColor Yellow
    Invoke-SafeCommand "cd /d `"$ProjectRoot`" && npm.cmd test"
}

# ------------------------------------------------------------------------------
# 7. Antigravity MCP Server Global Registration
# ------------------------------------------------------------------------------
if (-not $SkipAntigravityConfig) {
    Write-Host "`n[*] Registering Alper Design OS MCP server in Antigravity config..." -ForegroundColor Yellow
    & node "$ProjectRoot\scripts\register-mcp.js" --global
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  ALPER DESIGN OS - Installation Complete!" -ForegroundColor Green
Write-Host "  Run 'powershell scripts/doctor.ps1' at any time to verify health." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
