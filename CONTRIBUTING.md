# Contributing to Glass

Thanks for considering a contribution. This is a small project maintained in spare time, so keeping changes focused and easy to review goes a long way.

**For anything beyond a small bug fix or docs tweak, please open an issue first** to discuss the approach before writing code. It saves both of us time if the direction needs adjusting.

## Scope

Glass's philosophy (see the README) is: run the real Claude Code CLI in a real terminal, not a chat-UI reimplementation of it. Keep that in mind when proposing features:

- **In scope:** terminal/UX integration, vault MCP server tools, quick-ask modal, Obsidian-specific plumbing (settings, commands, context menus).
- **Out of scope:** re-implementing Claude Code CLI functionality inside the plugin, or agent-specific behavior that belongs in Claude Code's own config rather than this plugin.
- **_Way_ out of scope:** expanding support for other LLMs. Glass (for the time being) supports Claude Code only. 

## Development setup

Requirements: Node.js, npm, and Python 3 (used by the terminal bridge).

```bash
git clone git@github.com:humantorch/glass.git
cd glass
npm install
```

To test changes inside Obsidian, symlink this repo into a **dedicated test vault.** Using a vault that contains data you might want to hang on to is asking for trouble and it might make your little toes turn blue and fall off. Test vaults are the true path:

**macOS/Linux:**
```bash
mkdir -p "$HOME/Documents/obsidian-plugin-testing/.obsidian/plugins/"
ln -s "$(pwd)" "$HOME/Documents/obsidian-plugin-testing/.obsidian/plugins/blackglass"
```

**Windows (PowerShell, run as Administrator or with Developer Mode enabled):**
```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\Documents\obsidian-plugin-testing\.obsidian\plugins"
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\Documents\obsidian-plugin-testing\.obsidian\plugins\blackglass" -Target (Get-Location)
```

Then run the watch build and enable the plugin in that vault:

```bash
npm run dev
```

Installing the [hot-reload](https://github.com/pjeby/hot-reload) community plugin in the test vault will auto-reload Glass on file save.

## Available commands

| Command | Description |
|---|---|
| `npm run dev` | Watch build for local development |
| `npm run build` | Type check (`tsc --noEmit`) + production esbuild |
| `npm run lint` | ESLint, including Obsidian's recommended plugin rules |
| `npm test` | Run the vitest suite once |
| `npm run test:watch` | Vitest in watch mode |

## Architecture

| File | Responsibility |
|---|---|
| `main.ts` | Plugin entry point: commands, ribbon icon, settings load, update checks |
| `ClaudeTerminalView.ts` | The sidebar terminal view (xterm.js + PTY session) |
| `ProcessManager.ts` | Spawns and manages the Claude Code / PTY child process |
| `VaultMcpServer.ts` | Built-in HTTP MCP server exposing vault read/write tools |
| `ClaudeQuickModal.ts` | The one-shot "quick ask" modal (print mode) |
| `ContextBuilder.ts` | Builds note/selection context passed into quick-ask |
| `SettingsTab.ts` | Plugin settings UI |
| `types.ts` | Shared types and settings defaults |

## Before submitting a PR

```bash
npm run lint    # eslint, including Obsidian's recommended plugin rules
npm run build   # tsc --noEmit + production esbuild
npm test        # vitest
```

All three should pass clean. Note that CI (`.github/workflows/ci.yml`) currently only runs the type check and tests, not lint, so please run `npm run lint` locally yourself. If you touch `ClaudeTerminalView.ts`, `ProcessManager.ts`, or anything PTY/process-related, actually launch the terminal in the test vault and confirm it still works: these are hard to fully cover with unit tests alone.

**PR checklist:**
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] Tested manually in the test vault (for terminal/process changes)

## Style

- TypeScript, `strictNullChecks` on. Prefer explicit types at public boundaries.
- UI strings must be sentence case, not title case (enforced by `obsidianmd/ui/sentence-case` in `eslint.config.mjs`). If you introduce a new brand name or acronym that trips this rule, add it to the `brands`/`acronyms` list in `eslint.config.mjs` rather than suppressing the warning.
- No unnecessary abstractions or defensive code for cases that can't happen. See the top-level project conventions if you're unsure.

## Commits & PRs

- Keep commits scoped to one logical change, with a clear, imperative summary (e.g. "Fix terminal resize on Windows", not "updates").
- Open PRs against `main`. Reference any related issue.
- For bugs, please include repro steps and your OS/Obsidian version.

## License

By contributing, you agree your contribution is licensed under the project's [MIT License](LICENSE).
