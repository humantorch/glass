// Pure helpers for running the interactive session inside tmux (macOS/Linux).
// Kept free of Obsidian/Node imports so they can be unit tested directly.

/**
 * Derives a stable, per-vault tmux session name. Restricted to [A-Za-z0-9_-]
 * so the name is safe to type in a shell and never contains the "." or ":"
 * characters tmux treats as target separators.
 */
export function tmuxSessionName(vaultName: string): string {
	const slug = vaultName
		.replace(/[^A-Za-z0-9_-]+/g, "-")
		.replace(/-{2,}/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 48);
	return slug ? `glass-${slug}` : "glass";
}

/** POSIX single-quote escaping: the result is always one literal shell word. */
export function shellQuote(arg: string): string {
	return `'${arg.replace(/'/g, `'\\''`)}'`;
}

/**
 * Builds the argv (excluding the tmux binary itself) that creates the named
 * session running `command`, or attaches to it if it already exists.
 *
 * tmux hands a single shell-command argument to `sh -c` (and older versions
 * join multiple arguments into one string anyway), so the command is passed
 * as one string with every word quoted. That keeps paths with spaces working
 * and prevents a crafted binary path from being interpreted by the shell.
 */
export function buildTmuxArgs(sessionName: string, cwd: string, command: string[]): string[] {
	return [
		// Force UTF-8: Obsidian launched from the Dock often has no LANG set, and
		// tmux would otherwise replace non-ASCII output with underscores.
		"-u",
		"new-session",
		"-A",
		"-s", sessionName,
		"-c", cwd,
		`exec ${command.map(shellQuote).join(" ")}`,
		// Glass has its own status UI; hide tmux's bar for this session only.
		";", "set-option", "-t", `${tmuxTarget(sessionName)}:`, "status", "off",
	];
}

/** Exact-match target for has-session / kill-session (no prefix matching). */
export function tmuxTarget(sessionName: string): string {
	return `=${sessionName}`;
}
