#!/bin/sh
# PreToolUse guard for Edit/Write/NotebookEdit. Blocks edits outside the project,
# the assignment PDF, lockfiles, secrets and the guardrails themselves.
exec node -e '
const path = require("path");
let raw = "";
process.stdin.on("data", d => raw += d);
process.stdin.on("end", () => {
  let input;
  try { input = JSON.parse(raw); } catch { process.exit(0); }
  const file = input.tool_input?.file_path || input.tool_input?.notebook_path || "";
  if (!file) process.exit(0);
  const root = path.resolve(input.cwd || process.cwd());
  const abs = path.resolve(root, file);
  const rel = path.relative(root, abs);
  const block = (why) => {
    process.stderr.write(`Blocked by .claude/hooks/guard-files.sh: ${why}.\nFile: ${abs}\nAsk the user if this change is really needed.\n`);
    process.exit(2);
  };
  if (rel.startsWith("..") || path.isAbsolute(rel)) block("edit outside the project directory");
  if (/\.pdf$/i.test(rel)) block("the assignment PDF is read-only");
  if (/^(package-lock\.json|node_modules\/)/.test(rel)) block("lockfile/node_modules are managed by npm");
  if (/(^|\/)\.env(\.|$)/.test(rel)) block("secrets file");
  if (/^\.claude\/(settings\.json|hooks\/)/.test(rel)) block("guardrails are edited by the user, not the agent");
  process.exit(0);
});
'
