#!/usr/bin/env node
/**
 * Release script for Blackglass.
 *
 * Usage: npm run release:patch | release:minor | release:major
 *
 * Bumps the version in manifest.json and package.json, then:
 *   1. Checks that the working tree is clean
 *   2. Builds (tsc + esbuild)
 *   3. Commits the version bump
 *   4. Generates release notes using claude --print
 *   5. Creates and pushes a X.X.X git tag
 *   6. Creates a GitHub release with main.js, manifest.json, styles.css attached
 *   7. Bumps the version badge on the gh-pages website
 *   8. Cleans up local temp files
 */

import { execSync, spawnSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const bumpType = process.argv[2];
if (!["patch", "minor", "major"].includes(bumpType)) {
	console.error("Usage: npm run release:patch | release:minor | release:major");
	process.exit(1);
}

function bumpVersion(current, type) {
	const [major, minor, patch] = current.split(".").map(Number);
	if (type === "major") return `${major + 1}.0.0`;
	if (type === "minor") return `${major}.${minor + 1}.0`;
	return `${major}.${minor}.${patch + 1}`;
}

const manifestPath = resolve(root, "manifest.json");
const packagePath = resolve(root, "package.json");
const versionsPath = resolve(root, "versions.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
const versions = JSON.parse(readFileSync(versionsPath, "utf8"));

const oldVersion = manifest.version;
const version = bumpVersion(oldVersion, bumpType);
const tag = version; // Obsidian requires tags without a 'v' prefix
const notesFile = resolve(tmpdir(), `blackglass-release-notes-${version}.md`);

console.log(`\nBumping ${bumpType}: ${oldVersion} -> ${version}\n`);

// Guard: clean working tree
const dirty = execSync("git status --porcelain", { cwd: root }).toString().trim();
if (dirty) {
	console.error("Uncommitted changes present. Commit or stash them before releasing.");
	process.exit(1);
}

// Guard: tag must not already exist
try {
	execSync(`git rev-parse ${tag}`, { cwd: root, stdio: "ignore" });
	console.error(`Tag ${tag} already exists.`);
	process.exit(1);
} catch {
	// Tag does not exist — good to proceed
}

// Compute commit range now (before any changes) for use in README and release notes
let lastTag = "";
let commits = "";
try {
	lastTag = execSync("git describe --tags --abbrev=0", { cwd: root }).toString().trim();
	commits = execSync(`git log ${lastTag}..HEAD --format="- %s"`, { cwd: root }).toString().trim();
} catch {
	commits = execSync('git log --format="- %s"', { cwd: root }).toString().trim();
}

// Write version to manifest.json, package.json, and versions.json
manifest.version = version;
pkg.version = version;
versions[version] = manifest.minAppVersion;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n");
writeFileSync(versionsPath, JSON.stringify(versions, null, 2) + "\n");

// Build first — if it fails, nothing is committed or tagged
console.log("Building...");
execSync("npm run build", { cwd: root, stdio: "inherit" });

// Update README "What's new" section
console.log("\nUpdating README What's new section...");
try {
	const bulletPrompt =
		`Summarize user-facing changes in version ${version} of Blackglass, an Obsidian plugin.\n\n` +
		`IMPORTANT: Only include changes users directly experience. Ignore:\n` +
		`- Code refactoring or type safety improvements\n` +
		`- Documentation changes\n` +
		`- CI/CD or build process changes\n` +
		`- ESLint/linting configuration\n\n` +
		`If there are no user-facing changes, output: (no user-facing changes in this release)\n\n` +
		`Otherwise, format as markdown bullet list (3–6 items max). Each bullet: **Feature**, em dash, one sentence.\n` +
		`Output ONLY the bullets or the note above. No heading, preamble, or commentary.\n\n` +
		`Commits:\n${commits}`;

	const bulletResult = spawnSync("claude", ["--print"], {
		input: bulletPrompt,
		cwd: root,
		encoding: "utf8",
	});

	if (bulletResult.status === 0 && bulletResult.stdout.trim()) {
		let bullets = bulletResult.stdout.trim();
		// Skip if Claude determined there are no user-facing changes
		if (!bullets.includes("no user-facing changes")) {
			// Strip any preamble before the first bullet
			const firstBullet = bullets.search(/^[-*]/m);
			if (firstBullet > 0) bullets = bullets.slice(firstBullet);
			const readmePath = resolve(root, "README.md");
			let readme = readFileSync(readmePath, "utf8");
			const newSection =
				`<!-- WHATS-NEW-START -->\n## What's new in ${version}\n\n${bullets}\n<!-- WHATS-NEW-END -->`;
			readme = readme.replace(/<!-- WHATS-NEW-START -->[\s\S]*?<!-- WHATS-NEW-END -->/, newSection);
			writeFileSync(readmePath, readme);
			console.log("README What's new section updated.");
		} else {
			console.log("No user-facing changes detected, skipping README update.");
		}
	} else {
		console.warn("claude --print returned no output, skipping README update.");
	}
} catch (err) {
	console.warn(`Could not update README What's new section (${err.message}).`);
}

// Commit version bump + README update
console.log("\nCommitting version bump...");
execSync("git add manifest.json package.json versions.json README.md", { cwd: root });
execSync(`git commit -m "Bump version to ${version}"`, { cwd: root, stdio: "inherit" });
execSync("git push origin main", { cwd: root, stdio: "inherit" });

// Generate release notes using claude --print
console.log("\nGenerating release notes...");
let notesArg = "--generate-notes";
try {
	const prompt =
		`Write release notes for version ${version} of Blackglass, an Obsidian plugin.\n\n` +
		`IMPORTANT: Only document user-facing changes. Ignore:\n` +
		`- Code refactoring or type safety improvements\n` +
		`- Documentation updates or README changes\n` +
		`- CI/CD, build, or release process changes\n` +
		`- ESLint/linting or code style configuration\n` +
		`- Internal maintenance\n\n` +
		`If there are no user-facing changes, output only: (maintenance release — no user-facing changes)\n\n` +
		`Otherwise, format as markdown starting with "## What's new". Keep it concise.\n` +
		`Output ONLY the markdown. No preamble, meta-commentary, or explanation.\n\n` +
		`Commits since ${lastTag || "the beginning"}:\n${commits}`;

	const result = spawnSync("claude", ["--print"], {
		input: prompt,
		cwd: root,
		encoding: "utf8",
	});

	if (result.status === 0 && result.stdout.trim()) {
		// Claude sometimes wraps --print output in ```markdown ... ``` fences.
		// Strip them so the GitHub release notes render as plain markdown.
		let notes = result.stdout.trim();
		notes = notes.replace(/^```[a-z]*\n/, "").replace(/\n```$/, "").trim();
		// Strip any conversational preamble before the first ## heading
		const firstHeading = notes.indexOf("## ");
		if (firstHeading > 0) notes = notes.slice(firstHeading);
		writeFileSync(notesFile, notes);
		notesArg = `--notes-file ${notesFile}`;
		console.log("Release notes generated.");
	} else {
		console.warn("claude --print returned no output, falling back to auto-generated notes.");
	}
} catch (err) {
	console.warn(`Could not generate release notes (${err.message}), falling back to auto-generated notes.`);
}

// Tag + push
console.log(`\nTagging ${tag}...`);
execSync(`git tag -a ${tag} -m "${tag}"`, { cwd: root, stdio: "inherit" });
execSync(`git push origin ${tag}`, { cwd: root, stdio: "inherit" });

// GitHub release — attach individual files (Obsidian requires main.js, manifest.json, styles.css as direct assets)
console.log("\nCreating GitHub release...");
// main.js and styles.css are uploaded by the GitHub Actions release workflow
// after it builds and attests them. The script only creates the release shell.
const url = execSync(
	`gh release create ${tag} manifest.json --title "${tag}" ${notesArg}`,
	{ cwd: root }
).toString().trim();

// Bump version badge on gh-pages website
console.log("\nUpdating gh-pages version badge...");
const worktreePath = resolve(tmpdir(), `blackglass-gh-pages-${version}`);
try {
	execSync(`git worktree add ${worktreePath} gh-pages`, { cwd: root });
	const indexPath = resolve(worktreePath, "index.html");
	const indexContent = readFileSync(indexPath, "utf8");
	const updated = indexContent.replace(
		/Obsidian Plugin · v[\d.]+/,
		`Obsidian Plugin · v${version}`
	);
	writeFileSync(indexPath, updated);
	execSync("git add index.html", { cwd: worktreePath });
	execSync(`git commit -m "Bump version badge to v${version}"`, { cwd: worktreePath });
	execSync("git push origin gh-pages", { cwd: worktreePath, stdio: "inherit" });
	console.log("gh-pages updated.");
} catch (err) {
	console.warn(`Could not update gh-pages (${err.message}). Update the version badge manually.`);
} finally {
	execSync(`git worktree remove --force ${worktreePath}`, { cwd: root, stdio: "ignore" });
}

// Clean up local temp files
if (existsSync(notesFile)) unlinkSync(notesFile);

console.log(`\nDone: ${url}\n`);
