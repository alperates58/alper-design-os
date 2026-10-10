[CmdletBinding()]
param (
    [switch]$Quick
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RootDir = Split-Path -Parent $ScriptDir

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "ALPER DESIGN OS - FAZ 1C DOCKER BENCHMARK ENTRYPOINT" -ForegroundColor Cyan
Write-Host "Root Directory: $RootDir" -ForegroundColor Gray
Write-Host "=======================================================" -ForegroundColor Cyan

# Verify Docker availability
try {
    $dockerVersion = docker version --format '{{.Server.Version}}' 2>$null
    if (-not $dockerVersion) {
        Write-Host "[ERR] Docker Desktop is not running. Please start Docker Desktop before running this benchmark." -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Docker Engine verified: v$dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERR] Docker verification failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Run Benchmark Orchestrator via Node
try {
    $scriptPath = Join-Path $RootDir "benchmarks/runner/run-all.js"
    $nodeArgs = @($scriptPath)
    if ($Quick) {
        $nodeArgs += "--quick"
    }

    Write-Host "`n[*] Starting Benchmark Runner..." -ForegroundColor Yellow
    & node @nodeArgs

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERR] Benchmark run exited with failure code: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }

    Write-Host "`n[OK] Benchmark execution completed successfully!" -ForegroundColor Green
    Write-Host "[OK] Release Gate Report: $RootDir\BENCHMARK_REPORT.md" -ForegroundColor Green
} catch {
    Write-Host "[ERR] Benchmark execution encountered an error: $($_.Exception.Message)" -ForegroundColor Red
    docker compose -f (Join-Path $RootDir "docker-compose.benchmark.yml") down 2>$null
    exit 1
} finally {
    docker compose -f (Join-Path $RootDir "docker-compose.benchmark.yml") down 2>$null
}
