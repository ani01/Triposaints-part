# Triposaints Setup Script
# This script helps you set up the project quickly

Write-Host "🚀 Setting up Triposaints Facebook SSO Project..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "📋 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created! Please edit it with your Facebook App credentials." -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  ACTION REQUIRED: Edit .env file with your Facebook App ID and Secret" -ForegroundColor Red
    Write-Host ""
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
Write-Host ""

# Setup frontend
Write-Host "📦 Setting up frontend..." -ForegroundColor Yellow
Set-Location "Frontend\vite-project"

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Frontend .env file created!" -ForegroundColor Green
}

npm install
Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
Write-Host ""

Set-Location "..\..\"

Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file and add your Facebook App credentials" -ForegroundColor White
Write-Host "2. Run 'npm start' in the root directory to start the backend" -ForegroundColor White
Write-Host "3. Run 'npm run dev' in Frontend/vite-project to start the frontend" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see README.md" -ForegroundColor Cyan
