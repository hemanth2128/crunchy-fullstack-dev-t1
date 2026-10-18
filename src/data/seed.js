export const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const STATUS_ORDER = COLUMNS.map((column) => column.id);

export const PRIORITIES = ['low', 'medium', 'high'];

export const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

export const PRIORITY_NEXT = { low: 'medium', medium: 'high', high: 'low' };

export const seedTasks = [
  {
    id: 'seed-1',
    title: 'Sketch the board on paper',
    description: 'Circle every piece of changing data before writing components.',
    priority: 'high',
    status: 'todo',
    createdAt: Date.UTC(2026, 9, 10, 9),
  },
  {
    id: 'seed-2',
    title: 'Write STATE.md',
    description: 'State shape, ownership table, component tree diagram.',
    priority: 'high',
    status: 'done',
    createdAt: Date.UTC(2026, 9, 9, 14),
  },
  {
    id: 'seed-3',
    title: 'Scaffold Vite + React 18',
    description: 'Functional components and hooks only.',
    priority: 'medium',
    status: 'done',
    createdAt: Date.UTC(2026, 9, 11, 10),
  },
  {
    id: 'seed-4',
    title: 'Build the controlled add-task form',
    description: 'Title required (3-80 chars), description up to 280.',
    priority: 'high',
    status: 'in-progress',
    createdAt: Date.UTC(2026, 9, 13, 11),
  },
  {
    id: 'seed-5',
    title: 'Extract useLocalStorage hook',
    description: 'Persistence showed up twice: tasks and filters.',
    priority: 'medium',
    status: 'todo',
    createdAt: Date.UTC(2026, 9, 14, 9),
  },
  {
    id: 'seed-6',
    title: 'Clear every console warning',
    description: 'Keys, dependency arrays, controlled inputs.',
    priority: 'medium',
    status: 'todo',
    createdAt: Date.UTC(2026, 9, 15, 16),
  },
  {
    id: 'seed-7',
    title: 'Deploy to Vercel',
    description: 'Push the task-2 branch and grab the live URL.',
    priority: 'low',
    status: 'todo',
    createdAt: Date.UTC(2026, 9, 16, 12),
  },
];

export function sortTasks(a, b) {
  const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (byPriority !== 0) return byPriority;
  return b.createdAt - a.createdAt;
}
