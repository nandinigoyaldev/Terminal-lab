# 🟢 Terminal Lab

> **A tiny green terminal. A complete command-line adventure.**

Terminal Lab is a beginner-first command-line learning game. Start at the prompt, earn XP by completing missions, unlock the next lesson, and build the confidence to use a real terminal.

The terminal inside the app is **simulated**. It cannot touch your computer, delete your files, or run arbitrary commands. Learn boldly. Break nothing.

## ✨ What is inside?

- 🎮 A sequential learning path — no getting lost in a giant reference page
- 💻 A safe simulated shell with files, folders, pipes, redirects, history, and autocomplete
- 🧩 Missions, quizzes, streaks, XP, badges, and unlockable lessons
- 🗺️ A 16-module command-line roadmap
- 🧪 Practice challenges for `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cp`, `mv`, `grep`, `find`, `wc`, `sort`, `uniq`, `chmod`, and more
- 🌍 Bash, Linux, macOS, Windows CMD, and PowerShell context
- 🔐 Optional Google progress sync with Firebase
- 🚀 Deployable as a static site on Vercel or GitHub Pages

## 🕹️ Play locally

You need Node.js 20+ and npm.

```bash
git clone https://github.com/YOUR_USERNAME/terminal-lab.git
cd terminal-lab
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Useful commands:

```bash
npm run build       # create the production build in dist/
npm run preview     # preview the production build locally
```

## 🧱 Tech stack

- **Vite** — development server and production bundler
- **Vanilla JavaScript** — routing, shell engine, lessons, missions, and UI
- **HTML + CSS** — terminal-inspired interface
- **localStorage** — progress that works without an account
- **Firebase Auth + Firestore REST** — optional Google sign-in and cloud progress
- **Vercel / GitHub Pages** — static hosting

The core app has no required backend. The simulated shell runs in the browser. Firebase is only needed if you want Google login and cross-device progress.

## ☁️ Deploy to Vercel — smallest possible walkthrough

### Option A: import from GitHub

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New → Project**.
4. Import your `terminal-lab` repository.
5. Vercel should detect Vite automatically.
6. Confirm these settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

7. Click **Deploy**.
8. Open the generated `.vercel.app` URL.

### Option B: deploy from your terminal

Install the Vercel CLI:

```bash
npm install --global vercel
```

From the project directory:

```bash
vercel login
vercel
```

Answer the prompts:

```text
Set up and deploy? Yes
Which scope? Your account
Link to existing project? No
Project name? terminal-lab
In which directory is your code located? ./
Want to modify settings? No
```

For production:

```bash
vercel --prod
```

### Automatic Vercel deploys

After connecting GitHub, every push to `main` creates a production deployment. Pull requests get preview URLs. This is the easiest workflow:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

## 🔥 Add Google login with Firebase

Firebase is the easiest backend for this frontend because Vercel can host the site while Firebase handles authentication and progress storage.

### 1. Create the Firebase project

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a project**.
3. Name it something like `terminal-lab`.
4. Analytics can be disabled for now.
5. Click **Create project**.

### 2. Add a web app

1. In Firebase Project Overview, click the **Web `</>`** icon.
2. Register the app as `terminal-lab-web`.
3. Do not select Firebase Hosting — Vercel is hosting the frontend.
4. Copy the configuration values. You will use them as environment variables.

### 3. Enable Google sign-in

1. Go to **Build → Authentication**.
2. Click **Get started**.
3. Open **Sign-in method**.
4. Choose **Google**.
5. Enable it.
6. Select a support email.
7. Save.

### 4. Add your Vercel domain to Firebase

In Firebase:

1. Go to **Authentication → Settings → Authorized domains**.
2. Add your Vercel domain, for example:

```text
terminal-lab.vercel.app
```

For a custom domain, add that too:

```text
learn.example.com
```

`localhost` is usually already listed for local development.

### 5. Create Firestore

1. Go to **Build → Firestore Database**.
2. Click **Create database**.
3. Choose a location close to your users.
4. Start in **production mode**.
5. Finish setup.

### 6. Add Firestore rules

Open the **Rules** tab and use rules that let each signed-in learner access only their own progress document:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

Click **Publish**.

### 7. Configure local environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values from your Firebase web app:

```env
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
```

Restart Vite after changing environment variables:

```bash
npm run dev
```

Then open **Progress → Sign in with Google**.

### 8. Add the same variables to Vercel

1. Open your Vercel project.
2. Go to **Settings → Environment Variables**.
3. Add each variable below one at a time:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

4. Select **Production**, **Preview**, and **Development** where appropriate.
5. Save.
6. Go to **Deployments**.
7. Redeploy the latest deployment.

### Important environment-variable rules

- ✅ Vite variables beginning with `VITE_` are exposed to the browser. Firebase web config is designed to be public.
- ❌ Never put Firebase Admin SDK keys, service-account JSON, database passwords, or private API keys in `VITE_*`.
- ❌ Never commit `.env.local`.
- ✅ Firestore rules are what protect learner data.
- ✅ `.env.example` contains names only, never real values.

The repository already ignores local environment files through [.gitignore](./.gitignore).

## 🧪 Test the Firebase setup

Run:

```bash
npm run build
npm run preview
```

Then check:

1. The homepage loads.
2. The guided path still works.
3. The Progress page opens.
4. Google popup opens.
5. You can sign in.
6. A document appears at `progress/YOUR_FIREBASE_USER_ID` in Firestore.
7. Open the site in another browser and confirm the progress syncs.

If Google popup fails, check:

- The Vercel domain is in Firebase **Authorized domains**
- Google provider is enabled
- Vercel environment variables are present
- You redeployed after adding variables
- Browser popup blockers are disabled for the site

## 🗺️ The complete learning roadmap

1. 🟢 Terminal fundamentals
2. 📁 Directory navigation
3. 🧰 File and directory management
4. 📖 Reading and writing files
5. 🔎 Searching and text processing
6. 🔗 Shell operators and combinations
7. 🔒 Permissions and ownership
8. ⚙️ Processes and job control
9. 🎛️ Shell configuration and customization
10. 📦 Package and system management
11. 🌐 Networking commands
12. 📜 Bash and shell scripting
13. 🧠 Advanced shell concepts
14. ⌨️ Terminal productivity
15. 🖥️ System-level command-line knowledge
16. 🪟 Windows CMD and PowerShell

Extra essentials included in the roadmap:

`man` and `info` · exit codes and `stderr` · `tar` and gzip · JSON/CSV tools such as `jq` · Git and GitHub workflows · SSH keys and secret safety · `stat` and MIME types · package version pinning · POSIX portability · command-injection awareness.

## 🚀 Product quests

The next ten big upgrades:

1. 🧪 Safe real-terminal mode
2. 🃏 Command flashcards
3. 🧯 Mistake explanations
4. 🏗️ Mini projects
5. 🔁 Command history replay
6. ⌨️ Shortcut lessons
7. 🌍 Cross-platform comparisons
8. ♿ Accessibility mode
9. 🧑‍🏫 Mentor mode
10. 🗺️ Learner roadmaps for Git, Linux admin, Bash, networking, DevOps, and developer workflows

## 🤝 Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

Great contributions include:

- Making an explanation clearer for a beginner
- Adding a safe simulated mission
- Improving keyboard navigation
- Adding a cross-platform note
- Reporting a confusing error
- Improving the deployment guide

Curriculum rule: **teach the why, show the command, give a safe mission, then verify the learner’s work.**

## 📄 License

MIT — see [LICENSE](./LICENSE).
