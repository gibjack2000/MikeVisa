$ErrorActionPreference = "Stop"
cd d:\0Antigravity\123zenextlevel\MikeVisa

Write-Host "Fetching and resetting to origin/main..."
git fetch origin
git reset --hard origin/main

$files = Get-ChildItem -Path "Assets\ezgif-frame-*.png" | Sort-Object Name
$batchSize = 5

for ($i = 0; $i -lt $files.Count; $i += $batchSize) {
    $batch = $files[$i..($i + $batchSize - 1)]
    
    foreach ($f in $batch) {
        if ($f -ne $null) {
            git add $f.FullName
        }
    }
    
    $batchName = "Add frames $($i) to $($i + $batchSize - 1)"
    git commit -m $batchName
    
    $pushed = $false
    $retries = 0
    while (-not $pushed -and $retries -lt 5) {
        Write-Host "Pushing $batchName (Attempt $($retries + 1))"
        $proc = Start-Process -FilePath "git" -ArgumentList "push origin main" -NoNewWindow -Wait -PassThru
        if ($proc.ExitCode -eq 0) {
            $pushed = $true
            Write-Host "Pushed successfully."
        } else {
            Write-Host "Push failed."
            $retries++
            Start-Sleep -Seconds 5
        }
    }
    
    if (-not $pushed) {
        Write-Host "Failed to push after 5 retries! Stopping."
        exit 1
    }
}

Write-Host "ALL_FRAMES_PUSHED_SUCCESSFULLY"
