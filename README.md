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
