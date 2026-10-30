# Contributing to Terminal Lab

Thanks for helping make command-line learning less intimidating.

## Local development

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm run build
```

## Curriculum guidelines

- Keep the learning path sequential and beginner-friendly.
- Explain what a command does, why it exists, and when it is useful.
- Prefer small tasks that can be verified automatically.
- Keep practice inside the simulated filesystem. Never execute arbitrary user input on the host machine.
- Call out destructive commands and unsafe patterns clearly.

## Pull requests

Describe the learner problem being solved, include screenshots for UI changes, and mention how you verified the change. Keep unrelated refactors out of a content or UI pull request.
