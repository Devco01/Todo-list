import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import FilterButtons from './FilterButtons';

function TodoList() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos);
      } catch (error) {
        console.error('Erreur lors du chargement des todos:', error);
        return [];
      }
    }
    return [];
  });
  const [filter, setFilter] = useState(() => {
    const savedFilter = localStorage.getItem('selectedFilter');
    return savedFilter || 'all';
  });
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Obtenir la date et l'heure actuelles en France
  const now = new Date();
  const currentTime = now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Paris'
  });
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem('selectedDate');
    return savedDate || now.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState(currentTime);

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
      console.log('Todos sauvegardés:', todos);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des todos:', error);
    }
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('selectedFilter', filter);
  }, [filter]);

  useEffect(() => {
    console.log('TodoList mounted');
  }, []);

  const addTodo = (text) => {
    if (!text.trim()) return;
    setTodos([...todos, { 
      id: Date.now(), 
      text, 
      completed: false,
      date: selectedDate,
      time: selectedTime
    }]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Grouper les todos par date
  const todosByDate = todos.reduce((acc, todo) => {
    if (!acc[todo.date]) {
      acc[todo.date] = [];
    }
    acc[todo.date].push(todo);
    return acc;
  }, {});

  console.log('Todos:', todos);
  console.log('TodosByDate:', todosByDate);
  console.log('SelectedDate:', selectedDate);

  const clearTodos = () => {
    if (window.confirm('Voulez-vous vraiment supprimer toutes les tâches ?')) {
      setTodos([]);
      localStorage.removeItem('todos');
      localStorage.removeItem('selectedDate');
      localStorage.removeItem('selectedFilter');
    }
  };

  return (
    <div className="app-container">
      <div className="calendar-container">
        <h2>Calendrier</h2>
        <div className="datetime-picker">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="time-picker"
          />
        </div>
        <div className="date-todos">
          {Object.entries(todosByDate).length > 0 ? (
            Object.entries(todosByDate).map(([date, dateTodos]) => (
              <div key={date} className="date-group">
                <h3>{new Date(date).toLocaleDateString('fr-FR')}</h3>
                <ul>
                  {dateTodos.map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                      <span className="todo-time">{todo.time}</span>
                      {todo.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>Aucune tâche planifiée</p>
          )}
        </div>
      </div>

      <div className="todo-container">
        <h1>Ma Todo List</h1>
        <TodoForm onSubmit={addTodo} selectedDate={selectedDate} />
        <FilterButtons filter={filter} setFilter={setFilter} />
        <button 
          onClick={clearTodos}
          className="clear-btn"
          style={{
            marginTop: '20px',
            backgroundColor: '#dc3545',
            opacity: 0.7
          }}
        >
          Effacer tout
        </button>
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              {editingId === todo.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                  />
                  <button onClick={() => saveEdit(todo.id)}>Sauvegarder</button>
                  <button onClick={() => setEditingId(null)}>Annuler</button>
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                  <div className="todo-actions">
                    <button className="edit-btn" onClick={() => startEditing(todo.id, todo.text)}>
                      Modifier
                    </button>
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoList; 