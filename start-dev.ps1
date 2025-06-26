# EasyCode Development Startup Script
Write-Host "🚀 Starting EasyCode Development Environment..." -ForegroundColor Green

# Start Project Management Service
Write-Host "📊 Starting Project Management Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\services\project-management-service'; pnpm dev"

# Wait a moment for the service to start
Start-Sleep -Seconds 3

# Start Main UI
Write-Host "🎨 Starting Main UI Application..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\apps\main-ui'; pnpm dev"

Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Services running on:" -ForegroundColor Cyan
Write-Host "   • Project Management API: http://localhost:3012" -ForegroundColor White
Write-Host "   • Main UI Application: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access your project management at: http://localhost:3000/projects" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 