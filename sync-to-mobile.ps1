# ========================================
# ご縁ガール スマホデータ同期スクリプト
# 使い方: PowerShellでこのファイルを実行
# ========================================

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$companiesJson = Join-Path $rootDir "data\companies.json"
$memberHtml = Join-Path $rootDir "member\index.html"

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  ご縁ガール スマホ反映ツール" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# ダウンロードフォルダからcompanies.jsonを探す
$downloads = "$env:USERPROFILE\Downloads\companies.json"
$desktop = "$env:USERPROFILE\Desktop\companies.json"

$sourceJson = $null
if (Test-Path $downloads) {
    $sourceJson = $downloads
    Write-Host "[1] ダウンロードフォルダの companies.json を検出しました。" -ForegroundColor Green
} elseif (Test-Path $desktop) {
    $sourceJson = $desktop
    Write-Host "[1] デスクトップの companies.json を検出しました。" -ForegroundColor Green
} else {
    Write-Host "[1] companies.json が見つかりません。" -ForegroundColor Red
    Write-Host "    管理画面で スマホにデータ共有(QR) から companies.json をダウンロードしてください。" -ForegroundColor Yellow
    Read-Host "Enterキーで終了"
    exit 1
}

# data/companies.json を更新
Write-Host "[2] data\companies.json を更新中..." -ForegroundColor Yellow
Copy-Item -Path $sourceJson -Destination $companiesJson -Force
Write-Host "    更新完了！" -ForegroundColor Green

# member/index.html のインラインデータを更新
Write-Host "[3] member\index.html のインラインデータを更新中..." -ForegroundColor Yellow

$jsonContent = Get-Content -Path $companiesJson -Raw -Encoding UTF8
$htmlContent = Get-Content -Path $memberHtml -Raw -Encoding UTF8

$pattern = '(?s)window\._inlineCompanies\s*=\s*\[.*?\];'
$replacement = "window._inlineCompanies = $jsonContent;"

if ($htmlContent -match $pattern) {
    $newHtml = [regex]::Replace($htmlContent, $pattern, $replacement)
    [System.IO.File]::WriteAllText($memberHtml, $newHtml, [System.Text.Encoding]::UTF8)
    Write-Host "    更新完了！" -ForegroundColor Green
} else {
    Write-Host "    スキップ" -ForegroundColor Yellow
}

# GitへのPush
Write-Host "[4] GitHubへプッシュ中..." -ForegroundColor Yellow
Set-Location $rootDir
git add -A
git commit -m "update: 店舗データをスマホ会員ページに反映"
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "完了！約1〜2分後にスマホを再読み込みしてください。" -ForegroundColor Green
} else {
    Write-Host "Gitプッシュに失敗しました。手動でプッシュしてください。" -ForegroundColor Red
}

Read-Host "Enterキーで終了"
