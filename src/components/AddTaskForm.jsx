export default function AddTaskForm() {
  return (
    <form className="add-task-form" aria-label="Add a task">
      <div className="form-field">
        <label htmlFor="new-title">Title</label>
        <input
          id="new-title"
          name="title"
          type="text"
          placeholder="What needs doing?"
          defaultValue=""
        />
      </div>
      <div className="form-field">
        <label htmlFor="new-description">Description</label>
        <input
          id="new-description"
          name="description"
          type="text"
          placeholder="Optional details"
          defaultValue=""
        />
      </div>
      <div className="form-field">
        <label htmlFor="new-priority">Priority</label>
        <select id="new-priority" name="priority" defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="new-status">Column</label>
        <select id="new-status" name="status" defaultValue="todo">
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <button type="submit" className="btn-primary">
        Add task
      </button>
    </form>
  );
}
