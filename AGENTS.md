# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Cursor Cloud specific instructions

This repo has three independent npm projects, each with its own lockfile (deps are installed by the startup update script):

| Service | Dir | Dev command | Port | Notes |
|---|---|---|---|---|
| Misterdil app (primary, Expo/React Native web) | `/workspace` | `npm run web` | 8081 | Metro bundler; open `http://localhost:8081`. `npm start` for the dev menu (a/i/w). Uses Babel, so it runs even though `tsc --noEmit` reports pre-existing type errors. |
| API server (Express) | `/workspace/server` | `npm run dev` | 3000 | `tsx watch`. `GET /health` returns `503 {status:"degraded"}` until `DATABASE_URL` is set — this is expected, not a failure. |
| Marketing site (Next.js 16) | `/workspace/web` | `npm run dev` | 3000 | Standalone; **conflicts with the API on 3000** — run it on another port, e.g. `npm run dev -- -p 3001`. |

Non-obvious caveats:
- No test framework is configured anywhere (no `test` script). Lint exists only in `web` (`npm run lint`); root and `server` have none. Typecheck via `tsc --noEmit` (root has pre-existing errors and, lacking `exclude`, also scans `web/`).
- The Expo app's auth (login/OTP/Google) requires Firebase env vars (`EXPO_PUBLIC_FIREBASE_*`); without them the login screen renders but shows a "Firebase non configuré" warning and you cannot reach the authenticated tabs. Package/payment flows use local `AsyncStorage` state (no API call), but are gated behind that auth screen. Secrets, when present, are read from `/workspace/.env` (gitignored; copy `.env.example`).
- **Server `DATABASE_URL` must be in the actual process env, not just `.env`.** `server/src/db.ts` reads `process.env.DATABASE_URL` at import time, which (ES module hoisting) runs *before* `index.ts` calls `dotenv.config()` — so the `.env` file loads too late. Start the server with the var already exported, e.g. from `/workspace/server`: `export DATABASE_URL="$(grep -m1 '^DATABASE_URL=' ../.env | cut -d= -f2-)"; npm run dev`. Then `GET /health` returns `{"status":"ok","database":"neon"}`. Apply the schema once with `npm run db:migrate` (reads `DATABASE_URL` from `../.env`).
- The Neon serverless driver targets Neon cloud (not a plain local Postgres).
- **Web phone OTP is intentionally stubbed** (`services/firebase/phoneAuth.ts` always throws; real SMS needs a native Android build). So a user registered via the web app is stuck on the OTP screen (`phoneVerified=false`) and never reaches the tabs. To reach the authenticated tabs on web, the user's Firestore `users/{uid}` doc needs `phoneVerified: true`.
- **The Expo app stores user profiles in Cloud Firestore** (`services/firebase/userService.ts`). Firebase Auth (email/password) and Firestore must both be enabled in the Firebase project; if Firestore is disabled, login/registration fail with a `permission-denied`/offline error even though the auth account is created.
- **The Neon-backed Express API and the Expo app are decoupled.** `services/api/client.ts` (which talks to the `server/` Neon API) is currently **not imported anywhere** in the Expo app — the app's profile/auth flow goes through Firestore, while package/payment flows are local `AsyncStorage`. So the Neon API (the intended storage for the Vercel-deployed backend) is exercised on its own (see `server/`), not through the mobile app. Reaching the authenticated Expo tabs therefore still depends on Firestore unless the app is rewired to call the Neon API (an app-code change, not env setup).
