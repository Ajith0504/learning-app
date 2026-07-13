# learning-app
# Code Quest — 22-Day DSA + React Challenge 🏆

A personal, gamified learning platform. 22 days, basic → complex. Each day pairs a DSA pattern with a React skill (~90 min total). You unlock the next day only by passing today's 3-question quiz (2/3 = ★★ pass, 3/3 = ★★★). Progress, streaks and stars are saved in your browser (localStorage).

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Deploy (free)

### Option A — Vercel (easiest)
1. Push this folder to a GitHub repo.
2. Go to vercel.com → Add New Project → import the repo.
3. Vercel auto-detects Vite. Click Deploy. Done — you get a live URL.

### Option B — Netlify
1. Push to GitHub, then netlify.com → Add new site → Import from Git.
2. Build command: `npm run build` · Publish directory: `dist`.

### Option C — GitHub Pages
1. In `vite.config.js`, add `base: '/<your-repo-name>/'` inside `defineConfig`.
2. `npm run build`, then publish the `dist/` folder (e.g. with the `gh-pages` package).

## Make it yours

Everything lives in `src/App.jsx`:

- **`DAYS`** — the 22-day plan. Each day has `tasks` (label, url, mins) and a 3-question `quiz`. Add/swap problems freely.
- **`CHAPTERS`** — the four groupings on the map.
- **`starsFor`** — the scoring rule.
- **`CSS`** string at the bottom — the whole theme.

Note: progress is stored per browser/device under the key `codequest22:state`. Clearing site data resets it (there's also a Reset button in the footer).

## The rules of the challenge

1. Show up daily, even for 15 minutes — the streak matters more than volume.
2. Don't peek at solutions before 20 minutes of honest effort.
3. Passed a day with ★★? Move on. Come back for ★★★ later.
