declare module "electron" {
	const shell: {
		openExternal(url: string): void;
	};
	const clipboard: {
		writeText(text: string): void;
	};
	export { shell, clipboard };
}
