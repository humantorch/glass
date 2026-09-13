// French (fr). Machine-translated draft — see src/i18n/README.md.
export const fr = {
	settings: {
		claudeBinaryPath: {
			name: "Chemin du binaire Claude",
			desc: "Chemin vers l'exécutable de la CLI Claude. Utilisez 'claude' s'il se trouve dans votre PATH système, ou indiquez le chemin absolu complet.",
			placeholder: "claude",
		},
		workingDirectory: {
			name: "Répertoire de travail",
			desc: "Répertoire dans lequel Claude Code démarre. Laissez vide pour utiliser la racine du Vault. Claude aura accès aux fichiers de ce répertoire.",
			placeholder: "(Racine du Vault)",
		},
		quickAskModel: {
			name: "Modèle pour la question rapide",
			desc: "Modèle Claude utilisé pour la fenêtre de question rapide.",
			defaultOption: "Par défaut",
		},
		fontSize: {
			name: "Taille de police du terminal",
			desc: "Taille de police en pixels pour le panneau du terminal.",
			placeholder: "14",
		},
		scrollback: {
			name: "Historique de défilement du terminal",
			desc: "Nombre de lignes conservées dans l'historique de défilement du terminal (par défaut 5000). Prend effet la prochaine fois que le terminal est ouvert.",
			placeholder: "5000",
		},
		fontFamily: {
			name: "Police du terminal",
			desc: "Police utilisée pour le panneau du terminal.",
			descLoading: "Police utilisée pour le panneau du terminal. Chargement des polices...",
		},
		fontWeight: {
			name: "Graisse de police du terminal",
			desc: "Graisse ou variante de style de la police sélectionnée.",
			descLoading: "Graisse ou variante de style de la police sélectionnée. Chargement des polices...",
		},
		fontWeightFallbackOptions: {
			normal: "Normal",
			light: "Light (300)",
			medium: "Medium (500)",
			semibold: "SemiBold (600)",
			bold: "Bold",
		},
		letterSpacing: {
			name: "Espacement des caractères du terminal",
			desc: "Espacement horizontal entre les caractères en pixels (0-3, par défaut 0). Ajoute de l'espace pour les polices serrées.",
			placeholder: "0",
		},
		lineHeight: {
			name: "Hauteur de ligne du terminal",
			desc: "Multiplicateur de l'espacement vertical des lignes (1,0-1,4, par défaut 1,0). Ajoute de l'espace vertical.",
			placeholder: "1",
		},
		autoOpenOnStartup: {
			name: "Ouvrir le panneau Claude au démarrage",
			desc: "Ouvre automatiquement le terminal Claude Code au démarrage d'Obsidian.",
		},
		resumeLastSession: {
			name: "Reprendre la dernière session Claude",
			desc: "Transmet --continue au démarrage d'une nouvelle session afin de reprendre le contexte de la conversation précédente.",
		},
		skipPermissions: {
			name: "Ignorer les demandes d'autorisation",
			desc:
				"Transmet --dangerously-skip-permissions à Claude Code. Claude exécutera les appels d'outils sans " +
				"demander de confirmation. N'activez cette option que si vous faites confiance aux tâches exécutées.",
		},
		mcpServerHeading: "Serveur MCP du Vault",
		mcpServerEnabled: {
			name: "Activer le serveur MCP du Vault",
			desc:
				"Démarre un serveur MCP local qui fournit à Claude des outils tenant compte du Vault (lecture, recherche, création et mise à jour de notes). " +
				"S'enregistre automatiquement dans .mcp.json à la racine du Vault.",
		},
		mcpReadOnly: {
			name: "Accès en lecture seule au Vault",
			desc:
				"Lorsque cette option est activée, Claude peut lire et rechercher des notes, mais ne peut pas en créer " +
				"ni en mettre à jour. Prend effet au prochain démarrage du serveur MCP.",
		},
		mcpServerPort: {
			name: "Port du serveur MCP",
			desc:
				"Port sur lequel écoute le serveur MCP du Vault (par défaut 27123). Si le port est déjà utilisé, le " +
				"prochain port disponible jusqu'à +4 est utilisé automatiquement. Redémarrez le plugin après modification.",
			placeholder: "27123",
		},
		vaultContextHeading: "Contexte du Vault",
		generateClaudeMd: {
			name: "Générer CLAUDE.md",
			desc:
				"Crée un fichier CLAUDE.md à la racine du Vault résumant sa structure et ses tags — Claude Code le " +
				"charge automatiquement au début de chaque session. Peut être relancé à tout moment ; si un fichier " +
				"CLAUDE.md existe déjà, une confirmation vous sera demandée, et le fichier actuel sera enregistré " +
				"sous CLAUDE.bak.md avant d'être remplacé.",
			button: "Générer CLAUDE.md",
			buttonGenerating: "Génération en cours...",
		},
		validation: {
			mustBeGreaterThanZero: "Doit être supérieur à 0.",
			mustBeBetween100And100000: "Doit être compris entre 100 et 100000.",
			mustBeBetween0And3: "Doit être compris entre 0 et 3.",
			mustBeBetween1And1_4: "Doit être compris entre 1,0 et 1,4.",
			mustBeBetween1024And65535: "Doit être compris entre 1024 et 65535.",
		},
	},
	commands: {
		openTerminal: "Ouvrir le terminal Claude Code",
		quickAsk: "Interroger Claude (rapide)",
		askAboutNote: "Interroger Claude à propos de cette note",
		askAboutSelection: "Interroger Claude à propos de la sélection",
		insertNoteReference: "Insérer une référence de note dans le terminal",
		newSession: "Démarrer une nouvelle session Claude Code",
	},
	ribbon: {
		tooltip: "Ouvrir Claude Code",
	},
	contextMenu: {
		askAboutThis: "Interroger Claude à ce sujet",
	},
	notices: {
		noActiveNote: "Aucune note active.",
		noTextSelected: "Aucun texte sélectionné.",
		openTerminalFirst: "Ouvrez d'abord le terminal Claude Code.",
		newVersionAvailable: (version: string) =>
			`Glass ${version} est disponible. Cliquez sur la version dans la barre d'outils pour mettre à jour.`,
		mcpServerStarted: "Serveur MCP du Vault démarré. Démarrez une nouvelle session pour que Claude en tienne compte.",
		mcpServerStopped: "Serveur MCP du Vault arrêté. Démarrez une nouvelle session pour que la modification prenne effet pour Claude.",
		claudeMdCreated: "CLAUDE.md créé à la racine du Vault.",
		claudeMdGenerationFailed: (error: string | undefined) => `Échec de la génération de CLAUDE.md : ${error}`,
		noActiveSession: "Aucune session Claude Code active.",
	},
	modals: {
		quickAsk: {
			title: "Interroger Claude",
			contextLabel: "Contexte :",
			promptPlaceholder: "Posez une question à Claude...",
			askButton: "Interroger Claude",
			asking: "Interrogation en cours...",
			stopButton: "Arrêter",
			modelLabel: "Modèle :",
			copyButton: "Copier la réponse",
			copied: "Copié !",
			promptRequired: "Veuillez saisir une question.",
			copiedToClipboard: "Réponse copiée dans le presse-papiers.",
			copyFailed: "Échec de la copie dans le presse-papiers.",
			errorPrefix: (error: string) => `Erreur : ${error}`,
		},
		claudeMdOnboarding: {
			title: "Configurer le contexte du Vault pour Claude ?",
			body:
				"Glass peut générer un fichier CLAUDE.md résumant la structure et les tags de ce Vault. Claude Code le " +
				"charge automatiquement au début de chaque session, afin de comprendre votre Vault sans que vous " +
				"ayez à le lui expliquer à chaque fois. Vous pouvez ensuite consulter et modifier ce fichier, et le " +
				"régénérer à tout moment depuis Paramètres → Glass.",
			generateButton: "Générer CLAUDE.md",
			notNowButton: "Pas maintenant",
			generating: "Génération de CLAUDE.md en cours — cela peut prendre un moment...",
			done: "Terminé. CLAUDE.md créé à la racine du Vault.",
			doneNotice: "CLAUDE.md créé. Claude l'utilisera dès la prochaine session.",
			failed: (error: string | undefined) => `Échec : ${error}`,
		},
		confirmClaudeMdOverwrite: {
			title: "Remplacer CLAUDE.md ?",
			body:
				"Un fichier CLAUDE.md existe déjà à la racine du Vault. Le fichier actuel sera enregistré sous " +
				"CLAUDE.bak.md (en écrasant toute sauvegarde précédente) avant l'écriture du nouveau fichier.",
		},
		confirm: {
			continueButton: "Continuer",
			cancelButton: "Annuler",
		},
	},
	terminal: {
		filePicker: {
			placeholder: "Rechercher des notes...",
		},
		viewDisplayText: "Claude Code",
		wordmark: "GLASS",
		byline: "by Blackglass",
		toolbar: {
			newSession: "Nouvelle session",
			newSessionTooltip: "Démarrer une nouvelle session Claude Code",
			clear: "Effacer",
			clearTooltip: "Effacer la sortie du terminal sans mettre fin à la session",
			insertReference: "@",
			insertReferenceTooltip: "Insérer une référence de note dans le terminal (@fichier)",
			settingsTooltip: "Ouvrir les paramètres de Glass",
		},
		status: {
			sessionLabel: "session",
			noSession: "Aucune session",
			sessionStatusNoSession: "État de la session : aucune session",
			mcpLabel: "MCP",
			sessionActive: "Session active",
			sessionEnded: "Session terminée",
			sessionStatus: (title: string) => `État de la session : ${title.toLowerCase()}`,
			updateAvailable: (version: string) => `Glass ${version} est disponible — cliquez pour mettre à jour`,
			mcpRunning: (port: number) => `Serveur MCP du Vault actif sur le port ${port}`,
			mcpFailed: "Échec du démarrage du serveur MCP du Vault",
			mcpDisabled: "Serveur MCP du Vault désactivé",
		},
		banners: {
			failedToStart: (message: string) => `\r\n\x1b[31mÉchec du démarrage de Claude Code : ${message}\x1b[0m`,
			windowsSetupHeading: `\r\n\x1b[33mÉtapes d'installation :\x1b[0m`,
			windowsSetupStep1: `\r\n\x1b[33m  1. Installez Python 3 : https://www.python.org/downloads/\x1b[0m`,
			windowsSetupStep2: `\r\n\x1b[33m  2. Exécutez dans PowerShell : pip install pywinpty\x1b[0m`,
			windowsSetupStep3: `\r\n\x1b[33m  3. Rechargez Obsidian\x1b[0m`,
			checkPathWindowsPywinpty: (claudePath: string) =>
				`\r\n\x1b[33mVérifiez que '${claudePath}' se trouve dans votre PATH. Si pywinpty est manquant : pip install pywinpty\x1b[0m`,
			checkPathUnixPython: (claudePath: string) =>
				`\r\n\x1b[33mVérifiez que '${claudePath}' se trouve dans votre PATH et que Python 3 est installé.\x1b[0m`,
			checkPathWithHint: (claudePath: string, hint: string) =>
				`\r\n\x1b[33mVérifiez que '${claudePath}' se trouve dans votre PATH.${hint}\x1b[0m`,
			setupHintWindows: " Python 3 et pywinpty sont requis (pip install pywinpty).",
			setupHintUnix: " Vérifiez que Python 3 est installé.",
			noPreviousSession: `\r\n\x1b[33m[Aucune session précédente trouvée — démarrage d'une nouvelle session]\x1b[0m\r\n`,
			sessionEndedWithCode: (exitCode: number) =>
				`\r\n\x1b[90m[Session Claude Code terminée avec le code de sortie ${exitCode}]\x1b[0m`,
		},
	},
	errors: {
		pythonNotFound: (installHint: string) => `Python 3 introuvable. ${installHint}`,
		installPythonDownloadLink: "Installez Python 3 depuis https://www.python.org/downloads/",
		installPythonHomebrew: "Installez-le via Homebrew : brew install python3",
		requestTimedOut: (seconds: number) => `Délai d'attente dépassé après ${seconds}s`,
		claudeExitedWithCode: (code: number | null) => `Claude s'est arrêté avec le code ${code}`,
		failedToStartClaude: (message: string, hint: string) => `Échec du démarrage de Claude : ${message}. ${hint}`,
		setBinaryPathHint: `Indiquez le chemin complet dans Paramètres → Glass → « Chemin du binaire Claude ».`,
		setBinaryPathHintWindows: (example: string) =>
			`Indiquez le chemin complet dans Paramètres → Glass → « Chemin du binaire Claude » (ex. ${example}).`,
		isOnPathHint: (claudePath: string) => `'${claudePath}' se trouve-t-il dans votre PATH ?`,
		vaultRootNotFound: "Impossible de déterminer la racine du Vault.",
		emptyClaudeResponse: "Claude a renvoyé une réponse vide.",
		failedToWriteClaudeMd: (message: string) => `Échec de l'écriture de CLAUDE.md : ${message}`,
	},
};
