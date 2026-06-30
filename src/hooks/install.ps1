# ieee-paper-writer — one-command hook installer for Claude Code (Windows PowerShell)
# Usage:  .\install.ps1 [-Force]

param([switch]$Force)

$ClaudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME ".claude" }
$HooksDir  = Join-Path $ClaudeDir "hooks"
$Settings  = Join-Path $ClaudeDir "settings.json"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "ERROR: 'node' is required to install ieee-paper-writer hooks." -ForegroundColor Red
  exit 1
}

New-Item -ItemType Directory -Path $HooksDir -Force | Out-Null
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($Force -and (Test-Path (Join-Path $HooksDir "ieee-paper-activate.js"))) {
  Write-Host "Reinstalling ieee-paper-writer hooks (-Force)..."
} else {
  Write-Host "Installing ieee-paper-writer hooks..."
}

Copy-Item (Join-Path $ScriptDir "ieee-paper-activate.js") (Join-Path $HooksDir "ieee-paper-activate.js") -Force
Copy-Item (Join-Path $ScriptDir "ieee-paper-tracker.js")  (Join-Path $HooksDir "ieee-paper-tracker.js")  -Force
Copy-Item (Join-Path $ScriptDir "package.json")           (Join-Path $HooksDir "package.json")            -Force

$tmpScript = Join-Path $env:TEMP "ieee-paper-install-$([System.Diagnostics.Process]::GetCurrentProcess().Id).js"
@"
'use strict';
const fs = require('fs');
const hooksDir = process.argv[2];
const settingsPath = process.argv[3];
let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}
if (!settings.hooks) settings.hooks = {};
const has = (ev) => ((settings.hooks[ev] || []).flatMap(e => e.hooks || [])).some(h => h.command && h.command.includes('ieee-paper'));
if (!has('SessionStart')) {
  settings.hooks.SessionStart = settings.hooks.SessionStart || [];
  settings.hooks.SessionStart.push({ matcher: '', hooks: [{ type: 'command', command: 'node "' + hooksDir + '/ieee-paper-activate.js"', timeout: 10, statusMessage: 'Loading ieee-paper-writer...' }] });
}
if (!has('UserPromptSubmit')) {
  settings.hooks.UserPromptSubmit = settings.hooks.UserPromptSubmit || [];
  settings.hooks.UserPromptSubmit.push({ matcher: '', hooks: [{ type: 'command', command: 'node "' + hooksDir + '/ieee-paper-tracker.js"', timeout: 10, statusMessage: 'Tracking ieee-paper-writer...' }] });
}
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log('  settings.json updated.');
"@ | Set-Content -Path $tmpScript -Encoding UTF8

node $tmpScript $HooksDir $Settings
Remove-Item $tmpScript -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "ieee-paper-writer hooks installed."
Write-Host "  - SessionStart: injects pipeline rules every session"
Write-Host "  - UserPromptSubmit: detects paper-writing triggers"
Write-Host "Restart Claude Code to activate."
