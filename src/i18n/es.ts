// Spanish (es). Machine-translated draft — see src/i18n/README.md.
export const es = {
	settings: {
		claudeBinaryPath: {
			name: "Ruta del binario de Claude",
			desc: "Ruta al ejecutable de la CLI de Claude. Use 'claude' si está en su PATH del sistema, o indique la ruta absoluta completa.",
			placeholder: "claude",
		},
		workingDirectory: {
			name: "Directorio de trabajo",
			desc: "Directorio en el que se inicia Claude Code. Déjelo en blanco para usar la raíz del Vault. Claude tendrá acceso a los archivos de este directorio.",
			placeholder: "(Raíz del Vault)",
		},
		quickAskModel: {
			name: "Modelo para pregunta rápida",
			desc: "Modelo de Claude utilizado en la ventana de pregunta rápida.",
			defaultOption: "Predeterminado",
		},
		fontSize: {
			name: "Tamaño de fuente del terminal",
			desc: "Tamaño de fuente en píxeles para el panel de terminal.",
			placeholder: "14",
		},
		scrollback: {
			name: "Historial de desplazamiento del terminal",
			desc: "Número de líneas que se conservan en el historial de desplazamiento del terminal (predeterminado 5000). Se aplica la próxima vez que se abra el terminal.",
			placeholder: "5000",
		},
		fontFamily: {
			name: "Familia de fuente del terminal",
			desc: "Familia de fuente para el panel de terminal.",
			descLoading: "Familia de fuente para el panel de terminal. Cargando fuentes...",
		},
		fontWeight: {
			name: "Grosor de fuente del terminal",
			desc: "Grosor o variante de estilo de la fuente seleccionada.",
			descLoading: "Grosor o variante de estilo de la fuente seleccionada. Cargando fuentes...",
		},
		fontWeightFallbackOptions: {
			normal: "Normal",
			light: "Light (300)",
			medium: "Medium (500)",
			semibold: "SemiBold (600)",
			bold: "Bold",
		},
		letterSpacing: {
			name: "Espaciado entre caracteres del terminal",
			desc: "Espaciado horizontal entre caracteres en píxeles (0-3, predeterminado 0). Añade más aire en fuentes muy juntas.",
			placeholder: "0",
		},
		lineHeight: {
			name: "Altura de línea del terminal",
			desc: "Multiplicador del espaciado vertical entre líneas (1,0-1,4, predeterminado 1,0). Añade más aire vertical.",
			placeholder: "1",
		},
		autoOpenOnStartup: {
			name: "Abrir el panel de Claude al iniciar",
			desc: "Abre automáticamente el terminal de Claude Code al iniciar Obsidian.",
		},
		resumeLastSession: {
			name: "Reanudar la última sesión de Claude",
			desc: "Pasa --continue al iniciar una nueva sesión para reanudar el contexto de la conversación anterior.",
		},
		skipPermissions: {
			name: "Omitir solicitudes de permiso",
			desc:
				"Pasa --dangerously-skip-permissions a Claude Code. Claude ejecutará las llamadas a herramientas " +
				"sin pedir confirmación. Actívelo solo si confía en las tareas que está ejecutando.",
		},
		mcpServerHeading: "Servidor MCP del Vault",
		mcpServerEnabled: {
			name: "Activar servidor MCP del Vault",
			desc:
				"Inicia un servidor MCP local que proporciona a Claude herramientas conscientes del Vault (leer, buscar, crear y actualizar notas). " +
				"Se registra automáticamente en .mcp.json en la raíz del Vault.",
		},
		mcpReadOnly: {
			name: "Acceso de solo lectura al Vault",
			desc:
				"Si está activado, Claude puede leer y buscar notas, pero no crearlas ni actualizarlas. " +
				"Se aplica la próxima vez que se inicie el servidor MCP.",
		},
		mcpServerPort: {
			name: "Puerto del servidor MCP",
			desc:
				"Puerto en el que escucha el servidor MCP del Vault (predeterminado 27123). Si el puerto está en uso, " +
				"se utiliza automáticamente el siguiente puerto disponible hasta +4. Reinicie el plugin después de cambiarlo.",
			placeholder: "27123",
		},
		vaultContextHeading: "Contexto del Vault",
		generateClaudeMd: {
			name: "Generar CLAUDE.md",
			desc:
				"Crea un archivo CLAUDE.md en la raíz del Vault que resume su estructura y etiquetas — Claude Code lo " +
				"carga automáticamente al inicio de cada sesión. Se puede volver a ejecutar en cualquier momento; si ya " +
				"existe un CLAUDE.md, se le pedirá confirmación, y el archivo actual se guardará como CLAUDE.bak.md " +
				"antes de sustituirlo.",
			button: "Generar CLAUDE.md",
			buttonGenerating: "Generando...",
		},
		validation: {
			mustBeGreaterThanZero: "Debe ser mayor que 0.",
			mustBeBetween100And100000: "Debe estar entre 100 y 100000.",
			mustBeBetween0And3: "Debe estar entre 0 y 3.",
			mustBeBetween1And1_4: "Debe estar entre 1,0 y 1,4.",
			mustBeBetween1024And65535: "Debe estar entre 1024 y 65535.",
		},
	},
	commands: {
		openTerminal: "Abrir terminal de Claude Code",
		quickAsk: "Preguntar a Claude (rápido)",
		askAboutNote: "Preguntar a Claude sobre esta nota",
		askAboutSelection: "Preguntar a Claude sobre la selección",
		insertNoteReference: "Insertar referencia a nota en el terminal",
		newSession: "Iniciar nueva sesión de Claude Code",
	},
	ribbon: {
		tooltip: "Abrir Claude Code",
	},
	contextMenu: {
		askAboutThis: "Preguntar a Claude sobre esto",
	},
	notices: {
		noActiveNote: "No hay ninguna nota activa.",
		noTextSelected: "No hay texto seleccionado.",
		openTerminalFirst: "Abra primero el terminal de Claude Code.",
		newVersionAvailable: (version: string) =>
			`Glass ${version} está disponible. Haga clic en la versión de la barra de herramientas para actualizar.`,
		mcpServerStarted: "Servidor MCP del Vault iniciado. Inicie una nueva sesión para que Claude lo detecte.",
		mcpServerStopped: "Servidor MCP del Vault detenido. Inicie una nueva sesión para que el cambio surta efecto en Claude.",
		claudeMdCreated: "CLAUDE.md creado en la raíz del Vault.",
		claudeMdGenerationFailed: (error: string | undefined) => `Error al generar CLAUDE.md: ${error}`,
		noActiveSession: "No hay ninguna sesión activa de Claude Code.",
	},
	modals: {
		quickAsk: {
			title: "Preguntar a Claude",
			contextLabel: "Contexto:",
			promptPlaceholder: "Pregúntale algo a Claude...",
			askButton: "Preguntar a Claude",
			asking: "Preguntando...",
			stopButton: "Detener",
			modelLabel: "Modelo:",
			copyButton: "Copiar respuesta",
			copied: "¡Copiado!",
			promptRequired: "Introduzca una pregunta.",
			copiedToClipboard: "Respuesta copiada al portapapeles.",
			copyFailed: "Error al copiar al portapapeles.",
			errorPrefix: (error: string) => `Error: ${error}`,
		},
		claudeMdOnboarding: {
			title: "¿Configurar el contexto del Vault para Claude?",
			body:
				"Glass puede generar un archivo CLAUDE.md que resuma la estructura y las etiquetas de este Vault. Claude Code " +
				"lo carga automáticamente al inicio de cada sesión, de modo que entiende su Vault sin que tenga que " +
				"explicárselo cada vez. Puede revisar y editar el archivo después, y regenerarlo cuando quiera desde " +
				"Ajustes → Glass.",
			generateButton: "Generar CLAUDE.md",
			notNowButton: "Ahora no",
			generating: "Generando CLAUDE.md — esto puede tardar un momento...",
			done: "Listo. CLAUDE.md creado en la raíz del Vault.",
			doneNotice: "CLAUDE.md creado. Claude lo usará a partir de la próxima sesión.",
			failed: (error: string | undefined) => `Error: ${error}`,
		},
		confirmClaudeMdOverwrite: {
			title: "¿Sobrescribir CLAUDE.md?",
			body:
				"Ya existe un CLAUDE.md en la raíz del Vault. El archivo actual se guardará como CLAUDE.bak.md " +
				"(sobrescribiendo cualquier copia de seguridad anterior) antes de escribir el nuevo.",
		},
		confirm: {
			continueButton: "Continuar",
			cancelButton: "Cancelar",
		},
	},
	terminal: {
		filePicker: {
			placeholder: "Buscar notas...",
		},
		viewDisplayText: "Claude Code",
		wordmark: "GLASS",
		byline: "by Blackglass",
		toolbar: {
			newSession: "Nueva sesión",
			newSessionTooltip: "Iniciar una nueva sesión de Claude Code",
			clear: "Limpiar",
			clearTooltip: "Limpiar la salida del terminal sin finalizar la sesión",
			insertReference: "@",
			insertReferenceTooltip: "Insertar una referencia a nota en el terminal (@archivo)",
			settingsTooltip: "Abrir los ajustes de Glass",
		},
		status: {
			sessionLabel: "sesión",
			noSession: "Sin sesión",
			sessionStatusNoSession: "Estado de la sesión: sin sesión",
			mcpLabel: "MCP",
			sessionActive: "Sesión activa",
			sessionEnded: "Sesión finalizada",
			sessionStatus: (title: string) => `Estado de la sesión: ${title.toLowerCase()}`,
			updateAvailable: (version: string) => `Glass ${version} está disponible — haga clic para actualizar`,
			mcpRunning: (port: number) => `Servidor MCP del Vault activo en el puerto ${port}`,
			mcpFailed: "No se pudo iniciar el servidor MCP del Vault",
			mcpDisabled: "Servidor MCP del Vault desactivado",
		},
		banners: {
			failedToStart: (message: string) => `\r\n\x1b[31mError al iniciar Claude Code: ${message}\x1b[0m`,
			windowsSetupHeading: `\r\n\x1b[33mPasos de instalación:\x1b[0m`,
			windowsSetupStep1: `\r\n\x1b[33m  1. Instale Python 3: https://www.python.org/downloads/\x1b[0m`,
			windowsSetupStep2: `\r\n\x1b[33m  2. Ejecute en PowerShell: pip install pywinpty\x1b[0m`,
			windowsSetupStep3: `\r\n\x1b[33m  3. Vuelva a cargar Obsidian\x1b[0m`,
			checkPathWindowsPywinpty: (claudePath: string) =>
				`\r\n\x1b[33mCompruebe que '${claudePath}' está en su PATH. Si falta pywinpty: pip install pywinpty\x1b[0m`,
			checkPathUnixPython: (claudePath: string) =>
				`\r\n\x1b[33mCompruebe que '${claudePath}' está en su PATH y que Python 3 está instalado.\x1b[0m`,
			checkPathWithHint: (claudePath: string, hint: string) =>
				`\r\n\x1b[33mCompruebe que '${claudePath}' está en su PATH.${hint}\x1b[0m`,
			setupHintWindows: " Se requieren Python 3 y pywinpty (pip install pywinpty).",
			setupHintUnix: " Compruebe que Python 3 esté instalado.",
			noPreviousSession: `\r\n\x1b[33m[No se encontró ninguna sesión anterior — iniciando una nueva]\x1b[0m\r\n`,
			sessionEndedWithCode: (exitCode: number) =>
				`\r\n\x1b[90m[La sesión de Claude Code finalizó con el código de salida ${exitCode}]\x1b[0m`,
		},
	},
	errors: {
		pythonNotFound: (installHint: string) => `No se encontró Python 3. ${installHint}`,
		installPythonDownloadLink: "Instale Python 3 desde https://www.python.org/downloads/",
		installPythonHomebrew: "Instálelo con Homebrew: brew install python3",
		requestTimedOut: (seconds: number) => `Tiempo de espera agotado tras ${seconds}s`,
		claudeExitedWithCode: (code: number | null) => `Claude finalizó con el código ${code}`,
		failedToStartClaude: (message: string, hint: string) => `Error al iniciar Claude: ${message}. ${hint}`,
		setBinaryPathHint: `Indique la ruta completa en Ajustes → Glass → «Ruta del binario de Claude».`,
		setBinaryPathHintWindows: (example: string) =>
			`Indique la ruta completa en Ajustes → Glass → «Ruta del binario de Claude» (p. ej. ${example}).`,
		isOnPathHint: (claudePath: string) => `¿Está '${claudePath}' en su PATH?`,
		vaultRootNotFound: "No se pudo determinar la raíz del Vault.",
		emptyClaudeResponse: "Claude devolvió una respuesta vacía.",
		failedToWriteClaudeMd: (message: string) => `Error al escribir CLAUDE.md: ${message}`,
	},
};
