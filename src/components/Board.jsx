import { useEffect, useMemo } from 'react';
import {
  PRIORITY_NEXT,
  STATUS_ORDER,
  seedTasks,
  sortTasks,
} from '../data/seed.js';
import useLocalStorage from '../hooks/useLocalStorage.js';
import FilterBar from './FilterBar.jsx';
import AddTaskForm from './AddTaskForm.jsx';
import ColumnList from './ColumnList.jsx';

export default function Board() {
  const [tasks, setTasks] = useLocalStorage('t2.tasks', seedTasks);
  const [search, setSearch] = useLocalStorage('t2.search', '');
  const [priorityFilter, setPriorityFilter] = useLocalStorage(
    't2.priorityFilter',
    'all',
  );

  useEffect(() => {
    const openCount = tasks.filter((task) => task.status !== 'done').length;
    document.title = `Task Tracker — ${openCount} open`;
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks
      .filter((task) => {
        const matchesSearch =
          query === '' ||
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query);
        const matchesPriority =
          priorityFilter === 'all' || task.priority === priorityFilter;
        return matchesSearch && matchesPriority;
      })
      .sort(sortTasks);
  }, [tasks, search, priorityFilter]);

  function handleAddTask(draft) {
    const task = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...draft,
    };
    setTasks((prev) => [task, ...prev]);
  }

  function handleMoveTask(id, direction) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const index = STATUS_ORDER.indexOf(task.status);
        const next = index + direction;
        if (next < 0 || next >= STATUS_ORDER.length) return task;
        return { ...task, status: STATUS_ORDER[next] };
      }),
    );
  }

  function handleCyclePriority(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, priority: PRIORITY_NEXT[task.priority] }
          : task,
      ),
    );
  }

  function handleDeleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function handleReset() {
    setTasks(seedTasks);
    setSearch('');
    setPriorityFilter('all');
  }

  return (
    <main className="board">
      <div className="toolbar">
        <FilterBar
          search={search}
          priorityFilter={priorityFilter}
          onSearchChange={setSearch}
          onPriorityChange={setPriorityFilter}
          onReset={handleReset}
          resultCount={visibleTasks.length}
          totalCount={tasks.length}
        />
      </div>
      <AddTaskForm onAddTask={handleAddTask} />
      <ColumnList
        tasks={visibleTasks}
        onMove={handleMoveTask}
        onCyclePriority={handleCyclePriority}
        onDelete={handleDeleteTask}
      />
    </main>
  );
}
