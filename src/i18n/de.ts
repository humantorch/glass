// German (de). Machine-translated draft — see src/i18n/README.md.
export const de = {
	settings: {
		claudeBinaryPath: {
			name: "Claude-Binärpfad",
			desc: "Pfad zur ausführbaren Claude-CLI-Datei. Verwenden Sie 'claude', wenn sie sich in Ihrem Systempfad befindet, oder geben Sie den vollständigen absoluten Pfad an.",
			placeholder: "claude",
		},
		workingDirectory: {
			name: "Arbeitsverzeichnis",
			desc: "Verzeichnis, in dem Claude Code startet. Leer lassen, um das Vault-Stammverzeichnis zu verwenden. Claude hat Zugriff auf Dateien in diesem Verzeichnis.",
			placeholder: "(Vault-Stammverzeichnis)",
		},
		quickAskModel: {
			name: "Modell für Schnellfrage",
			desc: "Claude-Modell, das für das Schnellfrage-Fenster verwendet wird.",
			defaultOption: "Standard",
		},
		fontSize: {
			name: "Terminal-Schriftgröße",
			desc: "Schriftgröße in Pixeln für das Terminal-Panel.",
			placeholder: "14",
		},
		scrollback: {
			name: "Terminal-Scrollback",
			desc: "Anzahl der Zeilen, die im Scrollverlauf des Terminals aufbewahrt werden (Standard 5000). Wird erst beim nächsten Öffnen des Terminals wirksam.",
			placeholder: "5000",
		},
		fontFamily: {
			name: "Terminal-Schriftart",
			desc: "Schriftart für das Terminal-Panel.",
			descLoading: "Schriftart für das Terminal-Panel. Schriften werden geladen...",
		},
		fontWeight: {
			name: "Terminal-Schriftstärke",
			desc: "Stärke oder Stilvariante der ausgewählten Schriftart.",
			descLoading: "Stärke oder Stilvariante der ausgewählten Schriftart. Schriften werden geladen...",
		},
		fontWeightFallbackOptions: {
			normal: "Normal",
			light: "Light (300)",
			medium: "Medium (500)",
			semibold: "SemiBold (600)",
			bold: "Bold",
		},
		letterSpacing: {
			name: "Zeichenabstand im Terminal",
			desc: "Horizontaler Abstand zwischen Zeichen in Pixeln (0-3, Standard 0). Schafft mehr Freiraum bei eng gesetzten Schriftarten.",
			placeholder: "0",
		},
		lineHeight: {
			name: "Zeilenhöhe im Terminal",
			desc: "Multiplikator für den vertikalen Zeilenabstand (1,0-1,4, Standard 1,0). Schafft mehr vertikalen Freiraum.",
			placeholder: "1",
		},
		autoOpenOnStartup: {
			name: "Claude-Panel beim Start öffnen",
			desc: "Öffnet das Claude-Code-Terminal automatisch beim Start von Obsidian.",
		},
		resumeLastSession: {
			name: "Letzte Claude-Sitzung fortsetzen",
			desc: "Übergibt --continue beim Start einer neuen Sitzung, um den vorherigen Gesprächskontext fortzusetzen.",
		},
		skipPermissions: {
			name: "Berechtigungsabfragen überspringen",
			desc:
				"Übergibt --dangerously-skip-permissions an Claude Code. Claude führt Tool-Aufrufe aus, ohne " +
				"vorher um Bestätigung zu bitten. Nur aktivieren, wenn Sie den ausgeführten Aufgaben vertrauen.",
		},
		mcpServerHeading: "Vault-MCP-Server",
		mcpServerEnabled: {
			name: "Vault-MCP-Server aktivieren",
			desc:
				"Startet einen lokalen MCP-Server, der Claude vault-bewusste Tools bereitstellt (Notizen lesen, durchsuchen, erstellen, aktualisieren). " +
				"Registriert sich automatisch in der .mcp.json im Vault-Stammverzeichnis.",
		},
		mcpReadOnly: {
			name: "Nur-Lese-Zugriff auf den Vault",
			desc:
				"Wenn aktiviert, kann Claude Notizen lesen und durchsuchen, aber keine erstellen oder aktualisieren. " +
				"Wird erst beim nächsten Start des MCP-Servers wirksam.",
		},
		mcpServerPort: {
			name: "MCP-Server-Port",
			desc:
				"Port, auf dem der Vault-MCP-Server lauscht (Standard 27123). Ist der Port belegt, wird automatisch " +
				"der nächste verfügbare Port bis +4 verwendet. Plugin nach Änderung neu starten.",
			placeholder: "27123",
		},
		vaultContextHeading: "Vault-Kontext",
		generateClaudeMd: {
			name: "CLAUDE.md generieren",
			desc:
				"Erstellt eine CLAUDE.md-Datei im Vault-Stammverzeichnis, die dessen Struktur und Tags zusammenfasst — Claude Code " +
				"lädt diese automatisch zu Beginn jeder Sitzung. Kann jederzeit erneut ausgeführt werden; falls bereits eine CLAUDE.md " +
				"existiert, werden Sie um Bestätigung gebeten, und die aktuelle Datei wird vor dem Ersetzen als CLAUDE.bak.md " +
				"gesichert.",
			button: "CLAUDE.md generieren",
			buttonGenerating: "Wird generiert...",
		},
		validation: {
			mustBeGreaterThanZero: "Muss größer als 0 sein.",
			mustBeBetween100And100000: "Muss zwischen 100 und 100000 liegen.",
			mustBeBetween0And3: "Muss zwischen 0 und 3 liegen.",
			mustBeBetween1And1_4: "Muss zwischen 1,0 und 1,4 liegen.",
			mustBeBetween1024And65535: "Muss zwischen 1024 und 65535 liegen.",
		},
	},
	commands: {
		openTerminal: "Claude-Code-Terminal öffnen",
		quickAsk: "Claude fragen (schnell)",
		askAboutNote: "Claude zu dieser Notiz fragen",
		askAboutSelection: "Claude zur Auswahl fragen",
		insertNoteReference: "Notizverweis in Terminal einfügen",
		newSession: "Neue Claude-Code-Sitzung starten",
	},
	ribbon: {
		tooltip: "Claude Code öffnen",
	},
	contextMenu: {
		askAboutThis: "Claude dazu fragen",
	},
	notices: {
		noActiveNote: "Keine aktive Notiz.",
		noTextSelected: "Kein Text ausgewählt.",
		openTerminalFirst: "Bitte zuerst das Claude-Code-Terminal öffnen.",
		newVersionAvailable: (version: string) =>
			`Glass ${version} ist verfügbar. Klicken Sie auf die Version in der Symbolleiste, um zu aktualisieren.`,
		mcpServerStarted: "Vault-MCP-Server gestartet. Für Claude wird eine neue Sitzung benötigt, damit die Änderung wirksam wird.",
		mcpServerStopped: "Vault-MCP-Server gestoppt. Für Claude wird eine neue Sitzung benötigt, damit die Änderung wirksam wird.",
		claudeMdCreated: "CLAUDE.md wurde im Vault-Stammverzeichnis erstellt.",
		claudeMdGenerationFailed: (error: string | undefined) => `Generierung von CLAUDE.md fehlgeschlagen: ${error}`,
		noActiveSession: "Keine aktive Claude-Code-Sitzung.",
	},
	modals: {
		quickAsk: {
			title: "Claude fragen",
			contextLabel: "Kontext:",
			promptPlaceholder: "Fragen Sie Claude etwas...",
			askButton: "Claude fragen",
			asking: "Wird gefragt...",
			stopButton: "Stopp",
			modelLabel: "Modell:",
			copyButton: "Antwort kopieren",
			copied: "Kopiert!",
			promptRequired: "Bitte geben Sie einen Prompt ein.",
			copiedToClipboard: "Antwort in die Zwischenablage kopiert.",
			copyFailed: "Kopieren in die Zwischenablage fehlgeschlagen.",
			errorPrefix: (error: string) => `Fehler: ${error}`,
		},
		claudeMdOnboarding: {
			title: "Vault-Kontext für Claude einrichten?",
			body:
				"Glass kann eine CLAUDE.md-Datei erstellen, die Struktur und Tags dieses Vaults zusammenfasst. Claude Code " +
				"lädt diese automatisch zu Beginn jeder Sitzung, sodass es Ihren Vault versteht, ohne dass Sie es jedes Mal " +
				"erklären müssen. Sie können die Datei anschließend überprüfen und bearbeiten und sie jederzeit über " +
				"Einstellungen → Glass neu generieren.",
			generateButton: "CLAUDE.md generieren",
			notNowButton: "Jetzt nicht",
			generating: "CLAUDE.md wird generiert — das kann einen Moment dauern...",
			done: "Fertig. CLAUDE.md wurde im Vault-Stammverzeichnis erstellt.",
			doneNotice: "CLAUDE.md erstellt. Claude verwendet sie ab der nächsten Sitzung.",
			failed: (error: string | undefined) => `Fehlgeschlagen: ${error}`,
		},
		confirmClaudeMdOverwrite: {
			title: "CLAUDE.md überschreiben?",
			body:
				"Im Vault-Stammverzeichnis existiert bereits eine CLAUDE.md. Die aktuelle Datei wird vor dem Schreiben der " +
				"neuen als CLAUDE.bak.md gesichert (ein vorheriges Backup wird dabei überschrieben).",
		},
		confirm: {
			continueButton: "Fortfahren",
			cancelButton: "Abbrechen",
		},
	},
	terminal: {
		filePicker: {
			placeholder: "Notizen durchsuchen...",
		},
		viewDisplayText: "Claude Code",
		wordmark: "GLASS",
		byline: "by Blackglass",
		toolbar: {
			newSession: "Neue Sitzung",
			newSessionTooltip: "Eine neue Claude-Code-Sitzung starten",
			clear: "Leeren",
			clearTooltip: "Terminal-Ausgabe leeren, ohne die Sitzung zu beenden",
			insertReference: "@",
			insertReferenceTooltip: "Notizverweis in das Terminal einfügen (@Dateiname)",
			settingsTooltip: "Glass-Einstellungen öffnen",
		},
		status: {
			sessionLabel: "Sitzung",
			noSession: "Keine Sitzung",
			sessionStatusNoSession: "Sitzungsstatus: keine Sitzung",
			mcpLabel: "MCP",
			sessionActive: "Sitzung aktiv",
			sessionEnded: "Sitzung beendet",
			sessionStatus: (title: string) => `Sitzungsstatus: ${title.toLowerCase()}`,
			updateAvailable: (version: string) => `Glass ${version} ist verfügbar — klicken zum Aktualisieren`,
			mcpRunning: (port: number) => `Vault-MCP-Server läuft auf Port ${port}`,
			mcpFailed: "Vault-MCP-Server konnte nicht gestartet werden",
			mcpDisabled: "Vault-MCP-Server deaktiviert",
		},
		banners: {
			failedToStart: (message: string) => `\r\n\x1b[31mStart von Claude Code fehlgeschlagen: ${message}\x1b[0m`,
			windowsSetupHeading: `\r\n\x1b[33mEinrichtungsschritte:\x1b[0m`,
			windowsSetupStep1: `\r\n\x1b[33m  1. Python 3 installieren: https://www.python.org/downloads/\x1b[0m`,
			windowsSetupStep2: `\r\n\x1b[33m  2. In PowerShell ausführen: pip install pywinpty\x1b[0m`,
			windowsSetupStep3: `\r\n\x1b[33m  3. Obsidian neu laden\x1b[0m`,
			checkPathWindowsPywinpty: (claudePath: string) =>
				`\r\n\x1b[33mPrüfen Sie, ob '${claudePath}' in Ihrem PATH liegt. Falls pywinpty fehlt: pip install pywinpty\x1b[0m`,
			checkPathUnixPython: (claudePath: string) =>
				`\r\n\x1b[33mPrüfen Sie, ob '${claudePath}' in Ihrem PATH liegt und Python 3 installiert ist.\x1b[0m`,
			checkPathWithHint: (claudePath: string, hint: string) =>
				`\r\n\x1b[33mPrüfen Sie, ob '${claudePath}' in Ihrem PATH liegt.${hint}\x1b[0m`,
			setupHintWindows: " Python 3 und pywinpty werden benötigt (pip install pywinpty).",
			setupHintUnix: " Prüfen Sie, ob Python 3 installiert ist.",
			noPreviousSession: `\r\n\x1b[33m[Keine vorherige Sitzung gefunden — neue Sitzung wird gestartet]\x1b[0m\r\n`,
			sessionEndedWithCode: (exitCode: number) =>
				`\r\n\x1b[90m[Claude-Code-Sitzung mit Exit-Code ${exitCode} beendet]\x1b[0m`,
		},
	},
	errors: {
		pythonNotFound: (installHint: string) => `Python 3 nicht gefunden. ${installHint}`,
		installPythonDownloadLink: "Python 3 installieren: https://www.python.org/downloads/",
		installPythonHomebrew: "Über Homebrew installieren: brew install python3",
		requestTimedOut: (seconds: number) => `Zeitüberschreitung nach ${seconds}s`,
		claudeExitedWithCode: (code: number | null) => `Claude wurde mit Code ${code} beendet`,
		failedToStartClaude: (message: string, hint: string) => `Start von Claude fehlgeschlagen: ${message}. ${hint}`,
		setBinaryPathHint: `Legen Sie den vollständigen Pfad unter Einstellungen → Glass → „Claude-Binärpfad" fest.`,
		setBinaryPathHintWindows: (example: string) =>
			`Legen Sie den vollständigen Pfad unter Einstellungen → Glass → „Claude-Binärpfad" fest (z. B. ${example}).`,
		isOnPathHint: (claudePath: string) => `Befindet sich '${claudePath}' in Ihrem PATH?`,
		vaultRootNotFound: "Vault-Stammverzeichnis konnte nicht ermittelt werden.",
		emptyClaudeResponse: "Claude hat eine leere Antwort zurückgegeben.",
		failedToWriteClaudeMd: (message: string) => `Schreiben von CLAUDE.md fehlgeschlagen: ${message}`,
	},
};
