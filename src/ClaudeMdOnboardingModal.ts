import { App, Modal, Notice } from "obsidian";
import type ClaudeCodePlugin from "./main";
import { generateClaudeMd } from "./ClaudeMdGenerator";
import { strings } from "./i18n";

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

		contentEl.createEl("h2", { text: strings.modals.claudeMdOnboarding.title });
		contentEl.createEl("p", {
			text: strings.modals.claudeMdOnboarding.body,
		});

		this.statusEl = contentEl.createEl("p", { cls: "claude-onboarding-modal-status" });
		this.statusEl.hide();

		const actions = contentEl.createDiv({ cls: "claude-onboarding-modal-actions" });
		this.generateBtn = actions.createEl("button", { text: strings.modals.claudeMdOnboarding.generateButton, cls: "mod-cta" });
		this.generateBtn.addEventListener("click", () => { void this.runGeneration(); });

		this.dismissBtn = actions.createEl("button", { text: strings.modals.claudeMdOnboarding.notNowButton });
		this.dismissBtn.addEventListener("click", () => this.close());
	}

	private async runGeneration(): Promise<void> {
		if (!this.generateBtn || !this.dismissBtn || !this.statusEl) return;
		this.generateBtn.disabled = true;
		this.dismissBtn.disabled = true;
		this.statusEl.show();
		this.statusEl.textContent = strings.modals.claudeMdOnboarding.generating;

		const result = await generateClaudeMd(this.plugin);

		if (result.success) {
			this.statusEl.textContent = strings.modals.claudeMdOnboarding.done;
			new Notice(strings.modals.claudeMdOnboarding.doneNotice);
			window.setTimeout(() => this.close(), 1200);
		} else {
			this.statusEl.textContent = strings.modals.claudeMdOnboarding.failed(result.error);
			this.generateBtn.disabled = false;
			this.dismissBtn.disabled = false;
		}
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
