export const en = {
	settings: {
		claudeBinaryPath: {
			name: "Claude binary path",
			desc: "Path to the Claude CLI executable. Use 'Claude' if it's on your system path, or provide the full absolute path.",
			placeholder: "Claude",
		},
		workingDirectory: {
			name: "Working directory",
			desc: "Directory Claude Code starts in. Leave blank to use vault root. Claude will have access to files in this directory.",
			placeholder: "(Vault root)",
		},
		quickAskModel: {
			name: "Quick ask model",
			desc: "Claude model to use for the quick ask modal.",
			defaultOption: "Default",
		},
		fontSize: {
			name: "Terminal font size",
			desc: "Font size in pixels for the terminal panel.",
			placeholder: "14",
		},
		scrollback: {
			name: "Terminal scrollback",
			desc: "Number of lines to keep in the terminal's scroll history (default 5000). Takes effect the next time the terminal is opened.",
			placeholder: "5000",
		},
		fontFamily: {
			name: "Terminal font family",
			desc: "Font family for the terminal panel.",
			descLoading: "Font family for the terminal panel. Loading fonts...",
		},
		fontWeight: {
			name: "Terminal font weight",
			desc: "Weight or style variant for the selected font.",
			descLoading: "Weight or style variant for the selected font. Loading fonts...",
		},
		fontWeightFallbackOptions: {
			normal: "Normal",
			light: "Light (300)",
			medium: "Medium (500)",
			semibold: "SemiBold (600)",
			bold: "Bold",
		},
		letterSpacing: {
			name: "Terminal letter spacing",
			desc: "Horizontal spacing between characters in pixels (0-3, default 0). Adds breathing room for cramped fonts.",
			placeholder: "0",
		},
		lineHeight: {
			name: "Terminal line height",
			desc: "Vertical spacing multiplier for lines (1.0-1.4, default 1.0). Adds vertical breathing room.",
			placeholder: "1",
		},
		autoOpenOnStartup: {
			name: "Open Claude panel on startup",
			desc: "Automatically open the Claude Code terminal when Obsidian starts.",
		},
		resumeLastSession: {
			name: "Resume last Claude session",
			desc: "Pass --continue when starting a new session to resume the previous conversation context.",
		},
		skipPermissions: {
			name: "Skip permission prompts",
			desc:
				"Pass --dangerously-skip-permissions to Claude Code. Claude will execute tool calls without " +
				"asking for confirmation. Only enable this if you trust the tasks you are running.",
		},
		mcpServerHeading: "Vault MCP server",
		mcpServerEnabled: {
			name: "Enable vault MCP server",
			desc:
				"Starts a local MCP server that gives Claude vault-aware tools (read, search, create, update notes). " +
				"Registers automatically in .mcp.json in the vault root.",
		},
		mcpReadOnly: {
			name: "Read-only vault access",
			desc:
				"When enabled, Claude can read and search notes but cannot create or update them. " +
				"Takes effect the next time the MCP server starts.",
		},
		mcpServerPort: {
			name: "MCP server port",
			desc:
				"Port the vault MCP server listens on (default 27123). If the port is in use, the next " +
				"available port up to +4 is used automatically. Restart the plugin after changing.",
			placeholder: "27123",
		},
		vaultContextHeading: "Vault context",
		generateClaudeMd: {
			name: "Generate CLAUDE.md",
			desc:
				"Creates a CLAUDE.md file at your vault root summarizing its structure and tags — Claude Code " +
				"loads this automatically at the start of every session. Safe to run again anytime; if a CLAUDE.md " +
				"already exists, you'll be asked to confirm, and the current one is saved as CLAUDE.bak.md before " +
				"it's replaced.",
			button: "Generate CLAUDE.md",
			buttonGenerating: "Generating...",
		},
		validation: {
			mustBeGreaterThanZero: "Must be greater than 0.",
			mustBeBetween100And100000: "Must be between 100 and 100000.",
			mustBeBetween0And3: "Must be between 0 and 3.",
			mustBeBetween1And1_4: "Must be between 1.0 and 1.4.",
			mustBeBetween1024And65535: "Must be between 1024 and 65535.",
		},
	},
	commands: {
		openTerminal: "Open Claude Code terminal",
		quickAsk: "Ask Claude (quick)",
		askAboutNote: "Ask Claude about this note",
		askAboutSelection: "Ask Claude about selection",
		insertNoteReference: "Insert note reference into terminal",
		newSession: "Start new Claude Code session",
	},
	ribbon: {
		tooltip: "Open Claude Code",
	},
	contextMenu: {
		askAboutThis: "Ask Claude about this",
	},
	notices: {
		noActiveNote: "No active note.",
		noTextSelected: "No text selected.",
		openTerminalFirst: "Open the Claude Code terminal first.",
		newVersionAvailable: (version: string) =>
			`Glass ${version} is available. Click the version in the toolbar to update.`,
		mcpServerStarted: "Vault MCP server started. Start a new session for Claude to pick it up.",
		mcpServerStopped: "Vault MCP server stopped. Start a new session for the change to take effect in Claude.",
		claudeMdCreated: "CLAUDE.md created at your vault root.",
		claudeMdGenerationFailed: (error: string | undefined) => `Failed to generate CLAUDE.md: ${error}`,
		noActiveSession: "No active Claude Code session.",
	},
	modals: {
		quickAsk: {
			title: "Ask Claude",
			contextLabel: "Context:",
			promptPlaceholder: "Ask Claude anything...",
			askButton: "Ask Claude",
			asking: "Asking...",
			stopButton: "Stop",
			modelLabel: "Model:",
			copyButton: "Copy response",
			copied: "Copied!",
			promptRequired: "Please enter a prompt.",
			copiedToClipboard: "Response copied to clipboard.",
			copyFailed: "Failed to copy to clipboard.",
			errorPrefix: (error: string) => `Error: ${error}`,
		},
		claudeMdOnboarding: {
			title: "Set up vault context for Claude?",
			body:
				"Glass can generate a CLAUDE.md file summarizing this vault's structure and tags. Claude Code " +
				"loads this automatically at the start of every session, so it understands your vault without " +
				"you explaining it each time. You can review and edit the file afterward, and regenerate it " +
				"anytime from Settings → Glass.",
			generateButton: "Generate CLAUDE.md",
			notNowButton: "Not now",
			generating: "Generating CLAUDE.md — this can take a moment...",
			done: "Done. CLAUDE.md created at your vault root.",
			doneNotice: "CLAUDE.md created. Claude will use it starting with your next session.",
			failed: (error: string | undefined) => `Failed: ${error}`,
		},
		confirmClaudeMdOverwrite: {
			title: "Overwrite CLAUDE.md?",
			body:
				"A CLAUDE.md already exists at your vault root. The current one will be saved as " +
				"CLAUDE.bak.md (overwriting any previous backup) before the new one is written.",
		},
		confirm: {
			continueButton: "Continue",
			cancelButton: "Cancel",
		},
	},
	terminal: {
		filePicker: {
			placeholder: "Type to search notes...",
		},
		viewDisplayText: "Claude Code",
		wordmark: "GLASS",
		byline: "by Blackglass",
		toolbar: {
			newSession: "New session",
			newSessionTooltip: "Start a new Claude Code session",
			clear: "Clear",
			clearTooltip: "Clear terminal output without ending the session",
			insertReference: "@",
			insertReferenceTooltip: "Insert a note reference into the terminal (@filename)",
			settingsTooltip: "Open glass settings",
		},
		status: {
			sessionLabel: "session",
			noSession: "No session",
			sessionStatusNoSession: "Session status: no session",
			mcpLabel: "MCP",
			sessionActive: "Session active",
			sessionEnded: "Session ended",
			sessionStatus: (title: string) => `Session status: ${title.toLowerCase()}`,
			updateAvailable: (version: string) => `Glass ${version} is available — click to update`,
			mcpRunning: (port: number) => `Vault MCP server running on port ${port}`,
			mcpFailed: "Vault MCP server failed to start",
			mcpDisabled: "Vault MCP server disabled",
		},
		banners: {
			failedToStart: (message: string) => `\r\n\x1b[31mFailed to start Claude Code: ${message}\x1b[0m`,
			windowsSetupHeading: `\r\n\x1b[33mSetup steps:\x1b[0m`,
			windowsSetupStep1: `\r\n\x1b[33m  1. Install Python 3: https://www.python.org/downloads/\x1b[0m`,
			windowsSetupStep2: `\r\n\x1b[33m  2. Run in PowerShell: pip install pywinpty\x1b[0m`,
			windowsSetupStep3: `\r\n\x1b[33m  3. Reload Obsidian\x1b[0m`,
			checkPathWindowsPywinpty: (claudePath: string) =>
				`\r\n\x1b[33mCheck that '${claudePath}' is on your PATH. If pywinpty is missing: pip install pywinpty\x1b[0m`,
			checkPathUnixPython: (claudePath: string) =>
				`\r\n\x1b[33mCheck that '${claudePath}' is on your PATH and that Python 3 is installed.\x1b[0m`,
			checkPathWithHint: (claudePath: string, hint: string) =>
				`\r\n\x1b[33mCheck that '${claudePath}' is on your PATH.${hint}\x1b[0m`,
			setupHintWindows: " Python 3 and pywinpty are required (pip install pywinpty).",
			setupHintUnix: " Check that Python 3 is installed.",
			noPreviousSession: `\r\n\x1b[33m[No previous session found — starting fresh]\x1b[0m\r\n`,
			sessionEndedWithCode: (exitCode: number) =>
				`\r\n\x1b[90m[Claude Code session ended with exit code ${exitCode}]\x1b[0m`,
		},
	},
	errors: {
		pythonNotFound: (installHint: string) => `Python 3 not found. ${installHint}`,
		installPythonDownloadLink: "Install Python 3 from https://www.python.org/downloads/",
		installPythonHomebrew: "Install it via Homebrew: brew install python3",
		requestTimedOut: (seconds: number) => `Request timed out after ${seconds}s`,
		claudeExitedWithCode: (code: number | null) => `Claude exited with code ${code}`,
		failedToStartClaude: (message: string, hint: string) => `Failed to start Claude: ${message}. ${hint}`,
		setBinaryPathHint: `Set the full path in Settings → Glass → "Claude binary path".`,
		setBinaryPathHintWindows: (example: string) =>
			`Set the full path in Settings → Glass → "Claude binary path" (e.g. ${example}).`,
		isOnPathHint: (claudePath: string) => `Is '${claudePath}' on your PATH?`,
		vaultRootNotFound: "Could not determine vault root.",
		emptyClaudeResponse: "Claude returned an empty response.",
		failedToWriteClaudeMd: (message: string) => `Failed to write CLAUDE.md: ${message}`,
	},
} as const;
