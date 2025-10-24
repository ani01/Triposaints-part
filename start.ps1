# Quick Start Script
# Runs both backend and frontend servers in separate terminals

Write-Host "🚀 Starting Triposaints Application..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please run setup.ps1 first or create .env from .env.example" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"

Start-Sleep -Seconds 2

Write-Host "✅ Starting frontend server..." -ForegroundColor Green
$frontendPath = Join-Path $PWD "Frontend\vite-project"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host ""
Write-Host "🎉 Application started!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Yellow
