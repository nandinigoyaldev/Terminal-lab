# Terminal Lab

Terminal Lab is an open-source, beginner-first command-line learning path. It starts with “what is a terminal?” and moves in small steps through navigation, files, text processing, permissions, processes, networking, and shell scripting.

The project is intentionally friendly to learners: commands run in a simulated filesystem, so practice never changes the user's real computer.

## Stack

- **Vite** for local development and production builds
- **Semantic HTML and CSS** for the interface
- **Vanilla JavaScript** for routing, the simulated shell, lessons, exercises, and tutor
- **`localStorage`** for progress persistence

The core app has no required backend and progress is local to the browser. Optional Google sign-in/cloud sync is wired for Firebase when a project-owned configuration is supplied; never commit OAuth credentials to this repository.

## Optional Google sync

The app is prepared for Firebase because it works with static hosting such as GitHub Pages:

1. Create a Firebase project and Web App.
2. Enable Google under Authentication → Sign-in method.
3. Create a Firestore database and add rules that allow each signed-in user to access only `progress/{uid}`.
4. Copy `.env.example` to `.env.local` and fill in the Web App config.
5. Run `npm run dev` or build and deploy the `dist/` folder.

The Firebase web config is read from `VITE_FIREBASE_*` variables. If they are absent, the app stays fully usable with local progress and does not attempt authentication.

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

Open the local URL printed by Vite.

## Project shape

`index.html` currently contains the app so the learning experience is easy to run and inspect. The next natural extraction is `src/` modules for the shell engine, curriculum, progress store, and views once the content settles.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request. Curriculum improvements are especially welcome: keep lessons sequential, explain the “why”, and include a safe interactive task.

## Suggested roadmap

- Extract the single entrypoint into small `src/` modules.
- Add automated tests for the shell parser and filesystem operations.
- Add accessible keyboard/focus states and a light/dark theme preference.
- Add optional authenticated sync after choosing and configuring an auth provider.

## Curriculum coverage

The in-app roadmap covers 16 modules:

1. Terminal fundamentals
2. Directory navigation
3. File and directory management
4. Reading and writing files
5. Searching and text processing
6. Shell operators and combinations
7. Permissions and ownership
8. Processes and job control
9. Shell configuration and customization
10. Package and system management
11. Networking commands
12. Bash and shell scripting
13. Advanced shell concepts
14. Terminal productivity
15. System-level command-line knowledge
16. Windows CMD and PowerShell

It also tracks additional essentials that are easy to miss in a first course: `man` and `info`, exit status and stderr, `tar` and gzip, JSON/CSV tooling such as `jq`, Git and GitHub workflows, SSH keys and secret safety, `stat` and MIME types, package version pinning, POSIX portability, and command-injection awareness.

## Product roadmap

The project roadmap now includes ten planned extensions: a safe real-terminal mode, command flashcards, mistake explanations, mini projects, history replay, shortcut lessons, cross-platform comparisons, accessibility mode, mentor mode, and focused learner tracks for Git, Linux administration, Bash, networking, DevOps, and developer workflows.
