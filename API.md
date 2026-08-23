# API Documentation

SprintDesk talks to three data sources. This document covers every request the app makes, grouped by source.

## 1. DummyJSON — Authentication

Base URL: `https://dummyjson.com`

### POST `/auth/login`

Request body:
```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 1
}
```
> `expiresInMins` is deliberately short (1 minute) to make the silent token-refresh flow observable during testing/demo, rather than waiting the default 60 minutes.

Response `200`:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128"
}
```

Used by: `src/api/auth.ts` → `loginRequest()`, consumed via `src/hooks/useLogin.ts`.

### POST `/auth/refresh`

Request body:
```json
{
  "refreshToken": "eyJ...",
  "expiresInMins": 1
}
```

Response `200`:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

Used by: `src/api/auth.ts` → `refreshRequest()`. Called automatically in two places:
- `src/api/axiosInstance.ts`'s response interceptor, whenever any authenticated request receives a `401`.
- `src/components/layout/AuthInitializer.tsx`, once on app load, to silently restore a session from a persisted refresh token.

All other authenticated requests attach `Authorization: Bearer <accessToken>` automatically via a request interceptor in `src/api/axiosInstance.ts`.

## 2. Mock Data (`src/data/mock-data.json`)

Treated as a stand-in backend. Every "endpoint" below is a function in `src/api/` that reads from this file with a small artificial delay (200–300ms) to simulate network latency and allow loading states to be observable.

| Function | File | Returns |
|---|---|---|
| `fetchTasks()` | `api/tasks.ts` | First 30 tasks |
| `fetchUsers()` | `api/users.ts` | All users |
| `fetchSprints()` | `api/sprints.ts` | All sprints |
| `fetchCommentsByTaskId(taskId)` | `api/comments.ts` | Comments filtered to one task |

None of these are called directly by components — each is wrapped by a TanStack Query hook (`useTasks`, `useUsers`, `useSprints`, `useComments`) that owns loading/error/caching state.

> Note: `Task.assigneeId` and `Comment.authorId` are foreign keys into the `users` array — when creating a task or comment client-side (e.g. via `AddTaskModal`), `assigneeId`/`authorId` must reference a real user `id` from `fetchUsers()` for the assignee/author name to resolve correctly elsewhere in the UI.

## 3. JSONPlaceholder — Notification Polling

Base URL: `https://jsonplaceholder.typicode.com`

### GET `/posts?_limit=5`

Polled every 15 seconds while the tab is visible (paused via the Page Visibility API when the tab is hidden, resumed on return). Since this endpoint always returns the same 5 static posts, each poll generates a fresh unique notification `id` (`Date.now() + post.id`) and a fresh `createdAt` timestamp client-side — this is what "new post IDs" means in this implementation, since the underlying data itself never changes.

Used by: `src/api/notifications.ts` → `fetchNotificationPosts()`, called from `src/hooks/useNotificationPolling.ts`.
