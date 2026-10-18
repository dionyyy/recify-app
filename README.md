# Recify

AI-powered recipe app for iOS and Android, built with Expo and React Native. Browse recipes from TheMealDB and use Google Gemini to generate custom recipes, plan meals, cook with a chat assistant, repurpose leftovers, and build smart grocery lists. Offline-first by design.

## Features

- **Recipe discovery** — browse, search, and filter recipes by category and cuisine (TheMealDB)
- **AI recipe generator** — create custom recipes from the ingredients you have
- **Meal planner** — generate multi-day meal plans tailored to calories, budget, cuisine, and dietary needs
- **Cooking assistant** — streaming AI chat for real-time cooking help and substitutions
- **Leftover recipes** — turn leftover ingredients into new meals
- **Smart grocery lists** — AI-organized shopping lists grouped by store section, with checkable items
- **Favorites** — save recipes (API and AI-generated), stored on-device
- **Light / dark / system theming** with full dark-mode support
- **Offline-first** — favorites, meal plans, chat history, and shopping lists persist locally

## Tech stack

| Area | Technology |
|------|-----------|
| Framework | Expo SDK 54, React Native 0.81, React 19 (New Architecture, Hermes) |
| Language | TypeScript 5.9 (strict) |
| Navigation | Expo Router v6 (typed routes) |
| Styling | NativeWind v4 (Tailwind CSS), custom UI component library |
| State | Zustand v5 |
| Server state | TanStack Query v5 |
| Forms | react-hook-form + zod |
| Animation | react-native-reanimated v4 |
| Local storage | expo-sqlite, react-native-mmkv, expo-secure-store |
| AI | Google Gemini (`@google/generative-ai`) |
| Recipe data | TheMealDB API |

## Project structure

```
src/
├── app/            # Expo Router screens (tabs, auth, recipe, ai, settings)
├── components/ui/  # Reusable UI primitives (Button, Card, Input, etc.)
├── constants/      # App-wide constants and config
├── features/       # Feature hooks (recipe queries, search)
├── hooks/          # Shared hooks (color scheme, haptics)
├── services/       # ai (Gemini), api (TheMealDB), database (SQLite), storage
├── store/          # Zustand stores (auth, favorites, meal planner, etc.)
├── theme/          # Design tokens (colors, typography, spacing)
└── utils/          # Helpers, formatters, validators
```

## Getting started

### Prerequisites

- **Node 22 LTS** (a `.nvmrc` is included — run `nvm use`)
- **Xcode** (for the iOS Simulator) and/or **Android Studio** (for the Android emulator)
- A **Google Gemini API key** for the AI features

### Setup

1. Install dependencies:

   ```bash
   nvm use
   npm install
   ```

2. Create a `.env` file in the project root (see `.env.example`):

   ```bash
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   EXPO_PUBLIC_MEALDB_BASE_URL=https://www.themealdb.com/api/json/v1/1
   ```

### Run

This project uses native modules (MMKV, SQLite, Reanimated) that require a development build — Expo Go is not supported.

```bash
# Build and launch on the iOS simulator (first run compiles natively)
npx expo run:ios

# Or start the dev server against an installed dev build
npx expo start --dev-client
```

Press `i` to open iOS, `a` for Android.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run ios` | Start and open the iOS simulator |
| `npm run android` | Start and open the Android emulator |
| `npm run web` | Start the web build |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run lint` | Lint with ESLint |

## Notes

- **Authentication is mock/local** — there is no backend. Any valid email and a 6+ character password will sign you in; credentials are not verified against a server.
- **The Gemini key is client-side.** `EXPO_PUBLIC_`-prefixed variables are bundled into the app, so the key ships inside any build. For a production release, proxy AI requests through a backend and restrict the key.

## License

MIT
