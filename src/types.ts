export interface ClaudeCodeSettings {
	claudeBinaryPath: string;
	workingDirectory: string;
	quickAskModel: string;
	autoOpenOnStartup: boolean;
	resumeLastSession: boolean;
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
	letterSpacing: number;
	lineHeight: number;
	mcpServerEnabled: boolean;
	mcpServerPort: number;
	mcpReadOnly: boolean;
	skipPermissions: boolean;
	scrollback: number;
}

export const DEFAULT_SETTINGS: ClaudeCodeSettings = {
	claudeBinaryPath: "claude",
	workingDirectory: "",
	quickAskModel: "",
	autoOpenOnStartup: false,
	resumeLastSession: true,
	fontSize: 14,
	fontFamily: "monospace",
	fontWeight: "normal",
	letterSpacing: 0,
	lineHeight: 1,
	mcpServerEnabled: true,
	mcpServerPort: 27123,
	mcpReadOnly: false,
	skipPermissions: false,
	scrollback: 5000,
};

export const CLAUDE_TERMINAL_VIEW_TYPE = "claude-code-terminal";
export const CLAUDE_ICON = "bot";

export const QUICK_ASK_MODELS: [string, string][] = [
	["", "Default"],
	["claude-haiku-4-5-20251001", "Haiku 4.5"],
	["claude-sonnet-4-6", "Sonnet 4.6"],
	["claude-opus-4-8", "Opus 4.8"],
];

export interface PtySessionOptions {
	claudePath: string;
	workingDirectory: string;
	resumeLastSession: boolean;
	skipPermissions: boolean;
	cols: number;
	rows: number;
}

export interface PrintModeOptions {
	claudePath: string;
	workingDirectory: string;
	model?: string;
	timeoutMs?: number;
}

export interface PrintModeResult {
	success: boolean;
	text: string;
	error?: string;
}

