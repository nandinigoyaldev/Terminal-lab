# Terminal Lab

> A guided, game-like way to learn the command line.

[![Live app](https://img.shields.io/badge/live-Vercel-000000?logo=vercel&logoColor=white)](https://terminal-lab.vercel.app)
[![Frontend](https://img.shields.io/badge/frontend-React%2019-61DAFB?logo=react&logoColor=111827)](./frontend)
[![Backend](https://img.shields.io/badge/backend-Express-111827?logo=express&logoColor=white)](./backend)
[![License](https://img.shields.io/badge/license-MIT-65f58a)](./LICENSE)

Terminal Lab teaches terminal skills in a safe simulated shell. Learners clear missions in order, earn XP, and move from `pwd` and `ls` to scripting, networking, permissions, and system tools.

The simulator never executes commands on the learner’s computer.

## What is here

- Sequential mission path with locked/unlocked lessons
- Simulated terminal with command history and basic shell commands
- XP, levels, progress, and a free-play Playground
- React + Vite frontend
- Express API for progress
- Supabase-ready Google authentication and cloud progress sync

## Project layout

```text
frontend/    React + Vite browser app
backend/     Express API
legacy/      archived one-file prototype
vercel.json  Vercel frontend build settings
```

The application entrypoint is [frontend/src/main.jsx](./frontend/src/main.jsx). The old prototype is not used.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev:all
```

Open:

- Frontend: <http://localhost:5173>
- API health check: <http://localhost:8787/api/health>

Useful commands:

```bash
npm run dev:frontend
npm run dev:backend
npm run build
npm run preview
```

## Hosting architecture

The project has two deploys:

```text
Browser → Vercel frontend → Render backend API → production database
```

Vercel hosts the React app. Render hosts the Express API for local/API development. Supabase provides Google authentication and Postgres progress storage for production.

### Render settings

Create a Render **Web Service** from this repository with:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

The `backend/` folder has its own [package.json](./backend/package.json), so it can be deployed independently.

Add:

```text
FRONTEND_ORIGIN=https://YOUR-APP.vercel.app
```

After deployment, the backend root URL returns a small JSON status response. The health endpoint is:

```text
https://YOUR-BACKEND.onrender.com/api/health
```

If you leave Render's Root Directory blank, use:

```text
Build Command: npm install
Start Command: npm run dev:backend
```

## Environment variables

### Frontend

Create `frontend/.env.local` for local development:

```env
VITE_API_URL=http://localhost:8787
```

On Vercel, add:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

### Backend

Create `backend/.env` for local development:

```env
PORT=8787
FRONTEND_ORIGIN=http://localhost:5173
```

On Render, add:

```env
FRONTEND_ORIGIN=https://YOUR-APP.vercel.app
```

Never commit `.env`, `.env.local`, credentials, Supabase service-role keys, or private keys.

## Supabase setup

Supabase is the production backend for login and progress:

1. Create a project at <https://supabase.com>.
2. Open **Authentication → Providers → Google** and enable Google.
3. Add your Vercel URL under **Authentication → URL Configuration → Redirect URLs**.
4. Open **SQL Editor**.
5. Paste and run [supabase/schema.sql](./supabase/schema.sql).
6. Open **Project Settings → API**.
7. Copy the **Project URL** and the public **anon key** into Vercel:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Use the public anon key only. Never put the Supabase service-role key in the frontend.

After adding the variables, redeploy Vercel. Open **Progress → Sign in with Google**. The first successful login creates or updates that user's row in the `progress` table. Signed-in learners can use the account menu to view their email, update their display name, and sign out. The display name is stored in Supabase Auth user metadata; no extra profile table is required.

## Learning path

1. Terminal fundamentals
2. Directory navigation
3. Files and directories
4. Reading and writing files
5. Searching and text processing
6. Shell operators
7. Permissions and ownership
8. Processes and job control
9. Shell configuration
10. Packages and system management
11. Networking
12. Shell scripting
13. Advanced shell
14. Terminal productivity
15. System-level command line
16. Windows CMD and PowerShell

## Contributing

```bash
npm install
npm run dev:all
npm run build
```

Keep lessons sequential, practical, and safe. A good lesson explains the idea, shows a command, gives the learner a task, and checks the result.

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
