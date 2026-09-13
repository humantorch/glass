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

	it("resolves to English when the detected language has no locale file registered", async () => {
		getLanguageMock.mockReturnValue("xx");
		const strings = await loadStrings();
		expect(strings.settings.claudeBinaryPath.name).toBe("Claude binary path");
		expect(strings.commands.openTerminal).toBe("Open Claude Code terminal");
	});

	it.each([
		["de", "Claude-Binärpfad", "Claude-Code-Terminal öffnen"],
		["es", "Ruta del binario de Claude", "Abrir terminal de Claude Code"],
		["nl", "Pad naar Claude-programma", "Claude Code-terminal openen"],
		["fr", "Chemin du binaire Claude", "Ouvrir le terminal Claude Code"],
	])("resolves to the registered locale's strings for %s", async (lang, binaryPathName, openTerminal) => {
		getLanguageMock.mockReturnValue(lang);
		const strings = await loadStrings();
		expect(strings.settings.claudeBinaryPath.name).toBe(binaryPathName);
		expect(strings.commands.openTerminal).toBe(openTerminal);
	});

	it("resolves to English when getLanguage() throws", async () => {
		getLanguageMock.mockImplementation(() => {
			throw new Error("not available");
		});
		const strings = await loadStrings();
		expect(strings.settings.claudeBinaryPath.name).toBe("Claude binary path");
	});
});
