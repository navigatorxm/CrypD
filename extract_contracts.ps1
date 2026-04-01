$json = Get-Content 'd:/CrypDr/contract_raw.json' -Raw | ConvertFrom-Json
$result = $json.result[0]
Write-Host "ContractName: $($result.ContractName)"
Write-Host "CompilerVersion: $($result.CompilerVersion)"

$src = $result.SourceCode

# Standard JSON Input format wraps the JSON in double braces {{ }}
if ($src.StartsWith('{{')) {
    $src = $src.Substring(1, $src.Length - 2)
}

$srcObj = $src | ConvertFrom-Json
$files = $srcObj.sources

$files.PSObject.Properties | ForEach-Object {
    $name = $_.Name
    $code = $_.Value.content
    $outPath = "d:/CrypDr/contracts/$name"
    $dir = Split-Path $outPath -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    Set-Content -Path $outPath -Value $code -Encoding UTF8
    Write-Host "Saved: $name"
}

Write-Host ""
Write-Host "All files extracted successfully."
