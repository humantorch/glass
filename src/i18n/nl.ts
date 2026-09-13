// Dutch (nl). Machine-translated draft — see src/i18n/README.md.
export const nl = {
	settings: {
		claudeBinaryPath: {
			name: "Pad naar Claude-programma",
			desc: "Pad naar het uitvoerbare Claude-CLI-bestand. Gebruik 'claude' als dit in uw systeem-PATH staat, of geef het volledige absolute pad op.",
			placeholder: "claude",
		},
		workingDirectory: {
			name: "Werkmap",
			desc: "Map waarin Claude Code start. Laat leeg om de hoofdmap van de Vault te gebruiken. Claude heeft toegang tot bestanden in deze map.",
			placeholder: "(Hoofdmap van de Vault)",
		},
		quickAskModel: {
			name: "Model voor snelle vraag",
			desc: "Claude-model dat wordt gebruikt voor de snelle-vraagmodule.",
			defaultOption: "Standaard",
		},
		fontSize: {
			name: "Terminal-lettergrootte",
			desc: "Lettergrootte in pixels voor het terminalpaneel.",
			placeholder: "14",
		},
		scrollback: {
			name: "Terminal-scrollback",
			desc: "Aantal regels dat wordt bewaard in de scrollgeschiedenis van de terminal (standaard 5000). Wordt pas toegepast wanneer de terminal opnieuw wordt geopend.",
			placeholder: "5000",
		},
		fontFamily: {
			name: "Terminal-lettertype",
			desc: "Lettertype voor het terminalpaneel.",
			descLoading: "Lettertype voor het terminalpaneel. Lettertypen worden geladen...",
		},
		fontWeight: {
			name: "Terminal-tekengewicht",
			desc: "Gewicht of stijlvariant van het geselecteerde lettertype.",
			descLoading: "Gewicht of stijlvariant van het geselecteerde lettertype. Lettertypen worden geladen...",
		},
		fontWeightFallbackOptions: {
			normal: "Normal",
			light: "Light (300)",
			medium: "Medium (500)",
			semibold: "SemiBold (600)",
			bold: "Bold",
		},
		letterSpacing: {
			name: "Tekenafstand in terminal",
			desc: "Horizontale afstand tussen tekens in pixels (0-3, standaard 0). Geeft meer ruimte bij smal opeengepakte lettertypen.",
			placeholder: "0",
		},
		lineHeight: {
			name: "Regelhoogte in terminal",
			desc: "Vermenigvuldigingsfactor voor de verticale regelafstand (1,0-1,4, standaard 1,0). Geeft meer verticale ruimte.",
			placeholder: "1",
		},
		autoOpenOnStartup: {
			name: "Claude-paneel openen bij opstarten",
			desc: "Opent automatisch de Claude Code-terminal wanneer Obsidian start.",
		},
		resumeLastSession: {
			name: "Laatste Claude-sessie hervatten",
			desc: "Geeft --continue mee bij het starten van een nieuwe sessie om de vorige gespreksinhoud te hervatten.",
		},
		skipPermissions: {
			name: "Toestemmingsvragen overslaan",
			desc:
				"Geeft --dangerously-skip-permissions mee aan Claude Code. Claude voert tool-aanroepen uit zonder om " +
				"bevestiging te vragen. Alleen inschakelen als u de uitgevoerde taken vertrouwt.",
		},
		mcpServerHeading: "MCP-server voor de Vault",
		mcpServerEnabled: {
			name: "MCP-server voor de Vault inschakelen",
			desc:
				"Start een lokale MCP-server die Claude Vault-bewuste tools geeft (notities lezen, doorzoeken, aanmaken en bijwerken). " +
				"Registreert zichzelf automatisch in .mcp.json in de hoofdmap van de Vault.",
		},
		mcpReadOnly: {
			name: "Alleen-lezen toegang tot de Vault",
			desc:
				"Indien ingeschakeld kan Claude notities lezen en doorzoeken, maar niet aanmaken of bijwerken. " +
				"Wordt pas toegepast wanneer de MCP-server opnieuw start.",
		},
		mcpServerPort: {
			name: "Poort van de MCP-server",
			desc:
				"Poort waarop de MCP-server van de Vault luistert (standaard 27123). Als de poort in gebruik is, wordt " +
				"automatisch de eerstvolgende beschikbare poort tot +4 gebruikt. Herstart de plugin na het wijzigen.",
			placeholder: "27123",
		},
		vaultContextHeading: "Vault-context",
		generateClaudeMd: {
			name: "CLAUDE.md genereren",
			desc:
				"Maakt een CLAUDE.md-bestand aan in de hoofdmap van de Vault met een samenvatting van de structuur en " +
				"tags — Claude Code laadt dit automatisch bij het begin van elke sessie. Kan op elk moment opnieuw " +
				"worden uitgevoerd; als er al een CLAUDE.md bestaat, wordt om bevestiging gevraagd en wordt het " +
				"huidige bestand opgeslagen als CLAUDE.bak.md voordat het wordt vervangen.",
			button: "CLAUDE.md genereren",
			buttonGenerating: "Bezig met genereren...",
		},
		validation: {
			mustBeGreaterThanZero: "Moet groter zijn dan 0.",
			mustBeBetween100And100000: "Moet tussen 100 en 100000 liggen.",
			mustBeBetween0And3: "Moet tussen 0 en 3 liggen.",
			mustBeBetween1And1_4: "Moet tussen 1,0 en 1,4 liggen.",
			mustBeBetween1024And65535: "Moet tussen 1024 en 65535 liggen.",
		},
	},
	commands: {
		openTerminal: "Claude Code-terminal openen",
		quickAsk: "Claude vragen (snel)",
		askAboutNote: "Claude vragen over deze notitie",
		askAboutSelection: "Claude vragen over de selectie",
		insertNoteReference: "Notitieverwijzing invoegen in terminal",
		newSession: "Nieuwe Claude Code-sessie starten",
	},
	ribbon: {
		tooltip: "Claude Code openen",
	},
	contextMenu: {
		askAboutThis: "Claude hierover vragen",
	},
	notices: {
		noActiveNote: "Geen actieve notitie.",
		noTextSelected: "Geen tekst geselecteerd.",
		openTerminalFirst: "Open eerst de Claude Code-terminal.",
		newVersionAvailable: (version: string) =>
			`Glass ${version} is beschikbaar. Klik op de versie in de werkbalk om bij te werken.`,
		mcpServerStarted: "MCP-server voor de Vault gestart. Start een nieuwe sessie zodat Claude dit oppikt.",
		mcpServerStopped: "MCP-server voor de Vault gestopt. Start een nieuwe sessie zodat de wijziging van kracht wordt voor Claude.",
		claudeMdCreated: "CLAUDE.md aangemaakt in de hoofdmap van de Vault.",
		claudeMdGenerationFailed: (error: string | undefined) => `Genereren van CLAUDE.md mislukt: ${error}`,
		noActiveSession: "Geen actieve Claude Code-sessie.",
	},
	modals: {
		quickAsk: {
			title: "Claude vragen",
			contextLabel: "Context:",
			promptPlaceholder: "Vraag Claude iets...",
			askButton: "Claude vragen",
			asking: "Bezig met vragen...",
			stopButton: "Stoppen",
			modelLabel: "Model:",
			copyButton: "Antwoord kopiëren",
			copied: "Gekopieerd!",
			promptRequired: "Voer een prompt in.",
			copiedToClipboard: "Antwoord gekopieerd naar het klembord.",
			copyFailed: "Kopiëren naar klembord mislukt.",
			errorPrefix: (error: string) => `Fout: ${error}`,
		},
		claudeMdOnboarding: {
			title: "Vault-context voor Claude instellen?",
			body:
				"Glass kan een CLAUDE.md-bestand genereren met een samenvatting van de structuur en tags van deze " +
				"Vault. Claude Code laadt dit automatisch bij het begin van elke sessie, zodat het uw Vault begrijpt " +
				"zonder dat u het steeds hoeft uit te leggen. U kunt het bestand achteraf bekijken en bewerken, en " +
				"het op elk moment opnieuw genereren via Instellingen → Glass.",
			generateButton: "CLAUDE.md genereren",
			notNowButton: "Niet nu",
			generating: "CLAUDE.md wordt gegenereerd — dit kan even duren...",
			done: "Klaar. CLAUDE.md aangemaakt in de hoofdmap van de Vault.",
			doneNotice: "CLAUDE.md aangemaakt. Claude gebruikt dit vanaf de volgende sessie.",
			failed: (error: string | undefined) => `Mislukt: ${error}`,
		},
		confirmClaudeMdOverwrite: {
			title: "CLAUDE.md overschrijven?",
			body:
				"Er bestaat al een CLAUDE.md in de hoofdmap van de Vault. Het huidige bestand wordt opgeslagen als " +
				"CLAUDE.bak.md (een eerdere back-up wordt daarbij overschreven) voordat het nieuwe bestand wordt geschreven.",
		},
		confirm: {
			continueButton: "Doorgaan",
			cancelButton: "Annuleren",
		},
	},
	terminal: {
		filePicker: {
			placeholder: "Zoeken naar notities...",
		},
		viewDisplayText: "Claude Code",
		wordmark: "GLASS",
		byline: "by Blackglass",
		toolbar: {
			newSession: "Nieuwe sessie",
			newSessionTooltip: "Een nieuwe Claude Code-sessie starten",
			clear: "Wissen",
			clearTooltip: "Terminaluitvoer wissen zonder de sessie te beëindigen",
			insertReference: "@",
			insertReferenceTooltip: "Notitieverwijzing invoegen in de terminal (@bestandsnaam)",
			settingsTooltip: "Glass-instellingen openen",
		},
		status: {
			sessionLabel: "sessie",
			noSession: "Geen sessie",
			sessionStatusNoSession: "Sessiestatus: geen sessie",
			mcpLabel: "MCP",
			sessionActive: "Sessie actief",
			sessionEnded: "Sessie beëindigd",
			sessionStatus: (title: string) => `Sessiestatus: ${title.toLowerCase()}`,
			updateAvailable: (version: string) => `Glass ${version} is beschikbaar — klik om bij te werken`,
			mcpRunning: (port: number) => `MCP-server voor de Vault actief op poort ${port}`,
			mcpFailed: "MCP-server voor de Vault kon niet worden gestart",
			mcpDisabled: "MCP-server voor de Vault uitgeschakeld",
		},
		banners: {
			failedToStart: (message: string) => `\r\n\x1b[31mStarten van Claude Code mislukt: ${message}\x1b[0m`,
			windowsSetupHeading: `\r\n\x1b[33mInstallatiestappen:\x1b[0m`,
			windowsSetupStep1: `\r\n\x1b[33m  1. Installeer Python 3: https://www.python.org/downloads/\x1b[0m`,
			windowsSetupStep2: `\r\n\x1b[33m  2. Voer uit in PowerShell: pip install pywinpty\x1b[0m`,
			windowsSetupStep3: `\r\n\x1b[33m  3. Herlaad Obsidian\x1b[0m`,
			checkPathWindowsPywinpty: (claudePath: string) =>
				`\r\n\x1b[33mControleer of '${claudePath}' zich in uw PATH bevindt. Als pywinpty ontbreekt: pip install pywinpty\x1b[0m`,
			checkPathUnixPython: (claudePath: string) =>
				`\r\n\x1b[33mControleer of '${claudePath}' zich in uw PATH bevindt en of Python 3 is geïnstalleerd.\x1b[0m`,
			checkPathWithHint: (claudePath: string, hint: string) =>
				`\r\n\x1b[33mControleer of '${claudePath}' zich in uw PATH bevindt.${hint}\x1b[0m`,
			setupHintWindows: " Python 3 en pywinpty zijn vereist (pip install pywinpty).",
			setupHintUnix: " Controleer of Python 3 is geïnstalleerd.",
			noPreviousSession: `\r\n\x1b[33m[Geen eerdere sessie gevonden — nieuwe sessie wordt gestart]\x1b[0m\r\n`,
			sessionEndedWithCode: (exitCode: number) =>
				`\r\n\x1b[90m[Claude Code-sessie beëindigd met afsluitcode ${exitCode}]\x1b[0m`,
		},
	},
	errors: {
		pythonNotFound: (installHint: string) => `Python 3 niet gevonden. ${installHint}`,
		installPythonDownloadLink: "Installeer Python 3 via https://www.python.org/downloads/",
		installPythonHomebrew: "Installeer het via Homebrew: brew install python3",
		requestTimedOut: (seconds: number) => `Time-out na ${seconds}s`,
		claudeExitedWithCode: (code: number | null) => `Claude is afgesloten met code ${code}`,
		failedToStartClaude: (message: string, hint: string) => `Starten van Claude mislukt: ${message}. ${hint}`,
		setBinaryPathHint: `Stel het volledige pad in bij Instellingen → Glass → 'Pad naar Claude-programma'.`,
		setBinaryPathHintWindows: (example: string) =>
			`Stel het volledige pad in bij Instellingen → Glass → 'Pad naar Claude-programma' (bijv. ${example}).`,
		isOnPathHint: (claudePath: string) => `Staat '${claudePath}' in uw PATH?`,
		vaultRootNotFound: "Kon de hoofdmap van de Vault niet bepalen.",
		emptyClaudeResponse: "Claude gaf een leeg antwoord terug.",
		failedToWriteClaudeMd: (message: string) => `Schrijven van CLAUDE.md mislukt: ${message}`,
	},
};
