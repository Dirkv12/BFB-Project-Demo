# start-server.ps1
# Starts a simple static HTTP server for the project and opens the site in the default browser.
# Usage: Right-click > Run with PowerShell or run in an elevated PowerShell if you need to add a firewall rule.

param(
    [int]$Port = 8000,
    [switch]$OpenBrowser
)

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "Starting static server in: $projectPath on port $Port"

# Start python http.server bound to all interfaces so other devices on the LAN can access it
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCmd) {
    $python = $pythonCmd.Source
} else {
    $python = $null
}

if (-not $python) {
    Write-Error "Python not found in PATH. Install Python 3 or use an alternative server (e.g. node http-server)."
    exit 1
}

# Start the server in a hidden process
Start-Process -FilePath $python -ArgumentList ('-m','http.server',"$Port","--bind","0.0.0.0") -WorkingDirectory $projectPath -WindowStyle Hidden
Start-Sleep -Seconds 1

$addr = "http://localhost:$Port"
Write-Host "Server started. Open the site at: $addr"

if ($OpenBrowser) {
    Start-Process $addr
}

Write-Host "To stop the server, find and stop the python process, or close this PowerShell session."