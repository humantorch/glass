import { App, ButtonComponent, DropdownComponent, Notice, PluginSettingTab, Setting, SettingDefinitionItem } from "obsidian";
import * as fs from "fs";
import * as path from "path";
import type ClaudeCodePlugin from "./main";
import { QUICK_ASK_MODELS } from "./types";
import { generateClaudeMd } from "./ClaudeMdGenerator";
import { ConfirmModal } from "./ConfirmModal";

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

	constructor(app: App, plugin: ClaudeCodePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Claude binary path")
			.setDesc(
				"Path to the Claude CLI executable. Use 'Claude' if it's on your system path, or provide the full absolute path."
			)
			.addText((text) =>
				text
					.setPlaceholder("Claude")
					.setValue(this.plugin.settings.claudeBinaryPath)
					.onChange(async (value) => {
						this.plugin.settings.claudeBinaryPath = value.trim() || "claude";
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Working directory")
			.setDesc(
				"Directory Claude Code starts in. Leave blank to use vault root. Claude will have access to files in this directory."
			)
			.addText((text) =>
				text
					.setPlaceholder("(Vault root)")
					.setValue(this.plugin.settings.workingDirectory)
					.onChange(async (value) => {
						this.plugin.settings.workingDirectory = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Quick ask model")
			.setDesc("Claude model to use for the quick ask modal.")
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
			.setName("Terminal font size")
			.setDesc("Font size in pixels for the terminal panel.")
			.addText((text) =>
				text
					.setPlaceholder("14")
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
			.setName("Terminal scrollback")
			.setDesc("Number of lines to keep in the terminal's scroll history (default 5000). Takes effect the next time the terminal is opened.")
			.addText((text) =>
				text
					.setPlaceholder("5000")
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
			.setName("Terminal font family")
			.setDesc("Font family for the terminal panel. Loading fonts...");
		const weightSetting = new Setting(containerEl)
			.setName("Terminal font weight")
			.setDesc("Weight or style variant for the selected font. Loading fonts...");
		void this.buildFontDropdowns(familySetting, weightSetting);

		new Setting(containerEl)
			.setName("Terminal letter spacing")
			.setDesc("Horizontal spacing between characters in pixels (0-3, default 0). Adds breathing room for cramped fonts.")
			.addText((text) =>
				text
					.setPlaceholder("0")
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
			.setName("Terminal line height")
			.setDesc("Vertical spacing multiplier for lines (1.0-1.4, default 1.0). Adds vertical breathing room.")
			.addText((text) =>
				text
					.setPlaceholder("1")
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
			.setName("Open Claude panel on startup")
			.setDesc(
				"Automatically open the Claude Code terminal when Obsidian starts."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoOpenOnStartup)
					.onChange(async (value) => {
						this.plugin.settings.autoOpenOnStartup = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Resume last Claude session")
			.setDesc(
				"Pass --continue when starting a new session to resume the previous conversation context."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.resumeLastSession)
					.onChange(async (value) => {
						this.plugin.settings.resumeLastSession = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Skip permission prompts")
			.setDesc(
				"Pass --dangerously-skip-permissions to Claude Code. " +
				"Claude will execute tool calls without asking for confirmation. " +
				"Only enable this if you trust the tasks you are running."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.skipPermissions)
					.onChange(async (value) => {
						this.plugin.settings.skipPermissions = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl).setName("Vault MCP server").setHeading();

		new Setting(containerEl)
			.setName("Enable vault MCP server")
			.setDesc(
				"Starts a local MCP server that gives Claude vault-aware tools (read, search, create, update notes). " +
				"Registers automatically in .mcp.json in the vault root."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.mcpServerEnabled)
					.onChange(async (value) => {
						this.plugin.settings.mcpServerEnabled = value;
						await this.plugin.saveSettings();
						if (value) {
							await this.plugin.startVaultMcpServer();
							new Notice("Vault MCP server started. Start a new session for Claude to pick it up.");
						} else {
							this.plugin.stopVaultMcpServer();
							new Notice("Vault MCP server stopped. Start a new session for the change to take effect in Claude.");
						}
					})
			);

		new Setting(containerEl)
			.setName("Read-only vault access")
			.setDesc(
				"When enabled, Claude can read and search notes but cannot create or update them. " +
				"Takes effect the next time the MCP server starts."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.mcpReadOnly)
					.onChange(async (value) => {
						this.plugin.settings.mcpReadOnly = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("MCP server port")
			.setDesc(
				"Port the vault MCP server listens on (default 27123). If the port is in use, the next available port up to +4 is used automatically. Restart the plugin after changing."
			)
			.addText((text) =>
				text
					.setPlaceholder("27123")
					.setValue(String(this.plugin.settings.mcpServerPort))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						if (!isNaN(parsed) && parsed > 1023 && parsed < 65536) {
							this.plugin.settings.mcpServerPort = parsed;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl).setName("Vault context").setHeading();

		new Setting(containerEl)
			.setName("Generate CLAUDE.md")
			.setDesc(
				"Creates a CLAUDE.md file at your vault root summarizing its structure and tags — Claude Code " +
				"loads this automatically at the start of every session. Safe to run again anytime; if a CLAUDE.md " +
				"already exists, you'll be asked to confirm, and the current one is saved as CLAUDE.bak.md before " +
				"it's replaced."
			)
			.addButton((button) => this.wireGenerateClaudeMdButton(button));
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				type: "group",
				items: [
					{
						name: "Claude binary path",
						desc: "Path to the Claude CLI executable. Use 'Claude' if it's on your system path, or provide the full absolute path.",
						control: { type: "text", key: "claudeBinaryPath", placeholder: "Claude" },
					},
					{
						name: "Working directory",
						desc: "Directory Claude Code starts in. Leave blank to use vault root. Claude will have access to files in this directory.",
						control: { type: "text", key: "workingDirectory", placeholder: "(Vault root)" },
					},
					{
						name: "Quick ask model",
						desc: "Claude model to use for the quick ask modal.",
						control: { type: "dropdown", key: "quickAskModel", options: Object.fromEntries(QUICK_ASK_MODELS) },
					},
					{
						name: "Terminal font size",
						desc: "Font size in pixels for the terminal panel.",
						control: {
							type: "number",
							key: "fontSize",
							placeholder: "14",
							min: 1,
							step: 1,
							validate: (value) => (value > 0 ? undefined : "Must be greater than 0."),
						},
					},
					{
						name: "Terminal scrollback",
						desc: "Number of lines to keep in the terminal's scroll history (default 5000). Takes effect the next time the terminal is opened.",
						control: {
							type: "number",
							key: "scrollback",
							placeholder: "5000",
							min: 100,
							max: 100000,
							step: 1,
							validate: (value) => (value >= 100 && value <= 100000 ? undefined : "Must be between 100 and 100000."),
						},
					},
					{
						name: "Terminal font family",
						desc: "Font family for the terminal panel.",
						render: (setting, group) => {
							setting.setDesc("Font family for the terminal panel. Loading fonts...");
							let weightSetting: Setting | undefined;
							// SettingGroup.addSetting needs 1.11.0, but this render callback is only ever invoked
							// by hosts new enough to call getSettingDefinitions() in the first place (1.13.0+),
							// so it's unreachable on older Obsidian versions despite the manifest's 1.7.7 floor.
							// eslint-disable-next-line obsidianmd/no-unsupported-api
							group.addSetting((s) => {
								s.setName("Terminal font weight").setDesc(
									"Weight or style variant for the selected font. Loading fonts..."
								);
								weightSetting = s;
							});
							void this.buildFontDropdowns(setting, weightSetting as Setting);
						},
					},
					{
						name: "Terminal letter spacing",
						desc: "Horizontal spacing between characters in pixels (0-3, default 0). Adds breathing room for cramped fonts.",
						control: {
							type: "number",
							key: "letterSpacing",
							placeholder: "0",
							min: 0,
							max: 3,
							step: 0.1,
							validate: (value) => (value >= 0 && value <= 3 ? undefined : "Must be between 0 and 3."),
						},
					},
					{
						name: "Terminal line height",
						desc: "Vertical spacing multiplier for lines (1.0-1.4, default 1.0). Adds vertical breathing room.",
						control: {
							type: "number",
							key: "lineHeight",
							placeholder: "1",
							min: 1,
							max: 1.4,
							step: 0.1,
							validate: (value) => (value >= 1 && value <= 1.4 ? undefined : "Must be between 1.0 and 1.4."),
						},
					},
					{
						name: "Open Claude panel on startup",
						desc: "Automatically open the Claude Code terminal when Obsidian starts.",
						control: { type: "toggle", key: "autoOpenOnStartup" },
					},
					{
						name: "Resume last Claude session",
						desc: "Pass --continue when starting a new session to resume the previous conversation context.",
						control: { type: "toggle", key: "resumeLastSession" },
					},
					{
						name: "Skip permission prompts",
						desc:
							"Pass --dangerously-skip-permissions to Claude Code. Claude will execute tool calls without " +
							"asking for confirmation. Only enable this if you trust the tasks you are running.",
						control: { type: "toggle", key: "skipPermissions" },
					},
				],
			},
			{
				type: "group",
				heading: "Vault MCP server",
				items: [
					{
						name: "Enable vault MCP server",
						desc:
							"Starts a local MCP server that gives Claude vault-aware tools (read, search, create, update notes). " +
							"Registers automatically in .mcp.json in the vault root.",
						control: { type: "toggle", key: "mcpServerEnabled" },
					},
					{
						name: "Read-only vault access",
						desc:
							"When enabled, Claude can read and search notes but cannot create or update them. " +
							"Takes effect the next time the MCP server starts.",
						control: { type: "toggle", key: "mcpReadOnly" },
					},
					{
						name: "MCP server port",
						desc:
							"Port the vault MCP server listens on (default 27123). If the port is in use, the next " +
							"available port up to +4 is used automatically. Restart the plugin after changing.",
						control: {
							type: "number",
							key: "mcpServerPort",
							placeholder: "27123",
							min: 1024,
							max: 65535,
							step: 1,
							validate: (value) => (value > 1023 && value < 65536 ? undefined : "Must be between 1024 and 65535."),
						},
					},
				],
			},
			{
				type: "group",
				heading: "Vault context",
				items: [
					{
						name: "Generate CLAUDE.md",
						desc:
							"Creates a CLAUDE.md file at your vault root summarizing its structure and tags — Claude Code " +
							"loads this automatically at the start of every session. Safe to run again anytime; if a CLAUDE.md " +
							"already exists, you'll be asked to confirm, and the current one is saved as CLAUDE.bak.md before " +
							"it's replaced.",
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
					new Notice("Vault MCP server started. Start a new session for Claude to pick it up.");
				} else {
					this.plugin.stopVaultMcpServer();
					new Notice("Vault MCP server stopped. Start a new session for the change to take effect in Claude.");
				}
				return;
			}
			default:
				return;
		}
		await this.plugin.saveSettings();
	}

	private wireGenerateClaudeMdButton(button: ButtonComponent): void {
		button.setButtonText("Generate CLAUDE.md").onClick(() => {
			const vaultRoot = this.plugin.contextBuilder.getVaultRoot();
			const claudeMdPath = vaultRoot ? path.join(vaultRoot, "CLAUDE.md") : "";
			if (claudeMdPath && fs.existsSync(claudeMdPath)) {
				new ConfirmModal(
					this.app,
					"Overwrite CLAUDE.md?",
					"A CLAUDE.md already exists at your vault root. The current one will be saved as " +
					"CLAUDE.bak.md (overwriting any previous backup) before the new one is written.",
					() => this.runGenerateClaudeMd(button)
				).open();
			} else {
				void this.runGenerateClaudeMd(button);
			}
		});
	}

	private async runGenerateClaudeMd(button: ButtonComponent): Promise<void> {
		button.setDisabled(true);
		button.setButtonText("Generating...");
		const result = await generateClaudeMd(this.plugin);
		button.setDisabled(false);
		button.setButtonText("Generate CLAUDE.md");
		if (result.success) {
			new Notice("CLAUDE.md created at your vault root.");
		} else {
			new Notice(`Failed to generate CLAUDE.md: ${result.error}`);
		}
	}

	private async buildFontDropdowns(familySetting: Setting, weightSetting: Setting): Promise<void> {
		const { families, variantMap } = await this.getFontData();
		this.fontVariantMap = variantMap;

		let variantDropdown: DropdownComponent | null = null;

		familySetting.setDesc("Font family for the terminal panel.");
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

		weightSetting.setDesc("Weight or style variant for the selected font.");
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
			dd.addOption("normal", "Normal");
			dd.addOption("300", "Light (300)");
			dd.addOption("500", "Medium (500)");
			dd.addOption("600", "SemiBold (600)");
			dd.addOption("bold", "Bold");
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
