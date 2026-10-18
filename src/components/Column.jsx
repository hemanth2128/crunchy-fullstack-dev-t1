import TaskList from './TaskList.jsx';
import EmptyState from './EmptyState.jsx';

export default function Column({
  column,
  tasks,
  onMove,
  onCyclePriority,
  onDelete,
}) {
  return (
    <section className="column" aria-label={`${column.title} column`}>
      <header className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <span className="column-count" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
      </header>
      {tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          onMove={onMove}
          onCyclePriority={onCyclePriority}
          onDelete={onDelete}
        />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
