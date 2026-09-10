const fs = require("node:fs");
const path = require("node:path");

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

/**
 * Expo sees `pnpm-workspace.yaml` at the repository root and points Metro at
 * `<root>/node_modules`, which only exists once someone installs there.
 * Keep the roots that are actually on disk so `npm install` inside this
 * folder is enough to bundle, and pick the shared ones up automatically when
 * a workspace install has happened.
 */
const exists = (candidate) => fs.existsSync(candidate);

config.resolver.nodeModulesPaths = [
  path.join(projectRoot, "node_modules"),
  path.join(workspaceRoot, "node_modules"),
].filter(exists);

// Watch `packages/*` so shared code recompiles, but not the whole monorepo.
config.watchFolders = [path.join(workspaceRoot, "packages")].filter(exists);

module.exports = withNativeWind(config, { input: "./global.css" });
