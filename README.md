# Human Predict Frontend

Frontend application for a human-verified prediction market experience.

## Overview

This app provides:

- Prediction browsing and detail pages
- Creating new predictions
- Viewing resolved results
- User profile view
- Client-side "verification" state for voting flows

Current data and verification behavior are demo-friendly and mostly in-memory:

- Prediction/user data: `src/lib/data.ts`
- Verification/vote context: `src/lib/verification.tsx`

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui + Radix UI
- Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and Run

```bash
cd Frontend
npm install
npm run dev
```

The dev server starts on the URL shown in your terminal (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` — start local development server
- `npm run build` — production build
- `npm run build:dev` — development-mode build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint
- `npm run test` — run tests once (Vitest)
- `npm run test:watch` — run tests in watch mode

## App Routes

- `/` — landing page
- `/predictions` — predictions list
- `/predictions/:id` — prediction details
- `/results` — resolved predictions/results
- `/create` — create prediction page
- `/profile` — user profile

## Project Structure

```text
Frontend/
	src/
		components/      # Reusable UI and feature components
		pages/           # Route-level pages
		lib/             # Data, helpers, and verification context
		hooks/           # Shared custom hooks
		test/            # Test setup and examples
```

## Notes for Integration

- Replace mock data in `src/lib/data.ts` with API-backed state.
- `VerificationProvider` currently uses local state; swap with real auth/identity and backend persistence.
- If integrating smart contracts, add service modules in `src/lib/` and keep UI components presentational.

## Testing

```bash
npm run test
```

For watch mode:

```bash
npm run test:watch
```

## Build

```bash
npm run build
npm run preview
```

## Contributing

1. Create a feature branch
2. Keep changes focused and lint-clean
3. Add/update tests for behavior changes
4. Open a PR with a clear summary
