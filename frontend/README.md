# Frontend

React + TypeScript frontend for the Autobahn Safety Monitor.

## Tech Stack

- React
- TypeScript
- Vite

## Start locally

```bash
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Testing

**Unit tests** (Vitest):
```bash
npm test
```

**Unit test coverage report**:
```bash
npm run coverage
open coverage/index.html
```

**End-to-end tests** (Playwright) — requires the app to be running:
```bash
npx playwright test
```

**E2E coverage report** (NYC/Istanbul):
```bash
npx nyc report --reporter=html
open coverage/index.html
```
