# Terminal Lab

Terminal Lab is an interactive command-line learning frontend.

## Stack

- **Vite** for local development and production builds
- **Semantic HTML and CSS** for the interface
- **Vanilla JavaScript** for routing, the simulated shell, lessons, exercises, and tutor
- **`localStorage`** for progress persistence

There is intentionally no backend yet. The terminal is simulated in the browser and never executes commands on the user's computer. A backend can be added later if the app needs accounts, shared progress, analytics, or remotely managed course content.

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
