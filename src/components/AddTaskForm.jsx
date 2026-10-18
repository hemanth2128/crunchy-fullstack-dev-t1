import { useState } from 'react';
import { COLUMNS, PRIORITIES } from '../data/seed.js';

const TITLE_MAX = 80;
const DESCRIPTION_MAX = 280;

function validate({ title, description }) {
  const errors = {};
  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (trimmedTitle.length > TITLE_MAX) {
    errors.title = `Title must be at most ${TITLE_MAX} characters.`;
  }
  if (description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Description must be at most ${DESCRIPTION_MAX} characters.`;
  }
  return errors;
}

export default function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = validate({ title, description });
  const isValid = Object.keys(errors).length === 0;

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function showError(field) {
    return (submitAttempted || touched[field]) && errors[field];
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);
    if (!isValid) return;
    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setTouched({});
    setSubmitAttempted(false);
  }

  return (
    <form className="add-task-form" aria-label="Add a task" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="new-title">Title</label>
        <input
          id="new-title"
          name="title"
          type="text"
          placeholder="What needs doing?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={() => markTouched('title')}
          aria-invalid={showError('title') || undefined}
          aria-describedby={showError('title') ? 'new-title-error' : undefined}
        />
        {showError('title') && (
          <p className="field-error" id="new-title-error">
            {errors.title}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="new-description">Description</label>
        <input
          id="new-description"
          name="description"
          type="text"
          placeholder="Optional details"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() => markTouched('description')}
          aria-invalid={showError('description') || undefined}
          aria-describedby={
            showError('description') ? 'new-description-error' : undefined
          }
        />
        {showError('description') && (
          <p className="field-error" id="new-description-error">
            {errors.description}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="new-priority">Priority</label>
        <select
          id="new-priority"
          name="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          {PRIORITIES.map((option) => (
            <option key={option} value={option}>
              {option[0].toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="new-status">Column</label>
        <select
          id="new-status"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {COLUMNS.map((column) => (
            <option key={column.id} value={column.id}>
              {column.title}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-primary">
        Add task
      </button>
    </form>
  );
}
