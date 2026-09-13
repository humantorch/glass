# Localization

Every piece of Obsidian-native UI text in Glass (settings, notices, command names, modal text, tooltips, terminal messages) lives here rather than as string literals scattered through `src/`.

## Structure

- `en.ts` — the source of truth. Every string starts here, in English.
- `index.ts` — resolves which locale to use (via Obsidian's `getLanguage()`) and exports `strings`, the object the rest of the plugin imports.
- `<code>.ts` (e.g. `de.ts`) — one file per additional language, each exporting a partial translation keyed the same way as `en.ts`.

A locale file doesn't need to translate every key. `index.ts` falls back to the English value for anything missing, per key — not per file — so a half-finished translation is still usable rather than being all-or-nothing.

## Translation status

| Language | Status |
|---|---|
| English (`en`) | Source of truth |
| German (`de`) | Machine-translated draft, not reviewed by a native speaker |
| Spanish (`es`) | Machine-translated draft, not reviewed by a native speaker |
| Dutch (`nl`) | Machine-translated draft, not reviewed by a native speaker |
| French (`fr`) | Machine-translated draft, not reviewed by a native speaker |

**These are AI-generated drafts, not verified translations.** They exist to make the plugin usable in more languages sooner rather than not at all, but they haven't been checked by anyone fluent in the target language. Expect occasional awkward phrasing, inconsistent terminology, or the wrong register in places — especially anywhere a setting's translated name is referenced from another string (e.g. an error message pointing back to a setting by name).

## Contributing a correction or a new language

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the general contribution process. For localization specifically:

- **Fixing an existing translation:** edit the relevant key(s) in that language's file directly. You don't need to translate anything else in the file.
- **Adding a new language:** create `src/i18n/<code>.ts` (ISO 639-1 code, e.g. `fr.ts`), export a `DeepPartial<LocaleStrings>`-shaped object (see `index.ts`) with as many or as few keys translated as you have time for, then register it in the `LOCALES` map in `index.ts`. Add a row to the table above.

Small, partial PRs are welcome — you don't need to translate the whole file in one go.
