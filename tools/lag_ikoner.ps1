# Saves the app icons (ikon-512.png, ikon-192.png, apple-touch-icon.png) by opening tools/ikon.html
# in Edge without a window and taking a screenshot at each size.
$root = Split-Path $PSScriptRoot -Parent
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$page = ([Uri](Join-Path $PSScriptRoot 'ikon.html')).AbsoluteUri
foreach ($i in @(@(512, 'ikon-512.png'), @(192, 'ikon-192.png'), @(180, 'apple-touch-icon.png'))) {
  $size = $i[0]; $out = Join-Path $root $i[1]
  & $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 "--window-size=$size,$size" "--screenshot=$out" "$page`?s=$size" | Out-Null
  Write-Output "$($i[1]) $((Get-Item $out).Length) bytes"
}
