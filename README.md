## to test
replace files "sboouaa_****.tsx/css" to normal names

## Project structure

```text
app/
  profile/                 Profile page
  settings/                Settings pages and section layout
  globals.css              Global theme tokens and base styles
  layout.tsx               Application shell

components/
  profile/                 Profile header, posts, and post viewer
  settings/                Settings cards and preference rows
  shell/                   Sidebar, top bar, account menu, and footer
  ui/                      Reusable buttons, fields, switches, and toasts

lib/
  mock-data.ts             Current user, profile stats, and posts
  mock-post-details.ts     Post captions, likes, and comments
  settings.ts              Settings section definitions

public/
  posts/                   Profile post images
  logo.jpg                 Application logo
  pucci.jpg                Profile avatar
```

## Requirements

- Node.js 20.9 or newer
- npm

## Installation

```bash
npm install
```

## Development

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Validation

Run ESLint:

```bash
npm run lint
```

Run the TypeScript compiler without emitting files:

```bash
npx tsc --noEmit
```

Recommended complete check:

```bash
npm run lint && npx tsc --noEmit && npm run build
```

## Main routes

- `/profile` — profile header, statistics, and posts
- `/settings/profile` — profile details and avatar
- `/settings/account` — email, phone, language, and time zone
- `/settings/notifications` — notification preferences
- `/settings/privacy` — visibility and discoverability preferences
- `/settings/security` — password and security preferences

