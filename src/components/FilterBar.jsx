export default function FilterBar({
  search,
  priorityFilter,
  onSearchChange,
  onPriorityChange,
  onReset,
  resultCount,
  totalCount,
}) {
  return (
    <section className="filter-bar" aria-label="Filters">
      <input
        type="search"
        className="filter-search"
        placeholder="Search tasks…"
        aria-label="Search tasks"
        value={search}
        onChange={(event) => onSearchChange?.(event.target.value)}
      />
      <select
        className="filter-priority"
        aria-label="Filter by priority"
        value={priorityFilter}
        onChange={(event) => onPriorityChange?.(event.target.value)}
      >
        <option value="all">All priorities</option>
        <option value="high">High priority</option>
        <option value="medium">Medium priority</option>
        <option value="low">Low priority</option>
      </select>
      <span className="filter-count">
        {resultCount} of {totalCount} tasks
      </span>
      <button type="button" className="btn-reset" onClick={onReset}>
        Reset board
      </button>
    </section>
  );
}
