import { describe, it, expect } from "vitest";
import { execFileSync } from "child_process";
import { buildTmuxArgs, shellQuote, tmuxSessionName, tmuxTarget } from "../src/tmux";

describe("tmuxSessionName", () => {
	it("prefixes the vault name", () => {
		expect(tmuxSessionName("Notes")).toBe("glass-Notes");
	});

	it("replaces characters that are unsafe in a shell or a tmux target", () => {
		expect(tmuxSessionName("My vault: v1.2 $(rm -rf ~)")).toBe("glass-My-vault-v1-2-rm-rf");
	});

	it("falls back to a plain name when nothing usable is left", () => {
		expect(tmuxSessionName("日本語")).toBe("glass");
		expect(tmuxSessionName("")).toBe("glass");
	});

	it("caps the length", () => {
		expect(tmuxSessionName("a".repeat(200)).length).toBe("glass-".length + 48);
	});
});

describe("shellQuote", () => {
	it.each([
		"claude",
		"/Users/me/My Apps/claude",
		"it's",
		"$(touch /tmp/pwned)",
		"`id`; echo hi",
		"a\"b\\c",
	])("round-trips %s through sh unchanged", (arg) => {
		const out = execFileSync("/bin/sh", ["-c", `printf %s ${shellQuote(arg)}`], { encoding: "utf8" });
		expect(out).toBe(arg);
	});
});

describe("buildTmuxArgs", () => {
	it("creates or attaches to the session and passes one quoted command string", () => {
		const args = buildTmuxArgs("glass-Notes", "/vault path", ["/bin/claude", "--continue"]);
		expect(args).toEqual([
			"-u",
			"new-session",
			"-A",
			"-s", "glass-Notes",
			"-c", "/vault path",
			"exec '/bin/claude' '--continue'",
			";", "set-option", "-t", "=glass-Notes:", "status", "off",
		]);
	});

	it("passes environment variables to the new session explicitly", () => {
		const args = buildTmuxArgs("glass-Notes", "/vault", ["claude"], { GLASS_MODE: "terminal" });
		expect(args.slice(0, 9)).toEqual([
			"-u", "new-session", "-A", "-s", "glass-Notes", "-c", "/vault", "-e", "GLASS_MODE=terminal",
		]);
	});
});

describe("tmuxTarget", () => {
	it("uses exact matching", () => {
		expect(tmuxTarget("glass-Notes")).toBe("=glass-Notes");
	});
});
