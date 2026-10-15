#!/bin/sh
# PostToolUse for Edit/Write: typecheck after a .ts change. Exit 2 surfaces errors to the agent.
exec node -e '
const { spawnSync } = require("child_process");
const fs = require("fs");
let raw = "";
process.stdin.on("data", d => raw += d);
process.stdin.on("end", () => {
  let input;
  try { input = JSON.parse(raw); } catch { process.exit(0); }
  const file = input.tool_input?.file_path || "";
  if (!/\.ts$/.test(file)) process.exit(0);
  const cwd = input.cwd || process.cwd();
  if (!fs.existsSync(`${cwd}/tsconfig.json`) || !fs.existsSync(`${cwd}/node_modules/.bin/tsc`)) process.exit(0);
  const r = spawnSync(`${cwd}/node_modules/.bin/tsc`, ["--noEmit", "-p", "tsconfig.json"], { cwd, encoding: "utf8" });
  if (r.status !== 0) {
    process.stderr.write(`Typecheck failed after editing ${file}:\n${r.stdout}${r.stderr}`);
    process.exit(2);
  }
  process.exit(0);
});
'
