# SafePath AI — Development startup helper
# Run this from the repository root to launch backend and frontend in separate PowerShell windows.

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $repoRoot 'backend'
$frontendDir = Join-Path $repoRoot 'frontend'

# Backend command: use the virtualenv if present, otherwise run with current Python.
$backendLaunch = @(
    "Set-Location -Path '$backendDir'",
    "if (Test-Path .\\.venv\\Scripts\\Activate.ps1) { . .\\.venv\\Scripts\\Activate.ps1 }",
    "uvicorn main:app --reload --host 0.0.0.0 --port 8000"
) -join '; '

# Frontend command: run Vite from frontend directory.
$frontendLaunch = @(
    "Set-Location -Path '$frontendDir'",
    "npm run dev"
) -join '; '

Write-Host "Starting backend in a new window..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', $backendLaunch

Start-Sleep -Milliseconds 250
Write-Host "Starting frontend in a new window..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', $frontendLaunch

Write-Host "Done. Backend: http://localhost:8000, Frontend: http://127.0.0.1:5173"
