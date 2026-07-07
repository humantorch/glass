import obsidianmd from "eslint-plugin-obsidianmd";

export default [
	...obsidianmd.configs.recommended,
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"obsidianmd/ui/sentence-case": ["error", {
				brands: ["Blackglass", "Claude", "Claude Code", "Obsidian"],
				acronyms: ["MCP", "CLI", "PTY", "UI", "API", "JSON", "HTTP", "URL"],
			}],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-unsafe-member-access": "error",
			"@typescript-eslint/no-unsafe-assignment": "error",
			"@typescript-eslint/no-unsafe-call": "error",
			"@typescript-eslint/no-unsafe-argument": "error",
			"@typescript-eslint/no-unsafe-return": "error",
			"@typescript-eslint/no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
			"@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "separate-type-imports" }],
		},
	},
	{
		ignores: ["node_modules/**", "main.js"],
	},
];
