---
description: Safely upgrade dependencies in package.json or workflow files with version verification and user confirmation
---

Safely upgrade dependencies from this request: `$ARGUMENTS`

Extract the target dependency name(s) and the file to update from the arguments. If no file is specified, default to `package.json`. If no dependency is specified, list all outdated dependencies and ask which to upgrade.

## Constraints

- **package.json**: Use `pnpm` only. No npm, no yarn, no `--force`, no `--no-verify`.
- **Workflow files** (`.github/workflows/*.yml`): Edit YAML action versions directly. No package manager involved.
- **Every upgrade must be verified** before applying: check the npm registry (or GitHub releases for actions) for the latest version, compare with the current version, and present the diff to the user for confirmation.

## Steps

### 1. Identify the target

Parse the arguments:

- If a dependency name is provided, target that single dependency.
- If `<dependency>=<version>` format is provided, target that specific version.
- If `all` is provided, target all outdated dependencies.
- If a file path is provided (to a `package.json` or `.github/workflows/*.yml`), target that file.
- If no file, default to this project's root `package.json`.

### 2. Check current version

**If target is `package.json`:**

Read the current version from `dependencies` or `devDependencies` in the target `package.json`.

**If target is a workflow file:**

Read the current action versions from the workflow YAML.

### 3. Verify latest version

**For npm packages:**

Fetch the package info from the npm registry latest endpoint. Extract the `version` field and check `deprecated` status.

**For GitHub Actions:**

Fetch the latest release tag from the GitHub API for the action's repository. Extract the `tag_name` field.

### 4. Present upgrade plan

Show the user a summary with: package name, current version, latest version, change severity, and any deprecation notes.

**Stop and wait.** Ask the user to confirm each upgrade before proceeding.

### 5. Apply upgrade

**For `package.json`:**

Use `pnpm update <package>` to upgrade to the latest within range, or `pnpm add <package>@<version>` to pin a specific version. Never edit `package.json` directly.

After the upgrade, run `pnpm install --frozen-lockfile` to verify the lockfile is consistent. If that fails, run `pnpm install` to regenerate the lockfile. Verify the build passes with `pnpm run build` and `pnpm run test`.

**For workflow files:**

Edit the YAML file to update the action version tag.

**Never use** `--force`, `pnpm update --force`, `--no-verify`, or any flag that bypasses version checks or safety.

### 6. Verify

- Run `pnpm run build` and confirm it succeeds (for package.json upgrades).
- Run `pnpm run test` and confirm tests pass (for package.json upgrades).
- For workflow files, verify the version string was updated correctly in the YAML.

### 7. Present result

Summarize what was upgraded and to what version. If anything failed, explain what and why.

## Workflow-specific notes

- Upgrade the `@<version>` tag to the latest stable release tag.
- Check the action's GitHub releases page via the GitHub API to find the latest version.
- Minor/patch action version bumps are safe; major bumps may have breaking changes — flag them.
