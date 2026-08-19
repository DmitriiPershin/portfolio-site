# Agent instructions

At the start of a task, read `README.md`, `project-context.md`, `decisions.md`, `Bugs.md`, and `checks.md`.

- Start significant work with a short plan.
- Confirm product logic and design intent instead of inventing irreversible behavior.
- Keep Figma node IDs on implemented sections where practical.
- Update README and the relevant context artifacts after meaningful product changes.
- Add discovered and resolved defects to `Bugs.md`.
- Run the checks in `checks.md` before saying the work is complete.
- Challenge requests that create disproportionate effort or complexity and propose a smaller validation step.
- Never hide essential content behind JavaScript. Reduced-motion and no-JavaScript paths must remain usable.
- All spacing and motion values must come from the tokens in `src/styles/global.css`.
- Production is GitHub `main` deployed through Railway; verify both after code changes.
