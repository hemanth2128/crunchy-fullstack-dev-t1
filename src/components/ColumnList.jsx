import { COLUMNS } from '../data/seed.js';
import Column from './Column.jsx';

export default function ColumnList({
  tasks,
  onMove,
  onCyclePriority,
  onDelete,
}) {
  return (
    <div className="column-list">
      {COLUMNS.map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={tasks.filter((task) => task.status === column.id)}
          onMove={onMove}
          onCyclePriority={onCyclePriority}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
