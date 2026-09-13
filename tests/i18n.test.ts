import { describe, it, expect, vi, beforeEach } from "vitest";

// getLanguage() is real only inside Obsidian's runtime; mock it per-test so we
// can exercise strings resolution for various detected languages and the
// error path (getLanguage throws).
const { getLanguageMock } = vi.hoisted(() => ({ getLanguageMock: vi.fn() }));
vi.mock("obsidian", () => ({ getLanguage: getLanguageMock }));

// src/i18n/index.ts resolves `strings` once at module load, so each test needs
// a fresh module instance to pick up that test's mocked language.
async function loadStrings() {
	vi.resetModules();
	const mod = await import("../src/i18n/index");
	return mod.strings;
}

describe("i18n", () => {
	beforeEach(() => {
		getLanguageMock.mockReset();
	});

	it("resolves to English regardless of detected language, since no locale file is registered yet", async () => {
		getLanguageMock.mockReturnValue("de");
		const strings = await loadStrings();
		expect(strings.settings.claudeBinaryPath.name).toBe("Claude binary path");
		expect(strings.commands.openTerminal).toBe("Open Claude Code terminal");
	});

	it("resolves to English when getLanguage() throws", async () => {
		getLanguageMock.mockImplementation(() => {
			throw new Error("not available");
		});
		const strings = await loadStrings();
		expect(strings.settings.claudeBinaryPath.name).toBe("Claude binary path");
	});
});
