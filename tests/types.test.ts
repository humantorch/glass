import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({ getLanguage: () => "en" }));

import { QUICK_ASK_MODELS, RETIRED_QUICK_ASK_MODELS } from "../src/types";

describe("RETIRED_QUICK_ASK_MODELS", () => {
	const current = new Set(QUICK_ASK_MODELS.map(([id]) => id));

	it("maps every retired model to one that is still offered", () => {
		for (const [retired, replacement] of Object.entries(RETIRED_QUICK_ASK_MODELS)) {
			expect(current.has(replacement), `${retired} -> ${replacement}`).toBe(true);
		}
	});

	it("never lists a model as both retired and current", () => {
		for (const retired of Object.keys(RETIRED_QUICK_ASK_MODELS)) {
			expect(current.has(retired), retired).toBe(false);
		}
	});
});
