# Architecture

## Overview

SprintDesk is a single-page React application with a layered architecture designed so the mock data source (`mock-data.json`) can be swapped for a real backend with minimal changes outside the `api/` and `services` layer.

```
UI Components
    ↓
Hooks (TanStack Query / custom hooks)
    ↓
API layer (src/api/)
    ↓
Data Source (mock-data.json, DummyJSON, JSONPlaceholder)
```

No component reads `mock-data.json` or calls `fetch`/`axios` directly — every request goes through a function in `src/api/`.

## Folder Structure

```
src/
  api/          Raw data-fetching functions (one file per resource: tasks, users, sprints,
                comments, auth, notifications). The only layer that knows about mock-data.json's
                shape or the external API endpoints.
  hooks/        TanStack Query hooks (useTasks, useUsers, useComments, useLogin) and other
                custom hooks (useToast, useNotificationPolling). Bridges the API layer to
                components; owns loading/error/caching concerns.
  store/        Zustand stores for client-side state: authStore, boardStore, notificationStore,
                toastStore, themeStore. Each persists to localStorage only where it makes sense
                (e.g. board state persists; access tokens deliberately do not).
  components/
    ui/         Reusable design-system components: Button, Input, Select, Modal, Toast,
                Skeleton, DataTable. Generic, no app-specific logic.
    board/      Kanban-specific: Column, TaskCard, TaskDrawer, AddTaskModal.
    layout/     App shell: AppLayout, ProtectedRoute, PublicOnlyRoute, AuthInitializer,
                ThemeToggle.
    analytics/  One component per chart (StatusChart, VelocityChart, PriorityChart,
                CompletionTrendChart), each pairing a Recharts visualization with a
                pure calculation function from lib/analytics.ts.
    notifications/  NotificationPanel.
  pages/        Route-level components (LoginPage, DashboardPage, BoardPage, AnalyticsPage),
                lazy-loaded via React.lazy for route-level code splitting.
  lib/          Small, pure, unit-tested helper functions (getTasksByStatus, getUsersById,
                the four analytics calculation functions).
  types/        Shared TypeScript interfaces for all data shapes.
  data/         mock-data.json — the static seed data, treated as a stand-in backend.
```

## State Management

State is deliberately split into three tiers, per the assignment's guidance:

- **Server state** (TanStack Query): tasks, users, sprints, comments — anything fetched from `mock-data.json` or an external API. Query owns loading/error/caching/refetching.
- **Client state** (Zustand): auth session, the board's working copy of tasks (mutated by drag-and-drop/add/delete before being considered "source of truth" for the UI), notifications, toasts, theme. Persisted to `localStorage` selectively — e.g. `authStore` persists the refresh token but deliberately keeps the access token in memory only.
- **Local component state** (`useState`): form inputs, `isEditing` toggles, drawer draft state — anything that doesn't need to be shared or survive a re-render elsewhere.

## Key Data Flow: Drag-and-Drop

1. User picks up a `TaskCard` (registered as sortable via `@dnd-kit/sortable`, using the task's own numeric `id`).
2. `DndContext` in `BoardPage` fires `onDragEnd` with the dragged item's id and the drop target's id.
3. The handler resolves the drop target to a column status and index, then calls `moveTask(taskId, newStatus, newIndex)` on `boardStore`.
4. `moveTask` removes the task from the flat `tasks` array, reinserts it at the target position within its destination column, and renumbers `order` for that column — all in one array, using `status` and `order` fields rather than a grouped-by-column structure (deliberately chosen to avoid keeping the same information in two places).
5. Zustand's `persist` middleware writes the updated array to `localStorage` automatically.
6. Every `Column` re-renders (filtered from the same flat array), reflecting the new arrangement immediately.

## Authentication Flow

- Login posts to DummyJSON, storing the access token in memory only (`authStore`, no `persist` on that field) and the refresh token in `localStorage`.
- An axios response interceptor (`src/api/axiosInstance.ts`) catches `401` responses, calls `/auth/refresh` using the stored refresh token, updates the access token, and retries the original failed request — transparently, so calling code never has to think about token expiry.
- On app load, `AuthInitializer` attempts a silent refresh using any persisted refresh token before rendering the rest of the app, showing a full-screen loading state during that check — this is what allows a session to survive a page refresh even though the access token itself is never persisted.

## Testing Approach

- **Pure functions** (`lib/analytics.ts`, `lib/board.ts`, `api/tasks.ts`) are tested directly with plain input/output assertions — no rendering required.
- **Zustand stores** are tested by calling actions directly via `useStore.getState()` and asserting on the resulting state, with a `resetStore` action added specifically to keep tests isolated from each other.
- **Hooks** (`useToast`) are tested with `@testing-library/react`'s `renderHook`.
- **The auth interceptor's refresh-and-retry behavior** is tested using MSW (Mock Service Worker) to intercept real axios calls at the network layer, simulating a `401` followed by a successful refresh — verifying the actual retry logic runs end-to-end rather than mocking axios internals by hand.
