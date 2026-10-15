#!/bin/sh
# PreToolUse guard for Bash. Reads the tool call JSON on stdin, exits 2 to block.
# Rules: no destructive deletes outside the project, no force-push / hard reset,
# no sudo, no pipe-to-shell installs, no touching the assignment PDF.
exec node -e '
let raw = "";
process.stdin.on("data", d => raw += d);
process.stdin.on("end", () => {
  let cmd = "";
  try { cmd = JSON.parse(raw).tool_input?.command || ""; } catch { process.exit(0); }
  const rules = [
    [/\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)[a-zA-Z]*\s+(\/|~|\$HOME|\.\.)(\s|$|\/)/, "recursive delete outside the project"],
    [/\brm\s+-[a-zA-Z]*r[a-zA-Z]*\s+.*\s(\/|~|\$HOME)(\s|$)/, "recursive delete of / or home"],
    [/\bgit\s+push\b.*(--force|-f\b|--force-with-lease)/, "force push"],
    [/\bgit\s+push\b/, "git push (no remote agreed for this project; ask the user)"],
    [/\bgit\s+reset\s+--hard\b/, "git reset --hard"],
    [/\bgit\s+clean\s+-[a-zA-Z]*f/, "git clean -f"],
    [/\bgit\s+checkout\s+--\s+\./, "discarding all working tree changes"],
    [/\bsudo\b/, "sudo"],
    [/\b(curl|wget)\b[^|]*\|\s*(sudo\s+)?(sh|bash|zsh|fish)\b/, "pipe-to-shell"],
    [/(>|>>|\brm\b|\bmv\b|\btruncate\b|\bsed\s+-i)[^;&|]*qa-automation-home-assignment\.pdf/, "modifying the assignment PDF"],
    [/\bchmod\s+(-R\s+)?777\b/, "chmod 777"],
    [/\bnpm\s+publish\b/, "npm publish"],
  ];
  for (const [re, why] of rules) {
    if (re.test(cmd)) {
      process.stderr.write(`Blocked by .claude/hooks/guard-bash.sh: ${why}.\nCommand: ${cmd}\nIf this is really needed, ask the user to run it or to adjust the guardrail.\n`);
      process.exit(2);
    }
  }
  process.exit(0);
});
'
