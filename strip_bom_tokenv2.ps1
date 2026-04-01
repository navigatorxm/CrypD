$path = "d:/CrypDr/contracts/src/TokenV2.sol"
$content = Get-Content -Raw -Path $path
[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
Write-Output "BOM stripped successfully from $path"
