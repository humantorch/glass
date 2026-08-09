import { describe, it, expect, vi, afterEach } from "vitest";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { buildVaultSurvey, stripCodeFence, writeClaudeMdWithBackup } from "../src/ClaudeMdGenerator";

vi.mock("obsidian", () => {
	class TFile {
		path: string;
		constructor(path: string) {
			this.path = path;
		}
	}
	return {
		TFile,
		App: class App {},
		getAllTags: (cache: { tags?: string[] } | null) => cache?.tags ?? [],
	};
});

import { TFile } from "obsidian";

function buildMockApp(files: Record<string, string[]> = {}) {
	// files: path -> tags for that note
	const fileObjects = Object.keys(files).map((p) => new TFile(p));
	return {
		vault: {
			getMarkdownFiles: () => fileObjects,
		},
		metadataCache: {
			getFileCache: (file: InstanceType<typeof TFile>) => {
				const tags = files[file.path];
				return tags ? { tags } : null;
			},
		},
	};
}

describe("buildVaultSurvey", () => {
	it("counts notes per top-level folder", () => {
		const app = buildMockApp({
			"Weekly/a.md": [],
			"Weekly/b.md": [],
			"Projects/glass.md": [],
			"inbox.md": [],
		});
		const survey = buildVaultSurvey(app as any, "TestVault");
		expect(survey).toContain("Vault name: TestVault");
		expect(survey).toContain("Total notes: 4");
		expect(survey).toContain("- Weekly: 2 notes");
		expect(survey).toContain("- Projects: 1 note");
		expect(survey).toContain("- (vault root): 1 note");
	});

	it("aggregates and sorts tags by frequency", () => {
		const app = buildMockApp({
			"a.md": ["#weekly", "#task"],
			"b.md": ["#weekly"],
			"c.md": ["#project"],
		});
		const survey = buildVaultSurvey(app as any, "TestVault");
		expect(survey).toContain("#weekly (2), #project (1), #task (1)");
	});

	it("reports an empty vault without error", () => {
		const app = buildMockApp({});
		const survey = buildVaultSurvey(app as any, "EmptyVault");
		expect(survey).toContain("Total notes: 0");
		expect(survey).toContain("(no subfolders — all notes at vault root)");
		expect(survey).toContain("(no tags found)");
		expect(survey).toContain("(vault is empty)");
	});

	it("includes a sample of note paths", () => {
		const app = buildMockApp({ "inbox.md": [], "Weekly/a.md": [] });
		const survey = buildVaultSurvey(app as any, "TestVault");
		expect(survey).toContain("inbox.md");
		expect(survey).toContain("Weekly/a.md");
	});
});

describe("stripCodeFence", () => {
	it("strips a ```markdown fence", () => {
		expect(stripCodeFence("```markdown\n# Hello\n```")).toBe("# Hello");
	});

	it("strips a bare ``` fence", () => {
		expect(stripCodeFence("```\n# Hello\n```")).toBe("# Hello");
	});

	it("passes unfenced text through unchanged", () => {
		expect(stripCodeFence("# Hello")).toBe("# Hello");
	});
});

describe("writeClaudeMdWithBackup", () => {
	let tmpDir: string;

	afterEach(() => {
		if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
	});

	it("writes CLAUDE.md directly when none exists yet", () => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "claude-md-test-"));
		writeClaudeMdWithBackup(tmpDir, "# New content");
		expect(fs.readFileSync(path.join(tmpDir, "CLAUDE.md"), "utf8")).toBe("# New content");
		expect(fs.existsSync(path.join(tmpDir, "CLAUDE.bak.md"))).toBe(false);
	});

	it("backs up an existing CLAUDE.md before overwriting it", () => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "claude-md-test-"));
		fs.writeFileSync(path.join(tmpDir, "CLAUDE.md"), "# Old content");
		writeClaudeMdWithBackup(tmpDir, "# New content");
		expect(fs.readFileSync(path.join(tmpDir, "CLAUDE.md"), "utf8")).toBe("# New content");
		expect(fs.readFileSync(path.join(tmpDir, "CLAUDE.bak.md"), "utf8")).toBe("# Old content");
	});

	it("keeps only a single rolling backup across repeated regenerations", () => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "claude-md-test-"));
		writeClaudeMdWithBackup(tmpDir, "# Version 1");
		writeClaudeMdWithBackup(tmpDir, "# Version 2");
		writeClaudeMdWithBackup(tmpDir, "# Version 3");
		expect(fs.readFileSync(path.join(tmpDir, "CLAUDE.md"), "utf8")).toBe("# Version 3");
		expect(fs.readFileSync(path.join(tmpDir, "CLAUDE.bak.md"), "utf8")).toBe("# Version 2");
	});
});
