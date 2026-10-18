# STATE.md — Task Tracker (Kanban)

Written before any component code, per the brief. This document is the source of
truth for where state lives and why. Components were designed *around* this shape,
not the other way round.

## 1. Domain

A small kanban board. Three fixed columns (`todo`, `in-progress`, `done`), tasks
that move between them, priority badges, search + filter, and an add-task form.

### Entity: Task

```js
{
  id: string,            // crypto.randomUUID() — stable identity, never an index
  title: string,         // required, 3–80 chars (trimmed)
  description: string,   // optional, ≤280 chars
  priority: 'low' | 'medium' | 'high',
  status: 'todo' | 'in-progress' | 'done',
  createdAt: number,     // Date.now() — deterministic tie-break for sorting
}
```

Columns are **not** state: the three columns are fixed product config, a constant
(`COLUMNS` in `src/data/seed.js`). Only tasks and UI state change.

## 2. State shape

```js
// Board (the lifted owner) — useState:
tasks: Task[]                              // the one source of truth for domain data
search: string                             // controlled by FilterBar input
priorityFilter: 'all' | 'low' | 'medium' | 'high'   // controlled by FilterBar select

// AddTaskForm (local form state) — useState:
title: string                              // controlled input
description: string                        // controlled input
priority: 'low' | 'medium' | 'high'        // controlled select
status: 'todo' | 'in-progress' | 'done'    // controlled select (starting column)
touched: { title: boolean, description: boolean }   // when to show errors
submitAttempted: boolean                   // reveal all errors on failed submit

// Derived during render — NEVER state, NEVER useEffect:
validate(formValues) → errors object       // pure function, computed every render
visibleTasks = tasks.filter(...).sort(...) // filter + sort, computed every render
tasksByStatus = { todo: [], ... }          // grouping, computed every render
counts = { 'todo': n, ... }                // column counts, computed every render
```

## 3. What lives where, and why

| State | Owner | Why this owner (lowest common ancestor) |
|---|---|---|
| `tasks` | `Board` | Every column, every card, and the add-form all read or write it. `Board` is the first node that contains all of them. Not `App` — `App` has no sibling that needs tasks. |
| `search`, `priorityFilter` | `Board` | Written by `FilterBar`, read by `ColumnList` (to compute `visibleTasks`). Their LCA is `Board`. |
| form fields, `touched`, `submitAttempted` | `AddTaskForm` | Nothing outside the form ever reads a half-typed draft. If a future "edit task" modal duplicated this logic, the fields would move up — until then, local is correct. |
| `errors` | *not stored* | Pure function of the field values. Storing it would require syncing (a useEffect) every keystroke — the exact anti-pattern the brief warns about. |
| `visibleTasks`, `tasksByStatus`, counts | *not stored* | Derived data. Recomputed cheaply during render; storing it would need a sync effect and risk stale copies. |
| column config | *not stored* | Constant (`COLUMNS`). Nothing can change it at runtime. |

## 4. Data flow

```
Board ──onAddTask(draft)──────► AddTaskForm        (form validates, Board assigns id + createdAt)
Board ──onSearchChange/…──────► FilterBar          (controlled inputs)
Board ──visibleTasks─────────► ColumnList          (derived prop, computed in Board's render)
ColumnList ──tasksByStatus───► Column ×3
Column ──onMove/onCycle/…────► TaskCard            (callbacks only; state changes stay in Board)
```

Callbacks flow down, state stays in `Board`. Cards never touch state directly —
they call `onMoveTask(id, direction)`, `onCyclePriority(id)`, `onDeleteTask(id)`
and `Board` does one `setTasks(prev => …)` update.

## 5. Component tree

```
App
└── Board                          [useState: tasks, search, priorityFilter]
    │                              [useLocalStorage ×2 (custom hook): persistence]
    │                              [useEffect: document.title ← tasks]
    ├── FilterBar                  (controlled: search, priorityFilter)
    ├── AddTaskForm                [useState: title, description, priority, status,
    │                               touched, submitAttempted]
    │                               → onAddTask(draft)
    └── ColumnList                 (derived: visibleTasks grouped by status)
        └── Column ×3              (props: status, title, tasks, callbacks)
            ├── TaskList           (maps tasks → cards)
            │   └── TaskCard ×n    key={task.id}  ← stable id, never index
            └── EmptyState         (shown when tasks.length === 0)
```

9 components total (8 + `App`), each with a single responsibility.

## 6. Custom hook: `useLocalStorage(key, initialValue)`

```js
const [tasks, setTasks] = useLocalStorage('t2.tasks', seedTasks);
const [filters, setFilters] = useLocalStorage('t2.filters', { search: '', priorityFilter: 'all' });
```

**Why this hook:** persistence logic (lazy initial read from localStorage, JSON
serialise, try/catch on corrupt data) appeared for `tasks` *and* for `filters` —
two call sites, identical logic. Extracting it removes the repetition and keeps
`Board` focused on domain rules, not storage plumbing.

## 7. Effects inventory (every useEffect in the app)

| Location | Purpose | Deps | Why it's a real effect |
|---|---|---|---|
| `useLocalStorage` | write value → localStorage when it changes | `[key, value]` | I/O with the outside world (browser storage). Cannot be done during render. |
| `Board` | sync `document.title` with open-task count | `[tasks]` | Side effect on an external system (the DOM/tab). Not derived app state. |

Nothing else uses `useEffect`. Filters, grouping, sorting, counts, and validation
are all computed **during render**.

## 8. Keys & reordering

- Every list renders with `key={task.id}` (a `crypto.randomUUID()` string assigned
  once when the task is created).
- Two operations **reorder** lists: moving a task between columns (it enters a
  different list at a new position), and cycling a task's priority (the
  within-column sort is priority → `createdAt`, so the card jumps position).
- Because keys are stable ids, React reconciles by identity — no state inside a
  card would ever be mis-attached after a reorder. An index key would break here.

## 9. Persistence & reset

- `t2.tasks` — the board survives reload.
- `t2.filters` — search/filter survive reload.
- Corrupt/absent storage falls back to seed data (try/catch in the hook).
- A "Reset board" control restores seed data (also exercises the hook's setter).

## 10. React version & rules

React 18 (`createRoot`), Vite, functional components + hooks only. No class
components, no Redux, no `useEffect` for derived state.
