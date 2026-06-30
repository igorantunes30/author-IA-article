# Windows install fallback

If `irm https://raw.githubusercontent.com/igorantunes30/author-IA-article/main/install.ps1 | iex` fails on Windows (issues #249, #199, #72), set up plugin-skill activation by hand. This does **not** install the standalone hooks — for those, run the unified Node installer afterwards: `node bin/install.js --only claude` from a clone.

```powershell
$ClaudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME ".claude" }
$PluginSkillDir = Join-Path $ClaudeDir ".agents\plugins\ieee-paper-writer\skills\ieee-paper-writer"
$MarketplaceDir = Join-Path $ClaudeDir ".agents\plugins"
$MarketplaceFile = Join-Path $MarketplaceDir "marketplace.json"

# Copy SKILL.md into the plugin path (run from a clone of the repo)
New-Item -ItemType Directory -Path $PluginSkillDir -Force | Out-Null
Copy-Item ".\skills\ieee-paper-writer\SKILL.md" "$PluginSkillDir\SKILL.md" -Force

# Create or update marketplace.json with the ieee-paper-writer entry
New-Item -ItemType Directory -Path $MarketplaceDir -Force | Out-Null
if (Test-Path $MarketplaceFile) {
  $marketplace = Get-Content $MarketplaceFile -Raw | ConvertFrom-Json
} else {
  $marketplace = [pscustomobject]@{}
}
if (-not ($marketplace.PSObject.Properties.Name -contains "plugins")) {
  $marketplace | Add-Member -NotePropertyName plugins -NotePropertyValue ([pscustomobject]@{})
}
$plugins = [ordered]@{}
foreach ($p in $marketplace.plugins.PSObject.Properties) { $plugins[$p.Name] = $p.Value }
$plugins["ieee-paper-writer"] = [ordered]@{ name = "ieee-paper-writer"; source = "igorantunes30/author-IA-article"; version = "main" }
$marketplace.plugins = [pscustomobject]$plugins
$marketplace | ConvertTo-Json -Depth 10 | Set-Content -Path $MarketplaceFile -Encoding UTF8
```

Verify: `Test-Path "$PluginSkillDir\SKILL.md"` should print `True`. Restart Claude Code, then run `/ieee-paper-writer` to confirm the skill loads.

## Codex on Windows

1. Enable symlinks first: `git config --global core.symlinks true` (requires Developer Mode or admin).
2. Clone repo → Open VS Code → Codex Settings → Plugins → find "ieee-paper-writer" under the local marketplace → Install → Reload Window.
3. Use `/ieee-paper-writer` to activate the pipeline.

## `npx skills` symlink fallback

`npx skills` uses symlinks by default. If symlinks fail, add `--copy`:

```powershell
npx skills add igorantunes30/author-IA-article --copy
```
