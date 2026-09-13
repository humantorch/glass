import { getLanguage } from "obsidian";
import { en } from "./en";

export type LocaleStrings = typeof en;

// `en` is declared `as const`, so its string/number leaves are literal types
// (e.g. "Claude binary path", not `string`) — widen those back to their base
// primitive so a translation can hold different text without a type error.
type Widen<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T;

// A translated locale need not provide every key on day one — deepMerge below
// falls back to English per-key, so a partial community translation is usable
// as soon as it exists rather than needing to be complete first.
type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends (...args: never[]) => unknown
		? T[K]
		: T[K] extends object
			? DeepPartial<T[K]>
			: Widen<T[K]>;
};

// Locale registry. Only English exists today; adding a language is:
//   1. create src/i18n/<code>.ts exporting a DeepPartial<LocaleStrings>
//      (translate as many or as few keys as you have)
//   2. import it above and add it here, keyed by its ISO code, e.g.: { de }
const LOCALES: Record<string, DeepPartial<LocaleStrings> | undefined> = {};

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: DeepPartial<T> | undefined): T {
	if (!override) return base;
	const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
	for (const key of Object.keys(override)) {
		const overrideValue = (override as Record<string, unknown>)[key];
		const baseValue = (base as Record<string, unknown>)[key];
		result[key] =
			isPlainObject(baseValue) && isPlainObject(overrideValue)
				? deepMerge(baseValue, overrideValue as DeepPartial<typeof baseValue>)
				: overrideValue;
	}
	return result as T;
}

function detectLanguage(): string {
	try {
		return getLanguage();
	} catch {
		return "en";
	}
}

export const strings: LocaleStrings = deepMerge(en, LOCALES[detectLanguage()]);
