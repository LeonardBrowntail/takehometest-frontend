# e-Wallet — Mock Wallets Frontend

A mock e-wallet web app built with **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Base UI**. It talks to a Laravel-style JSON:API backend and lets users top up their balance and transfer funds to other wallets.

Built as a full-stack take-home test: this is the **frontend**, paired with the e-wallet REST API served at `http://localhost:8000/api`.

## The two core features

### 1. Authentication

Everything in the app sits behind a session. Users **register** (which creates their wallet) or **sign in**, and every API call is authenticated with a **Sanctum Bearer token**:

- Token and user are persisted in `localStorage`, and the session is restored automatically on load (`AuthProvider`).
- Protected routes (`/dashboard`, `/transfers`) are wrapped in an `AuthGuard` that redirects visitors to `/login`.
- Logout **revokes the token server-side** and clears it locally — logging in again issues a fresh token (single active session).
- Safe against SSR: token access falls back to `null` outside the browser.
- Auth state is handled consistently via the `lib/auth-context.tsx` client context (`register`, `login`, `logout`, `isAuthenticated`, `isLoading`).

### 2. Secure transfer and top-up

The wallet actions are the heart of the app and are designed to protect the money model:

- **Top-up** (`lib/wallet.ts` → `topUp`) deposits funds into your wallet balance.
- **Transfer** (`lib/wallet.ts` → `transfer`) sends money to another wallet by its UUID.
- **Money is handled as integer cents** with strictly two-decimal strings: every amount is normalized with `toFixed(2)` before hitting the API (`normalizeAmount`), and validation errors (e.g. an amount like `"100"`) are surfaced to the user.
- Server-side guardrails surfaced in the UI: insufficient balance (`422`), unknown/self destination (`401`/rejected), and validation failures are shown as clear error messages.
- **Every deposit and transfer is recorded** — the dashboard shows recent transactions and the Transfers page lists the full, paginated history with status and direction.

## Getting started

Prerequisites: Node.js 20+, and the e-wallet backend API running at `http://localhost:8000`.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Point the app at your API with a `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
```

Defaults to `http://localhost:8000/api` when unset.

### Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the development server                 |
| `npm run build`   | Production build                             |
| `npm run start`   | Start the production server                  |
| `npm run lint`    | Run ESLint (`eslint .`)                      |
| `npx tsc --noEmit`| Type-check the project                       |

## Project structure

```
app/                 Next.js App Router routes (/, /login, /register, /dashboard, /transfers)
components/          UI + feature components (auth forms, wallet dialogs, transaction list)
lib/                 Logic layer:
  api.ts               fetch wrapper, response envelope unwrapping, ApiError
  auth.ts              register / login / logout, session persistence
  auth-context.tsx      React auth context (useAuth, AuthProvider)
  token.ts             localStorage token helpers (SSR-safe)
  wallet.ts            getWallet / topUp / transfer / getTransactions
  money.ts             IDR formatting and id shortening
  types.ts             API contract types (resources, envelopes)
```

## API contract notes

The frontend expects a Laravel JSON:API-style backend:

- Responses use an envelope: `{ status, message, data?, errors? }`.
- Resources are `{ id, type, attributes, relationships? }`; wallet/topup/transfer payloads are double-nested (`data.data`).
- Login returns `{ token, user: { data } }`; `GET /transactions` returns the list **directly** under `data`.
- Money is min `1.00`, two-decimal strings. Tokens use `Authorization: Bearer <token>`.