# Delivery rules

What the reviewer receives: the project folder, the command, whether tests passed.

- README is the cover letter: setup, `npx playwright test`, the real console output of the
  last green run, and a short note that AI was used and how.
- Never paste a fabricated or edited test output into README. Re-run and copy.
- Code, comments, README and commit messages are in English. Chat with the user is in Russian.
- Do not commit or ship `node_modules/`, `test-results/`, `playwright-report/`, `.idea/`.
- No git remote and no `git push` unless the user explicitly asks where to publish.
- Keep scope to the three required tests. Extra tests, CI, Docker or multi-browser are out
  of scope unless the user asks.
