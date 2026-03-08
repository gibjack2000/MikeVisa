$ErrorActionPreference = "Stop"
$token = $env:GITHUB_TOKEN
if (-not $token) {
    throw "GITHUB_TOKEN environment variable is not set."
}
$repo = "gibjack2000/MikeVisa"
$releaseId = "294236000"

$assetPath = "d:\0Antigravity\123zenextlevel\MikeVisa\MikeVisa-release.zip"
$assetName = "MikeVisa-release.zip"
$uploadUrl = "https://uploads.github.com/repos/$repo/releases/$releaseId/assets?name=$assetName"

Write-Host "Uploading release asset with Invoke-RestMethod..."
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -Headers @{ Authorization = "token $token"; Accept = "application/vnd.github.v3+json" } -ContentType "application/zip" -InFile $assetPath -TimeoutSec 3600
    Write-Host "Upload complete!"
    $response | ConvertTo-Json -Depth 2
} catch {
    Write-Host "Upload failed: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd()
    }
    exit 1
}
