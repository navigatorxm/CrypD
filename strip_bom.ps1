$inputFile = "d:/CrypDr/TokenV2_Flattened.sol"
$content = [System.IO.File]::ReadAllText($inputFile, [System.Text.Encoding]::UTF8)
$content = $content.TrimStart([char]0xFEFF)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($inputFile, $content, $utf8NoBom)
Write-Host "BOM stripped successfully from $inputFile"
