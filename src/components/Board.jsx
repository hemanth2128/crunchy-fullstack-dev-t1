import { seedTasks } from '../data/seed.js';
import FilterBar from './FilterBar.jsx';
import AddTaskForm from './AddTaskForm.jsx';
import ColumnList from './ColumnList.jsx';

export default function Board() {
  const tasks = seedTasks;

  return (
    <main className="board">
      <div className="toolbar">
        <FilterBar
          search=""
          priorityFilter="all"
          resultCount={tasks.length}
          totalCount={tasks.length}
        />
      </div>
      <AddTaskForm />
      <ColumnList tasks={tasks} />
    </main>
  );
}
