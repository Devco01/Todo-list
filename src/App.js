import React, { useEffect } from 'react';
import './App.css';
import TodoList from './components/TodoList';

function App() {
  useEffect(() => {
    console.log('App mounted');
  }, []);

  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App; 