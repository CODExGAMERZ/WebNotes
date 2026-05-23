@echo off
:: ══════════════════════════════════════════
::  WebNotes -- Local Dev Launcher (Windows)
::  Usage: Double-click start.bat
:: ══════════════════════════════════════════

set PORT=3000
set URL=http://localhost:%PORT%

echo.
echo  WebNotes -- Local Server
echo  ------------------------
echo.

:: ── Method 1: Node.js (npx serve) ──────────────────────────────
where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo  [OK] Node.js found -- starting with npx serve...
  echo  [>>] Open your browser at %URL%
  echo.
  start "" /b cmd /c "timeout /t 2 /nobreak >nul && start %URL%"
  npx --yes serve . -l %PORT%
  goto :end
)

:: ── Method 2: Python 3 ─────────────────────────────────────────
where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
  python -c "import sys; exit(0 if sys.version_info.major==3 else 1)" >nul 2>&1
  if %ERRORLEVEL% equ 0 (
    echo  [OK] Python 3 found -- starting with http.server...
    echo  [>>] Open your browser at %URL%
    echo.
    start "" /b cmd /c "timeout /t 2 /nobreak >nul && start %URL%"
    python -m http.server %PORT%
    goto :end
  )
)

:: ── Method 3: Python launcher (py) ─────────────────────────────
where py >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo  [OK] Python (py launcher) found -- starting with http.server...
  echo  [>>] Open your browser at %URL%
  echo.
  start "" /b cmd /c "timeout /t 2 /nobreak >nul && start %URL%"
  py -3 -m http.server %PORT%
  goto :end
)

:: ── Method 4: PowerShell built-in HTTP listener ─────────────────
where powershell >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo  [OK] PowerShell found -- starting built-in HTTP listener...
  echo  [>>] Open your browser at %URL%
  echo.
  start "" /b cmd /c "timeout /t 2 /nobreak >nul && start %URL%"
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$listener = New-Object System.Net.HttpListener;" ^
    "$listener.Prefixes.Add('http://localhost:%PORT%/');" ^
    "$listener.Start();" ^
    "Write-Host '  Server running at http://localhost:%PORT% -- press Ctrl+C to stop';" ^
    "while ($listener.IsListening) {" ^
    "  $ctx = $listener.GetContext();" ^
    "  $req = $ctx.Request; $res = $ctx.Response;" ^
    "  $path = $req.Url.LocalPath -replace '/', '\\';" ^
    "  if ($path -eq '\\') { $path = '\\index.html' }" ^
    "  $file = Join-Path (Get-Location) $path.TrimStart('\\');" ^
    "  if (Test-Path $file) {" ^
    "    $bytes = [System.IO.File]::ReadAllBytes($file);" ^
    "    $res.ContentLength64 = $bytes.Length;" ^
    "    $ext = [System.IO.Path]::GetExtension($file);" ^
    "    $mime = @{'.html'='text/html';'.css'='text/css';'.js'='application/javascript';'.md'='text/plain'}" ^
    "    $res.ContentType = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' };" ^
    "    $res.OutputStream.Write($bytes, 0, $bytes.Length);" ^
    "  } else {" ^
    "    $res.StatusCode = 404;" ^
    "  }" ^
    "  $res.Close();" ^
    "}"
  goto :end
)

:: ── No method found ─────────────────────────────────────────────
echo  [!!] Could not find Node.js, Python, or PowerShell.
echo.
echo  To fix, install one of the following:
echo    Node.js  : https://nodejs.org
echo    Python 3 : https://python.org
echo.

:end
pause
