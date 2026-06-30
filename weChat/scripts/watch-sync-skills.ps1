param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'

$targetRoot = Join-Path $ProjectRoot 'unpackage\dist\dev\mp-weixin'
$syncScript = Join-Path $PSScriptRoot 'sync-skills.ps1'

if (-not (Test-Path -LiteralPath $targetRoot)) {
  throw "mp-weixin output directory not found: $targetRoot. Run uni-app for WeChat Mini Program first."
}

function Invoke-Sync {
  try {
    & $syncScript -ProjectRoot $ProjectRoot
  } catch {
    Write-Warning $_.Exception.Message
  }
}

Invoke-Sync

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $targetRoot
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$lastRun = [DateTime]::MinValue
$action = {
  $now = Get-Date
  if (($now - $script:lastRun).TotalSeconds -lt 1) {
    return
  }
  $script:lastRun = $now
  Start-Sleep -Milliseconds 300
  Invoke-Sync
}

$handlers = @(
  (Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action),
  (Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action),
  (Register-ObjectEvent -InputObject $watcher -EventName Deleted -Action $action),
  (Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $action)
)

Write-Host "Watching: $targetRoot"
Write-Host "Press Ctrl+C to stop."

try {
  while ($true) {
    Wait-Event -Timeout 1 | Out-Null
  }
} finally {
  foreach ($handler in $handlers) {
    Unregister-Event -SubscriptionId $handler.Id -ErrorAction SilentlyContinue
  }
  $watcher.Dispose()
}
