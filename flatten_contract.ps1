# Flatten all contract files into a single Remix-compatible Solidity file

$baseDir = "d:/CrypDr/contracts"
$outputFile = "d:/CrypDr/TokenV2_Flattened.sol"

$files = @(
    "lib/openzeppelin-contracts-upgradeable/contracts/utils/math/SignedMathUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/utils/math/MathUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/utils/StringsUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/utils/cryptography/ECDSAUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/interfaces/IERC5267Upgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/utils/AddressUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/utils/ContextUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/token/ERC20/IERC20Upgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/token/ERC20/extensions/IERC20MetadataUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/token/ERC20/ERC20Upgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/utils/CountersUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/token/ERC20/extensions/IERC20PermitUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/utils/cryptography/EIP712Upgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/token/ERC20/extensions/ERC20PermitUpgradeable.sol",
    "lib/openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol",
    "src/interfaces/ITokenV2.sol",
    "src/TokenV2.sol"
)

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("// SPDX-License-Identifier: MIT")
$lines.Add("pragma solidity ^0.8.13;")
$lines.Add("")
$lines.Add("// ============================================================")
$lines.Add("// TokenV2 - Flattened for Remix IDE")
$lines.Add("// Original: 0x8b4329947e34b6d56d71a3385cac122bade7d78d (BSC)")
$lines.Add("// ============================================================")
$lines.Add("")

foreach ($file in $files) {
    $fullPath = "$baseDir/$file"
    Write-Host "Processing: $file"

    $rawLines = Get-Content $fullPath -Encoding UTF8

    $lines.Add("// --- $file ---")

    $skipNext = $false
    foreach ($line in $rawLines) {
        # Strip BOM character if present
        $cleanLine = $line.TrimStart([char]0xFEFF)

        # If previous line was an import that didn't end with ; skip this continuation line
        if ($skipNext) {
            $skipNext = $false
            # Skip the continuation line (the quoted path string)
            if ($cleanLine -match '^\s*"') { continue }
        }

        # Skip SPDX lines
        if ($cleanLine -match '^\s*//\s*SPDX-License-Identifier') { continue }

        # Skip pragma lines
        if ($cleanLine -match '^\s*pragma\s+solidity') { continue }

        # Skip import lines (both styles)
        if ($cleanLine -match '^\s*import\s+') {
            # If the import line does NOT end with ; it continues on the next line
            if ($cleanLine -notmatch ';\s*$') {
                $skipNext = $true
            }
            continue
        }

        $lines.Add($cleanLine)
    }

    $lines.Add("")
    $lines.Add("")
}

Set-Content -Path $outputFile -Value $lines -Encoding UTF8
Write-Host ""
Write-Host "Done! Flattened file saved to: $outputFile"
$size = [math]::Round((Get-Item $outputFile).Length / 1KB, 1)
Write-Host "File size: $size KB"
