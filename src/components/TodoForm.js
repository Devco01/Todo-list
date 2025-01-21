import React, { useState } from 'react';

function TodoForm({ onSubmit, selectedDate }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert("La tâche ne peut pas être vide !");
      return;
    }
    onSubmit(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nouvelle tâche..."
        required
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default TodoForm; 