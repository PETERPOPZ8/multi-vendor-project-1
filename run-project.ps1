$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList @('-NoExit', '-Command', "cd '$root\\backend'; npm run dev")

# Start frontend in a new PowerShell window
Start-Process powershell -ArgumentList @('-NoExit', '-Command', "cd '$root\\frontend'; npx http-server -p 3000")

Write-Host 'Started backend on http://localhost:5000 and frontend on http://localhost:3000' -ForegroundColor Green
