param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'

$source = Join-Path $ProjectRoot 'skills'
$targetRoot = Join-Path $ProjectRoot 'unpackage\dist\dev\mp-weixin'
$target = Join-Path $targetRoot 'skills'

if (-not (Test-Path -LiteralPath $source)) {
  throw "Source skills directory not found: $source"
}

if (-not (Test-Path -LiteralPath $targetRoot)) {
  throw "mp-weixin output directory not found: $targetRoot. Run uni-app for WeChat Mini Program first."
}

if (Test-Path -LiteralPath $target) {
  Remove-Item -Recurse -Force -LiteralPath $target
}

Copy-Item -Recurse -Force -LiteralPath $source -Destination $targetRoot

$mcp = Join-Path $target 'wifi\mcp.json'
if (-not (Test-Path -LiteralPath $mcp)) {
  throw "Skills sync failed, missing file: $mcp"
}

Write-Host "skills synced to: $target"
