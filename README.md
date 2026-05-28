# trip-cart

A local-first mobile app for planning shopping trips, tracking what you buy where, and seeing where your money actually goes. Built with Expo and React Native.

## What it does

- **Trips** — build a shopping list per trip, check items off as you shop, capture the price you actually paid.
- **Stores** — keep a list of the places you shop and tie each trip to one of them.
- **Catalog** — a personal catalog of goods and categories so trip items autocomplete and stay consistent across trips.
- **Insights** — charts that break down spending by category, store, and time.
- **Settings** — currency, theme (light/dark/system), data export & import, AI category suggestions.

Everything is stored on-device in SQLite. No account, no sync, no network required.

## Stack

- **Expo SDK 54** with the new architecture, **React Native 0.81**, **React 19**
- **expo-router** for file-based routing (see `app/`)
- **expo-sqlite** + **drizzle-orm** for the local database (see `src/db/`)
- **@tanstack/react-query** for data fetching, **@tanstack/react-form** + **zod** for forms
- **victory-native** + **@shopify/react-native-skia** for charts
- **@shopify/flash-list** for long lists, **react-native-reanimated** v4 for animations
- **Jest** + **ts-jest** for unit tests
- **EAS Update** for over-the-air updates

## Layout

```
app/                       expo-router routes
  (tabs)/                  trips · stores · catalog · insights · settings
  onboarding/              first-launch currency + theme picker
  shopping/[id].tsx        active shopping mode for a trip
src/
  db/                      drizzle client, migrations, seed data
  domain/
    entities/              row types (trip, trip-item, good, category, store, setting)
    repositories/          data-access layer used by the UI
    schemas/               zod validation schemas
    backup.ts              export / import the SQLite database
    category-suggest.ts    on-device category suggestion for new goods
  ui/
    components/  forms/  hooks/  providers/  theme/  lib/
docs/                      design notes
```

## Getting started

```bash
npm install
npm run start          # Expo dev server, then press i / a / w
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run web            # web build
```

## Database

Schemas live in `src/db/models/`. After changing a model, regenerate the migration:

```bash
npm run db:generate
```

Migrations are inlined into the JS bundle via `babel-plugin-inline-import` and applied on app start.

## Tests, formatting

```bash
npm test               # jest
npm run format         # prettier --write
npm run format:check   # prettier --check
```
