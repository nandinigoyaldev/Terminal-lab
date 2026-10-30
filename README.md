# 🟢 Terminal Lab

> **A command-line learning game with a real frontend and a real API.**

Terminal Lab is a beginner-friendly game for learning the terminal without the fear of breaking a real computer. Clear missions, earn XP, unlock the next sector, and eventually move from `pwd` to shell scripts, networking, and system work.

## 🧭 Project structure

```text
terminal-lab/
├── frontend/                 # React + Vite browser app
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx          # React UI and game state
│       └── styles.css        # terminal-game theme
├── backend/                  # Express API
│   ├── server.js             # health + progress endpoints
│   └── data/progress.json    # local development storage
├── legacy/                   # archived one-file prototype
├── package.json
└── vercel.json
```

The old generated prototype is kept in `legacy/` for reference. It is **not** the app entrypoint anymore.

## ⚡ Stack

- **React 19** for the component-based frontend
- **Vite** for development and production builds
- **Express 5** for the backend API
- **CORS** for local frontend/backend development
- **Firebase** reserved for Google auth and cloud sync
- **Vercel** for frontend hosting

## 🕹️ Run everything locally

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/YOUR_USERNAME/terminal-lab.git
cd terminal-lab
npm install
npm run dev:all
```

You now have:

| Service | URL |
|---|---|
| React frontend | http://localhost:5173 |
| Express backend | http://localhost:8787 |
| API health check | http://localhost:8787/api/health |

Run them separately when debugging:

```bash
npm run dev:frontend
npm run dev:backend
```

Other useful commands:

```bash
npm run build       # production frontend build
npm run preview     # preview frontend/dist
npm start           # production-style backend start
```

## 🧪 What the backend does right now

The backend is intentionally small and honest:

```text
GET /api/health
GET /api/progress/:userId
PUT /api/progress/:userId
```

During local development it stores progress in `backend/data/progress.json`. For production, replace that file store with Firestore, Postgres, or another hosted database before adding real users. The current frontend still keeps a local browser fallback so the game works offline.

## 🚀 Deploy the React frontend to Vercel

You already hosted the project on Vercel. With this structure, update the project settings:

1. Open your Vercel project.
2. Go to **Settings → General**.
3. Set **Root Directory** to `./`.
4. Set **Framework Preset** to `Vite`.
5. Set **Build Command** to:

   ```bash
   npm run build
   ```

6. Set **Output Directory** to:

   ```text
   frontend/dist
   ```

7. Set **Install Command** to:

   ```bash
   npm install
   ```

8. Click **Save**.
9. Open **Deployments**.
10. Click the three dots on the newest deployment.
11. Choose **Redeploy**.

The included [vercel.json](./vercel.json) also contains these build settings.

### Deploy from the CLI

```bash
npm install --global vercel
vercel login
vercel
vercel --prod
```

## 🛠️ Deploy the backend

Vercel is excellent for the frontend. A long-running Express server needs a backend host such as Render, Railway, Fly.io, or a VPS.

### Render walkthrough

1. Push this repository to GitHub.
2. Open [render.com](https://render.com).
3. Click **New → Web Service**.
4. Connect the GitHub repository.
5. Set:

   ```text
   Name: terminal-lab-api
   Runtime: Node
   Build command: npm install
   Start command: npm start
   ```

6. Choose the free or paid instance.
7. Add the environment variable:

   ```text
   FRONTEND_ORIGIN=https://YOUR-APP.vercel.app
   ```

8. Deploy.
9. Copy the Render URL, for example:

   ```text
   https://terminal-lab-api.onrender.com
   ```

10. Test:

    ```bash
    curl https://terminal-lab-api.onrender.com/api/health
    ```

### Backend environment file

Copy the example:

```bash
cp backend/.env.example backend/.env
```

Local values:

```env
PORT=8787
FRONTEND_ORIGIN=http://localhost:5173
```

Production values:

```env
PORT=8787
FRONTEND_ORIGIN=https://YOUR-APP.vercel.app
```

Do not commit `backend/.env`.

## 🔥 Google login and Firebase sync

When you are ready for real accounts:

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Add a Web App.
3. Enable **Authentication → Google**.
4. Add your Vercel domain under **Authentication → Settings → Authorized domains**.
5. Create a Firestore database.
6. Add rules so users can only read and write their own progress.
7. Add Firebase values to Vercel environment variables.

Frontend `.env`:

```env
VITE_API_URL=https://YOUR-API.onrender.com
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
```

Local frontend setup:

```bash
cp frontend/.env.example frontend/.env.local
```

Vite exposes `VITE_*` values to the browser. Firebase web configuration is public client configuration, but never put service-account JSON, Admin SDK credentials, database passwords, or private API keys in the frontend.

## 🗺️ Learning campaign

1. 🟢 Terminal fundamentals
2. 📁 Directory navigation
3. 🧰 File management
4. 📖 Reading and writing
5. 🔎 Searching and text processing
6. 🔗 Shell operators
7. 🔒 Permissions
8. ⚙️ Processes
9. 🎛️ Shell configuration
10. 📦 Packages and systems
11. 🌐 Networking
12. 📜 Shell scripting
13. 🧠 Advanced shell
14. ⌨️ Productivity
15. 🖥️ System command line
16. 🪟 Windows CMD and PowerShell

## 🤝 Contributing

```bash
npm install
npm run dev:all
npm run build
```

Keep curriculum changes sequential, safe, and practical. A good mission explains the idea, shows a command, lets the learner try it, and verifies the result.

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📄 License

MIT — see [LICENSE](./LICENSE).
