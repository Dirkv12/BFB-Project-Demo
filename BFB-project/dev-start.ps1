# dev-start.ps1
# Starts both the frontend static server and the backend auth server.
param(
    [int]$FrontendPort = 8000,
    [int]$BackendPort = 3000
)

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null
cd $PSScriptRoot
Write-Host "Starting frontend on port $FrontendPort"
Start-Process -FilePath (Get-Command python).Source -ArgumentList '-m','http.server',$FrontendPort,'--bind','0.0.0.0' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
Start-Sleep -Seconds 1
Write-Host "Starting backend on port $BackendPort"
Start-Process -FilePath (Get-Command node).Source -ArgumentList 'server.js' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
Start-Sleep -Seconds 1
Write-Host "Frontend: http://localhost:$FrontendPort"
Write-Host "Backend: http://localhost:$BackendPort"
Start-Process "http://localhost:$FrontendPort/auth.html"
