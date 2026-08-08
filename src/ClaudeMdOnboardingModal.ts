import { App, Modal, Notice } from "obsidian";
import type ClaudeCodePlugin from "./main";
import { generateClaudeMd } from "./ClaudeMdGenerator";

export class ClaudeMdOnboardingModal extends Modal {
	private plugin: ClaudeCodePlugin;
	private generateBtn: HTMLButtonElement | null = null;
	private dismissBtn: HTMLButtonElement | null = null;
	private statusEl: HTMLElement | null = null;

	constructor(app: App, plugin: ClaudeCodePlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass("claude-onboarding-modal");

		contentEl.createEl("h2", { text: "Set up vault context for Claude?" });
		contentEl.createEl("p", {
			text:
				"Glass can generate a CLAUDE.md file summarizing this vault's structure and tags. " +
				"Claude Code loads this automatically at the start of every session, so it understands your " +
				"vault without you explaining it each time. You can review and edit the file afterward, and " +
				"regenerate it anytime from Settings → Glass.",
		});

		this.statusEl = contentEl.createEl("p", { cls: "claude-onboarding-modal-status" });
		this.statusEl.hide();

		const actions = contentEl.createDiv({ cls: "claude-onboarding-modal-actions" });
		this.generateBtn = actions.createEl("button", { text: "Generate CLAUDE.md", cls: "mod-cta" });
		this.generateBtn.addEventListener("click", () => { void this.runGeneration(); });

		this.dismissBtn = actions.createEl("button", { text: "Not now" });
		this.dismissBtn.addEventListener("click", () => this.close());
	}

	private async runGeneration(): Promise<void> {
		if (!this.generateBtn || !this.dismissBtn || !this.statusEl) return;
		this.generateBtn.disabled = true;
		this.dismissBtn.disabled = true;
		this.statusEl.show();
		this.statusEl.textContent = "Generating CLAUDE.md — this can take a moment...";

		const result = await generateClaudeMd(this.plugin);

		if (result.success) {
			this.statusEl.textContent = "Done. CLAUDE.md created at your vault root.";
			new Notice("CLAUDE.md created. Claude will use it starting with your next session.");
			window.setTimeout(() => this.close(), 1200);
		} else {
			this.statusEl.textContent = `Failed: ${result.error}`;
			this.generateBtn.disabled = false;
			this.dismissBtn.disabled = false;
		}
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
