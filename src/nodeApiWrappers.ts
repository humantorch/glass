import type { ChildProcess } from "child_process";

export function getEnv(key: string, defaultValue = ""): string {
	const value = process.env[key];
	return typeof value === "string" ? value : defaultValue;
}

export function hasEnv(key: string): boolean {
	return typeof process.env[key] === "string";
}

export function buildEnvMap(): Record<string, string> {
	const env: Record<string, string> = {};
	for (const [key, value] of Object.entries(process.env)) {
		if (typeof value === "string") {
			env[key] = value;
		}
	}
	return env;
}

export function isErrnoException(err: unknown): err is NodeJS.ErrnoException {
	return err instanceof Error && "code" in err;
}

export function getErrorCode(err: unknown): string | undefined {
	if (isErrnoException(err)) return err.code;
	return undefined;
}

export function getErrorMessage(err: unknown): string {
	if (err instanceof Error) return err.message;
	if (typeof err === "string") return err;
	return String(err);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

export function isWritableStream(value: unknown): value is NodeJS.WritableStream {
	return (
		value !== null &&
		typeof value === "object" &&
		typeof (value as { write?: unknown }).write === "function"
	);
}

export function isReadableStream(value: unknown): value is NodeJS.ReadableStream {
	return (
		value !== null &&
		typeof value === "object" &&
		typeof (value as { on?: unknown }).on === "function"
	);
}

export function getStdioStream(
	proc: ChildProcess,
	index: number
): NodeJS.WritableStream | NodeJS.ReadableStream | null {
	const stream = proc.stdio[index];
	if (isWritableStream(stream) || isReadableStream(stream)) {
		return stream;
	}
	return null;
}

export function getStdoutStream(proc: ChildProcess): NodeJS.ReadableStream | null {
	if (isReadableStream(proc.stdout)) return proc.stdout;
	return null;
}

export function getStderrStream(proc: ChildProcess): NodeJS.ReadableStream | null {
	if (isReadableStream(proc.stderr)) return proc.stderr;
	return null;
}

export function getStdinStream(proc: ChildProcess): NodeJS.WritableStream | null {
	if (isWritableStream(proc.stdin)) return proc.stdin;
	return null;
}

export function parseJSON<T>(text: string): T | null {
	try {
		return JSON.parse(text) as T;
	} catch {
		return null;
	}
}

export function parseJSONOrThrow<T>(text: string, context = ""): T {
	try {
		return JSON.parse(text) as T;
	} catch (err) {
		throw new Error(`Failed to parse JSON${context ? `: ${context}` : ""}: ${getErrorMessage(err)}`);
	}
}

export function getStringProperty(obj: unknown, key: string, defaultValue = ""): string {
	if (!isRecord(obj)) return defaultValue;
	const value = obj[key];
	return typeof value === "string" ? value : defaultValue;
}

export function getNumberProperty(obj: unknown, key: string, defaultValue = 0): number {
	if (!isRecord(obj)) return defaultValue;
	const value = obj[key];
	return typeof value === "number" ? value : defaultValue;
}

export function getBooleanProperty(obj: unknown, key: string, defaultValue = false): boolean {
	if (!isRecord(obj)) return defaultValue;
	const value = obj[key];
	return typeof value === "boolean" ? value : defaultValue;
}

export function getArrayProperty(obj: unknown, key: string): unknown[] {
	if (!isRecord(obj)) return [];
	const value = obj[key];
	return Array.isArray(value) ? value : [];
}
