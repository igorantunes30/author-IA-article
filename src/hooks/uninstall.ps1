# ieee-paper-writer — uninstaller for Claude Code hooks (Windows PowerShell)

$ClaudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME ".claude" }
$HooksDir  = Join-Path $ClaudeDir "hooks"
$Settings  = Join-Path $ClaudeDir "settings.json"
$HookFiles = @("ieee-paper-activate.js", "ieee-paper-tracker.js", "package.json")

Write-Host "Uninstalling ieee-paper-writer hooks..."
foreach ($f in $HookFiles) {
  $target = Join-Path $HooksDir $f
  if (Test-Path $target) { Remove-Item $target -Force; Write-Host "  removed $f" }
}

$tmpScript = Join-Path $env:TEMP "ieee-paper-uninstall-$([System.Diagnostics.Process]::GetCurrentProcess().Id).js"
@"
'use strict';
const fs = require('fs');
const settingsPath = process.argv[2];
let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch { process.exit(0); }
let removed = 0;
for (const event of ['SessionStart', 'UserPromptSubmit']) {
  if (!settings.hooks || !settings.hooks[event]) continue;
  settings.hooks[event] = settings.hooks[event].map(e => {
    if (!e.hooks) return e;
    const before = e.hooks.length;
    e.hooks = e.hooks.filter(h => !(h.command && h.command.includes('ieee-paper')));
    removed += before - e.hooks.length;
    return e;
  }).filter(e => e.hooks && e.hooks.length > 0);
}
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log('  Removed ' + removed + ' ieee-paper-writer hook entries from settings.json');
"@ | Set-Content -Path $tmpScript -Encoding UTF8
node $tmpScript $Settings
Remove-Item $tmpScript -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "ieee-paper-writer hooks removed. Restart Claude Code."
Write-Host "To remove the plugin:  claude plugin disable ieee-paper-writer"
