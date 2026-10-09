import * as os from "os";

/** Expands a leading "~" so a binary path like "~/.local/bin/claude" works without a shell. */
export function expandHome(p: string, home: string = os.homedir()): string {
	if (p === "~") return home;
	if (p.startsWith("~/") || p.startsWith("~\\")) return home + p.slice(1);
	return p;
}
