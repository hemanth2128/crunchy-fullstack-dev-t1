import Board from './components/Board.jsx';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Tracker</h1>
        <p className="app-subtitle">A kanban board built state-outward</p>
      </header>
      <Board />
    </div>
  );
}
