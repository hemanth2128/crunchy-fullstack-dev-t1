import { STATUS_ORDER } from '../data/seed.js';

export default function TaskCard({ task, onMove, onCyclePriority, onDelete }) {
  const statusIndex = STATUS_ORDER.indexOf(task.status);
  const isFirst = statusIndex === 0;
  const isLast = statusIndex === STATUS_ORDER.length - 1;

  return (
    <li className="task-card">
      <div className="task-card-main">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <button
          type="button"
          className={`priority-badge priority-${task.priority}`}
          onClick={() => onCyclePriority?.(task.id)}
          title="Click to change priority"
          aria-label={`Priority ${task.priority}. Click to change.`}
        >
          {task.priority}
        </button>
      </div>
      <div className="task-actions">
        <button
          type="button"
          onClick={() => onMove?.(task.id, -1)}
          disabled={isFirst}
          aria-label={`Move "${task.title}" left`}
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => onMove?.(task.id, 1)}
          disabled={isLast}
          aria-label={`Move "${task.title}" right`}
        >
          →
        </button>
        <button
          type="button"
          className="task-delete"
          onClick={() => onDelete?.(task.id)}
          aria-label={`Delete "${task.title}"`}
        >
          ×
        </button>
      </div>
    </li>
  );
}
