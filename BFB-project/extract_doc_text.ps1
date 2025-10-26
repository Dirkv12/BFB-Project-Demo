$ErrorActionPreference = 'Stop'

$docx = Join-Path $PSScriptRoot 'BFB TEMP.docx'
$out  = Join-Path $PSScriptRoot 'doc_extracted.txt'

if (-not (Test-Path $docx)) {
	throw "Document not found: $docx"
}

$tmp = Join-Path $env:TEMP ("bfb_docx_" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tmp | Out-Null
$zipPath = Join-Path $tmp 'doc.zip'

try {
	Copy-Item -LiteralPath $docx -Destination $zipPath
	Expand-Archive -LiteralPath $zipPath -DestinationPath $tmp -Force
	$xml = Join-Path $tmp 'word\document.xml'
	if (-not (Test-Path $xml)) { throw 'document.xml missing in archive' }

	$content = Get-Content -Path $xml -Raw
	$text = $content -replace '<w:tab[^>]*?>',' ' -replace '<w:br[^>]*?>','`n' -replace '</w:p>','`n'
	$text = $text -replace '<[^>]+>',''
	$text = $text -replace '\s+\n','`n' -replace '\n\s+','`n'
	$text = $text.Trim()
	Set-Content -Path $out -Value $text -Encoding utf8
	Write-Output $text
}
finally {
	try { Remove-Item -Recurse -Force $tmp } catch {}
}
