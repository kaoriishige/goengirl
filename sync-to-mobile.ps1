# =====================================
# ご縁ガール - 管理データ自動監視・同期
# このスクリプトを起動しておくと、
# 管理画面でデータを保存するたびに
# 自動でGitHubにプッシュします
# =====================================

$rootDir = "c:\Users\user\Desktop\ご縁ガール"
$companiesPath = "$rootDir\data\companies.json"
$interval = 30  # 30秒ごとにチェック

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  ご縁ガール データ自動同期" -ForegroundColor Cyan
Write-Host "  起動中... (Ctrl+Cで停止)" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# ChromeのlocalStorageパスを検索
$chromeLocalStoragePath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Local Storage\leveldb"
$edgeLocalStoragePath = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Local Storage\leveldb"

function Get-AdminDataFromChrome {
    # Chrome/EdgeのlocalStorageからデータを読み取るのは複雑なため
    # 代わりにdownloadsフォルダのcompanies.jsonを監視
    $downloads = "$env:USERPROFILE\Downloads\companies.json"
    if (Test-Path $downloads) {
        $dlTime = (Get-Item $downloads).LastWriteTime
        $curTime = (Get-Item $companiesPath -ErrorAction SilentlyContinue)?.LastWriteTime
        if ($curTime -eq $null -or $dlTime -gt $curTime) {
            return $downloads
        }
    }
    return $null
}

$lastHash = ""
$iteration = 0

while ($true) {
    $iteration++
    
    # ダウンロードフォルダのcompanies.jsonをチェック
    $source = Get-AdminDataFromChrome
    if ($source) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] companies.json を検出！同期中..." -ForegroundColor Yellow
        
        Copy-Item -Path $source -Destination $companiesPath -Force
        
        Set-Location $rootDir
        $hash = (Get-FileHash $companiesPath).Hash
        
        if ($hash -ne $lastHash) {
            git add data/companies.json
            git commit -m "auto-sync: 店舗データ自動更新 $(Get-Date -Format 'yyyy/MM/dd HH:mm')"
            git push origin main
            $lastHash = $hash
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✅ プッシュ完了！1〜2分後にスマホに反映されます" -ForegroundColor Green
        }
    }
    
    if ($iteration % 10 -eq 0) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 監視中... (管理画面でJSONをダウンロードすると自動反映)" -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds $interval
}
