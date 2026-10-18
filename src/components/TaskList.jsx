import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, onMove, onCyclePriority, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onMove={onMove}
          onCyclePriority={onCyclePriority}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
