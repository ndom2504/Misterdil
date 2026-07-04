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
- The Expo app's auth (login/OTP/Google) requires Firebase env vars (`EXPO_PUBLIC_FIREBASE_*`); without them the login screen renders but shows a "Firebase non configuré" warning and you cannot reach the authenticated tabs. Package/payment flows use local `AsyncStorage` state (no API call), but are gated behind that auth screen.
- The API's data routes need a Neon `DATABASE_URL`; the Neon serverless driver targets Neon cloud (not a plain local Postgres). Set env in `/workspace/.env` (copy `.env.example`); the server loads `../.env` then `./.env`.
