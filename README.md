# SprintDesk — Sprint Management Dashboard

A sprint management dashboard with authentication, drag-and-drop Kanban board, analytics, notifications, and light/dark theming. Built with React 19, TypeScript, TanStack Query, Zustand, Tailwind v4, and @dnd-kit.

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`. No environment variables required — all APIs (DummyJSON, JSONPlaceholder) are public and keyless.

**Test login:** `emilys` / `emilyspass` (any DummyJSON account works)

## Testing

```bash
npm run test
```

15 tests covering the board store, `useToast`, and the auth interceptor's refresh/retry flow (via MSW).

> Node 25+: if you hit `localStorage` test errors, this is a known Node/jsdom conflict, already worked around via `NODE_OPTIONS=--no-webstorage` in the test script.

## Architecture

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for system design and data flow.

## Known Limitations

- **Comments don't persist** across drawer close/refresh — they're session-local state, since `mock-data.json` can't be written back to and the spec doesn't require this persistence explicitly. Pre-existing mock comments always display correctly.
- **Dark mode** covers all core pages and components except the Login page (no toggle is reachable from it).
- **Keyboard drag-and-drop reordering** isn't implemented (cards are keyboard-focusable/clickable, but not keyboard-draggable).
- Bonus features not implemented: Remember Me, password strength meter, undo drag, priority/assignee filters, Storybook, axe-core, chart date filtering/export.

## Security

No credentials or API keys are committed — DummyJSON and JSONPlaceholder require none.
