import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    // return savedTodos ? JSON.parse(saveTodos) : [];
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // const [filter, setFilter] = useState('all');
  // const [editingId, setEditingId] = useState(null);
  
  const [newTodo, setNewTodo] = useState({
    title: '',
    details: '',
    deadline: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

 const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    
    const todo = {
      id: Date.now(),
      ...newTodo,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
  setTodos([todo, ...todos]);
    setNewTodo({
      title: '',
      details: '',
      // date: '',
      deadline: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setNewTodo({
      title: todo.title,
      details: todo.details,
      deadline: todo.deadline,
    });
  };

  const updateTodo = (e) => {
    e.preventDefault();
    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, ...newTodo } : todo
    ));
    setEditingId(null);
    setNewTodo({
      title: '',
      details: '',
      deadline: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <div className="todo-card">
        <h1 className="todo-title">Todo App</h1>
        
        <form onSubmit={editingId ? updateTodo : addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Title"
            className="todo-input"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Details"
            className="todo-input"
            value={newTodo.details}
            onChange={(e) => setNewTodo({ ...newTodo, details: e.target.value })}
          />
          <input
            type="date"
            className="todo-input"
            value={newTodo.deadline}
            onChange={(e) => setNewTodo({ ...newTodo, deadline: e.target.value })}
          />
          <button type="submit" className="todo-button primary">
            {editingId ? 'Update Todo' : 'Add Todo'}
          </button>
        </form>

        <div className="filter-buttons">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          {/* <button
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Done
          </button> */}
        </div>

        <div className="todo-list">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <div className="todo-item-content">
              {/* <h4 className="todo-item-title">{todo.title}</h4> */}
                <h3 className="todo-item-title">{todo.title}</h3>
                <p className="todo-item-details">{todo.details}</p>
                <p className="todo-item-deadline">
                  Deadline: {format(new Date(todo.deadline), 'MMM dd, yyyy')}
                </p>
              </div>
        <div className="todo-item-buttons">
            <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`todo-button small ${todo.completed ? 'yellow' : 'green'}`}
                >
                  {todo.completed ? <FaTimes /> : <FaCheck />}
                </button>
                <button
                  onClick={() => startEditing(todo)}
                 className="todo-button small blue"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="todo-button small red"
                >
                <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;

