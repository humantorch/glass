import { describe, it, expect } from "vitest";
import { expandHome } from "../src/paths";

describe("expandHome", () => {
	it("expands a leading ~/", () => {
		expect(expandHome("~/.local/share/mise/shims/claude", "/Users/a")).toBe("/Users/a/.local/share/mise/shims/claude");
	});

	it("expands a bare ~", () => {
		expect(expandHome("~", "/Users/a")).toBe("/Users/a");
	});

	it("expands a Windows-style ~\\", () => {
		expect(expandHome("~\\bin\\claude.exe", "C:\\Users\\a")).toBe("C:\\Users\\a\\bin\\claude.exe");
	});

	it("leaves other paths alone", () => {
		expect(expandHome("claude", "/Users/a")).toBe("claude");
		expect(expandHome("/opt/homebrew/bin/claude", "/Users/a")).toBe("/opt/homebrew/bin/claude");
		expect(expandHome("~other/claude", "/Users/a")).toBe("~other/claude");
	});
});
