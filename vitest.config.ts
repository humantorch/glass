import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		// Only the repo's own tests; agent worktrees under .claude/ hold full copies of them.
		include: ["tests/**/*.test.ts"],
	},
});
