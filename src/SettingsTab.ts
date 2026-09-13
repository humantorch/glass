import { App, ButtonComponent, DropdownComponent, Notice, PluginSettingTab, Setting, SettingDefinitionItem } from "obsidian";
import * as fs from "fs";
import * as path from "path";
import type ClaudeCodePlugin from "./main";
import { QUICK_ASK_MODELS } from "./types";
import { generateClaudeMd } from "./ClaudeMdGenerator";
import { ConfirmModal } from "./ConfirmModal";
import { strings } from "./i18n";

interface FontData {
	family: string;
	style: string;
	fullName: string;
	postscriptName: string;
}

declare global {
	interface Window {
		queryLocalFonts?(): Promise<FontData[]>;
	}
}

export class SettingsTab extends PluginSettingTab {
	plugin: ClaudeCodePlugin;
	private fontVariantMap: Map<string, Array<{ label: string; weight: string }>> = new Map();
	private pendingFontFamilySetting: Setting | undefined;

	constructor(app: App, plugin: ClaudeCodePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName(strings.settings.claudeBinaryPath.name)
			.setDesc(strings.settings.claudeBinaryPath.desc)
			.addText((text) =>
				text
					.setPlaceholder(strings.settings.claudeBinaryPath.placeholder)
					.setValue(this.plugin.settings.claudeBinaryPath)
					.onChange(async (value) => {
						this.plugin.settings.claudeBinaryPath = value.trim() || "claude";
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(strings.settings.workingDirectory.name)
			.setDesc(strings.settings.workingDirectory.desc)
			.addText((text) =>
				text
					.setPlaceholder(strings.settings.workingDirectory.placeholder)
					.setValue(this.plugin.settings.workingDirectory)
					.onChange(async (value) => {
						this.plugin.settings.workingDirectory = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(strings.settings.quickAskModel.name)
			.setDesc(strings.settings.quickAskModel.desc)
			.addDropdown((dropdown) => {
				for (const [value, label] of QUICK_ASK_MODELS) {
					dropdown.addOption(value, label);
				}
				dropdown
					.setValue(this.plugin.settings.quickAskModel)
					.onChange(async (value) => {
						this.plugin.settings.quickAskModel = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(strings.settings.fontSize.name)
			.setDesc(strings.settings.fontSize.desc)
			.addText((text) =>
				text
					.setPlaceholder(strings.settings.fontSize.placeholder)
					.setValue(String(this.plugin.settings.fontSize))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						if (!isNaN(parsed) && parsed > 0) {
							this.plugin.settings.fontSize = parsed;
							await this.plugin.saveSettings();
							this.plugin.applyFontToTerminal();
						}
					})
			);

		new Setting(containerEl)
			.setName(strings.settings.scrollback.name)
			.setDesc(strings.settings.scrollback.desc)
			.addText((text) =>
				text
					.setPlaceholder(strings.settings.scrollback.placeholder)
					.setValue(String(this.plugin.settings.scrollback))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						if (!isNaN(parsed) && parsed >= 100 && parsed <= 100000) {
							this.plugin.settings.scrollback = parsed;
							await this.plugin.saveSettings();
						}
					})
			);

		// Create stubs synchronously so they appear in the right position,
		// then fill in the dropdowns asynchronously once font data is loaded.
		const familySetting = new Setting(containerEl)
			.setName(strings.settings.fontFamily.name)
			.setDesc(strings.settings.fontFamily.descLoading);
		const weightSetting = new Setting(containerEl)
			.setName(strings.settings.fontWeight.name)
			.setDesc(strings.settings.fontWeight.descLoading);
		void this.buildFontDropdowns(familySetting, weightSetting);

		new Setting(containerEl)
			.setName(strings.settings.letterSpacing.name)
			.setDesc(strings.settings.letterSpacing.desc)
			.addText((text) =>
				text
					.setPlaceholder(strings.settings.letterSpacing.placeholder)
					.setValue(String(this.plugin.settings.letterSpacing))
					.onChange(async (value) => {
						const parsed = parseFloat(value);
						if (!isNaN(parsed) && parsed >= 0 && parsed <= 3) {
							this.plugin.settings.letterSpacing = parsed;
							await this.plugin.saveSettings();
							this.plugin.applyFontToTerminal();
						}
					})
			);

		new Setting(containerEl)
			.setName(strings.settings.lineHeight.name)
			.setDesc(strings.settings.lineHeight.desc)
			.addText((text) =>
				text
					.setPlaceholder(strings.settings.lineHeight.placeholder)
					.setValue(String(this.plugin.settings.lineHeight))
					.onChange(async (value) => {
						const parsed = parseFloat(value);
						if (!isNaN(parsed) && parsed >= 1 && parsed <= 1.4) {
							this.plugin.settings.lineHeight = parsed;
							await this.plugin.saveSettings();
							this.plugin.applyFontToTerminal();
						}
					})
			);

		new Setting(containerEl)
			.setName(strings.settings.autoOpenOnStartup.name)
			.setDesc(strings.settings.autoOpenOnStartup.desc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoOpenOnStartup)
					.onChange(async (value) => {
						this.plugin.settings.autoOpenOnStartup = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(strings.settings.resumeLastSession.name)
			.setDesc(strings.settings.resumeLastSession.desc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.resumeLastSession)
					.onChange(async (value) => {
						this.plugin.settings.resumeLastSession = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(strings.settings.skipPermissions.name)
			.setDesc(strings.settings.skipPermissions.desc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.skipPermissions)
					.onChange(async (value) => {
						this.plugin.settings.skipPermissions = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl).setName(strings.settings.mcpServerHeading).setHeading();

		new Setting(containerEl)
			.setName(strings.settings.mcpServerEnabled.name)
			.setDesc(strings.settings.mcpServerEnabled.desc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.mcpServerEnabled)
					.onChange(async (value) => {
						this.plugin.settings.mcpServerEnabled = value;
						await this.plugin.saveSettings();
						if (value) {
							await this.plugin.startVaultMcpServer();
							new Notice(strings.notices.mcpServerStarted);
						} else {
							this.plugin.stopVaultMcpServer();
							new Notice(strings.notices.mcpServerStopped);
						}
					})
			);

		new Setting(containerEl)
			.setName(strings.settings.mcpReadOnly.name)
			.setDesc(strings.settings.mcpReadOnly.desc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.mcpReadOnly)
					.onChange(async (value) => {
						this.plugin.settings.mcpReadOnly = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(strings.settings.mcpServerPort.name)
			.setDesc(strings.settings.mcpServerPort.desc)
			.addText((text) =>
				text
					.setPlaceholder(strings.settings.mcpServerPort.placeholder)
					.setValue(String(this.plugin.settings.mcpServerPort))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						if (!isNaN(parsed) && parsed > 1023 && parsed < 65536) {
							this.plugin.settings.mcpServerPort = parsed;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl).setName(strings.settings.vaultContextHeading).setHeading();

		new Setting(containerEl)
			.setName(strings.settings.generateClaudeMd.name)
			.setDesc(strings.settings.generateClaudeMd.desc)
			.addButton((button) => this.wireGenerateClaudeMdButton(button));
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				type: "group",
				items: [
					{
						name: strings.settings.claudeBinaryPath.name,
						desc: strings.settings.claudeBinaryPath.desc,
						control: { type: "text", key: "claudeBinaryPath", placeholder: strings.settings.claudeBinaryPath.placeholder },
					},
					{
						name: strings.settings.workingDirectory.name,
						desc: strings.settings.workingDirectory.desc,
						control: { type: "text", key: "workingDirectory", placeholder: strings.settings.workingDirectory.placeholder },
					},
					{
						name: strings.settings.quickAskModel.name,
						desc: strings.settings.quickAskModel.desc,
						control: { type: "dropdown", key: "quickAskModel", options: Object.fromEntries(QUICK_ASK_MODELS) },
					},
					{
						name: strings.settings.fontSize.name,
						desc: strings.settings.fontSize.desc,
						control: {
							type: "number",
							key: "fontSize",
							placeholder: strings.settings.fontSize.placeholder,
							min: 1,
							step: 1,
							validate: (value) => (value > 0 ? undefined : strings.settings.validation.mustBeGreaterThanZero),
						},
					},
					{
						name: strings.settings.scrollback.name,
						desc: strings.settings.scrollback.desc,
						control: {
							type: "number",
							key: "scrollback",
							placeholder: strings.settings.scrollback.placeholder,
							min: 100,
							max: 100000,
							step: 1,
							validate: (value) =>
								value >= 100 && value <= 100000 ? undefined : strings.settings.validation.mustBeBetween100And100000,
						},
					},
					{
						name: strings.settings.fontFamily.name,
						desc: strings.settings.fontFamily.desc,
						render: (setting) => {
							setting.setDesc(strings.settings.fontFamily.descLoading);
							this.pendingFontFamilySetting = setting;
						},
					},
					{
						name: strings.settings.fontWeight.name,
						desc: strings.settings.fontWeight.desc,
						render: (setting) => {
							setting.setDesc(strings.settings.fontWeight.descLoading);
							void this.buildFontDropdowns(this.pendingFontFamilySetting as Setting, setting);
						},
					},
					{
						name: strings.settings.letterSpacing.name,
						desc: strings.settings.letterSpacing.desc,
						control: {
							type: "number",
							key: "letterSpacing",
							placeholder: strings.settings.letterSpacing.placeholder,
							min: 0,
							max: 3,
							step: 0.1,
							validate: (value) => (value >= 0 && value <= 3 ? undefined : strings.settings.validation.mustBeBetween0And3),
						},
					},
					{
						name: strings.settings.lineHeight.name,
						desc: strings.settings.lineHeight.desc,
						control: {
							type: "number",
							key: "lineHeight",
							placeholder: strings.settings.lineHeight.placeholder,
							min: 1,
							max: 1.4,
							step: 0.1,
							validate: (value) => (value >= 1 && value <= 1.4 ? undefined : strings.settings.validation.mustBeBetween1And1_4),
						},
					},
					{
						name: strings.settings.autoOpenOnStartup.name,
						desc: strings.settings.autoOpenOnStartup.desc,
						control: { type: "toggle", key: "autoOpenOnStartup" },
					},
					{
						name: strings.settings.resumeLastSession.name,
						desc: strings.settings.resumeLastSession.desc,
						control: { type: "toggle", key: "resumeLastSession" },
					},
					{
						name: strings.settings.skipPermissions.name,
						desc: strings.settings.skipPermissions.desc,
						control: { type: "toggle", key: "skipPermissions" },
					},
				],
			},
			{
				type: "group",
				heading: strings.settings.mcpServerHeading,
				items: [
					{
						name: strings.settings.mcpServerEnabled.name,
						desc: strings.settings.mcpServerEnabled.desc,
						control: { type: "toggle", key: "mcpServerEnabled" },
					},
					{
						name: strings.settings.mcpReadOnly.name,
						desc: strings.settings.mcpReadOnly.desc,
						control: { type: "toggle", key: "mcpReadOnly" },
					},
					{
						name: strings.settings.mcpServerPort.name,
						desc: strings.settings.mcpServerPort.desc,
						control: {
							type: "number",
							key: "mcpServerPort",
							placeholder: strings.settings.mcpServerPort.placeholder,
							min: 1024,
							max: 65535,
							step: 1,
							validate: (value) =>
								value > 1023 && value < 65536 ? undefined : strings.settings.validation.mustBeBetween1024And65535,
						},
					},
				],
			},
			{
				type: "group",
				heading: strings.settings.vaultContextHeading,
				items: [
					{
						name: strings.settings.generateClaudeMd.name,
						desc: strings.settings.generateClaudeMd.desc,
						render: (setting) => {
							setting.addButton((button) => this.wireGenerateClaudeMdButton(button));
						},
					},
				],
			},
		];
	}

	async setControlValue(key: string, value: unknown): Promise<void> {
		const settings = this.plugin.settings;
		switch (key) {
			case "claudeBinaryPath":
				settings.claudeBinaryPath = (value as string).trim() || "claude";
				break;
			case "workingDirectory":
				settings.workingDirectory = (value as string).trim();
				break;
			case "quickAskModel":
				settings.quickAskModel = value as string;
				break;
			case "autoOpenOnStartup":
				settings.autoOpenOnStartup = value as boolean;
				break;
			case "resumeLastSession":
				settings.resumeLastSession = value as boolean;
				break;
			case "skipPermissions":
				settings.skipPermissions = value as boolean;
				break;
			case "mcpReadOnly":
				settings.mcpReadOnly = value as boolean;
				break;
			case "mcpServerPort":
				settings.mcpServerPort = value as number;
				break;
			case "scrollback":
				settings.scrollback = value as number;
				break;
			case "fontSize":
				settings.fontSize = value as number;
				await this.plugin.saveSettings();
				this.plugin.applyFontToTerminal();
				return;
			case "letterSpacing":
				settings.letterSpacing = value as number;
				await this.plugin.saveSettings();
				this.plugin.applyFontToTerminal();
				return;
			case "lineHeight":
				settings.lineHeight = value as number;
				await this.plugin.saveSettings();
				this.plugin.applyFontToTerminal();
				return;
			case "mcpServerEnabled": {
				settings.mcpServerEnabled = value as boolean;
				await this.plugin.saveSettings();
				if (value) {
					await this.plugin.startVaultMcpServer();
					new Notice(strings.notices.mcpServerStarted);
				} else {
					this.plugin.stopVaultMcpServer();
					new Notice(strings.notices.mcpServerStopped);
				}
				return;
			}
			default:
				return;
		}
		await this.plugin.saveSettings();
	}

	private wireGenerateClaudeMdButton(button: ButtonComponent): void {
		button.setButtonText(strings.settings.generateClaudeMd.button).onClick(() => {
			const vaultRoot = this.plugin.contextBuilder.getVaultRoot();
			const claudeMdPath = vaultRoot ? path.join(vaultRoot, "CLAUDE.md") : "";
			if (claudeMdPath && fs.existsSync(claudeMdPath)) {
				new ConfirmModal(
					this.app,
					strings.modals.confirmClaudeMdOverwrite.title,
					strings.modals.confirmClaudeMdOverwrite.body,
					() => this.runGenerateClaudeMd(button)
				).open();
			} else {
				void this.runGenerateClaudeMd(button);
			}
		});
	}

	private async runGenerateClaudeMd(button: ButtonComponent): Promise<void> {
		button.setDisabled(true);
		button.setButtonText(strings.settings.generateClaudeMd.buttonGenerating);
		const result = await generateClaudeMd(this.plugin);
		button.setDisabled(false);
		button.setButtonText(strings.settings.generateClaudeMd.button);
		if (result.success) {
			new Notice(strings.notices.claudeMdCreated);
		} else {
			new Notice(strings.notices.claudeMdGenerationFailed(result.error));
		}
	}

	private async buildFontDropdowns(familySetting: Setting, weightSetting: Setting): Promise<void> {
		const { families, variantMap } = await this.getFontData();
		this.fontVariantMap = variantMap;

		let variantDropdown: DropdownComponent | null = null;

		familySetting.setDesc(strings.settings.fontFamily.desc);
		familySetting.addDropdown((dd) => {
			for (const font of families) {
				dd.addOption(font, font);
			}
			const current = this.plugin.settings.fontFamily;
			if (current && !families.includes(current)) {
				dd.addOption(current, current);
			}
			dd.setValue(current);
			dd.onChange(async (value) => {
				this.plugin.settings.fontFamily = value;
				this.plugin.settings.fontWeight = "normal";
				await this.plugin.saveSettings();
				this.plugin.applyFontToTerminal();
				if (variantDropdown) {
					this.populateVariantOptions(variantDropdown, value);
					variantDropdown.setValue("normal");
				}
			});
		});

		weightSetting.setDesc(strings.settings.fontWeight.desc);
		weightSetting.addDropdown((dd) => {
			variantDropdown = dd;
			this.populateVariantOptions(dd, this.plugin.settings.fontFamily);
			// Restore saved weight, fall back to normal if not present
			const saved = this.plugin.settings.fontWeight;
			const available = Array.from(dd.selectEl.options).map((o) => o.value);
			dd.setValue(available.includes(saved) ? saved : "normal");
			dd.onChange(async (value) => {
				this.plugin.settings.fontWeight = value;
				await this.plugin.saveSettings();
				this.plugin.applyFontToTerminal();
			});
		});
	}

	private populateVariantOptions(dd: DropdownComponent, family: string): void {
		dd.selectEl.innerHTML = "";
		const variants = this.fontVariantMap.get(family);
		if (variants && variants.length > 0) {
			for (const v of variants) {
				dd.addOption(v.weight, v.label);
			}
		} else {
			const fallback = strings.settings.fontWeightFallbackOptions;
			dd.addOption("normal", fallback.normal);
			dd.addOption("300", fallback.light);
			dd.addOption("500", fallback.medium);
			dd.addOption("600", fallback.semibold);
			dd.addOption("bold", fallback.bold);
		}
	}

	private styleToWeight(style: string): string {
		const s = style.toLowerCase().replace(/[\s-]/g, "");
		if (s.includes("hairline") || s === "thin") return "100";
		if (s.includes("extralight") || s.includes("ultralight")) return "200";
		if (s.includes("light")) return "300";
		if (s.includes("medium")) return "500";
		if (s.includes("semibold") || s.includes("demibold")) return "600";
		if (s.includes("extrabold") || s.includes("ultrabold")) return "800";
		if (s.includes("black") || s.includes("heavy")) return "900";
		if (s.includes("bold")) return "bold";
		return "normal";
	}

	private async getFontData(): Promise<{
		families: string[];
		variantMap: Map<string, Array<{ label: string; weight: string }>>;
	}> {
		if (window.queryLocalFonts) {
			try {
				const rawFonts = await window.queryLocalFonts();
				const familySet = new Set<string>();
				const variantMap = new Map<string, Array<{ label: string; weight: string }>>();

				for (const font of rawFonts) {
					const { family, style } = font;
					familySet.add(family);

					// Skip italic/oblique — not a useful weight choice for a terminal
					const styleLower = style.toLowerCase();
					if (styleLower.includes("italic") || styleLower.includes("oblique")) continue;

					if (!variantMap.has(family)) variantMap.set(family, []);
					const weight = this.styleToWeight(style);
					const variants = variantMap.get(family)!;
					// One entry per weight value — keep the first style name encountered
					if (!variants.some((v) => v.weight === weight)) {
						variants.push({ label: style, weight });
					}
				}

				// Sort families alphabetically, sort each family's variants by weight
				const families = [...familySet].sort((a, b) => a.localeCompare(b));
				for (const variants of variantMap.values()) {
					variants.sort((a, b) => {
						const wa = parseInt(a.weight) || (a.weight === "bold" ? 700 : 400);
						const wb = parseInt(b.weight) || (b.weight === "bold" ? 700 : 400);
						return wa - wb;
					});
				}

				if (families.length > 0) return { families, variantMap };
			} catch {
				// Permission denied or API unavailable — fall through to curated list
			}
		}

		return {
			families: [
				"monospace",
				"Cascadia Code",
				"Cascadia Mono",
				"Consolas",
				"Courier New",
				"DejaVu Sans Mono",
				"Fira Code",
				"Fira Mono",
				"Hack",
				"IBM Plex Mono",
				"Inconsolata",
				"JetBrains Mono",
				"Menlo",
				"Monaco",
				"Noto Sans Mono",
				"Roboto Mono",
				"SF Mono",
				"Source Code Pro",
				"Ubuntu Mono",
			],
			variantMap: new Map(),
		};
	}
}
