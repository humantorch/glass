import { App, Modal } from "obsidian";

export class ConfirmModal extends Modal {
	constructor(
		app: App,
		private titleText: string,
		private bodyText: string,
		private onConfirm: () => void | Promise<void>
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass("claude-confirm-modal");
		contentEl.createEl("h2", { text: this.titleText });
		contentEl.createEl("p", { text: this.bodyText });

		const actions = contentEl.createDiv({ cls: "claude-confirm-modal-actions" });
		const confirmBtn = actions.createEl("button", { text: "Continue", cls: "mod-warning" });
		confirmBtn.addEventListener("click", () => {
			this.close();
			void this.onConfirm();
		});
		const cancelBtn = actions.createEl("button", { text: "Cancel" });
		cancelBtn.addEventListener("click", () => this.close());
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
