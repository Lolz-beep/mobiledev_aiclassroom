import React, { useState, useMemo } from 'react';
import { Trash2, Edit2, CheckCircle, Circle, Search, Plus } from 'lucide-react';
import "./global.css"

const generateUniqueId = () => Date.now().toString() + Math.random().toString(36).substring(2);

const TodoItem = ({ item, onDelete, onToggleComplete, onEdit }) => {
  const isCompleted = item.completed;
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleSaveEdit = () => {
    if (editText.trim() !== '') {
      onEdit(item.id, editText.trim());
      setIsEditingTask(false);
    }
  };

  return (
    <div 
      className={`flex items-center justify-between p-4 my-2 rounded-xl shadow-lg transition-all 
                  ${isCompleted ? 'bg-indigo-50 border-l-4 border-indigo-400 opacity-75' : 'bg-white border-l-4 border-white'}`}
    >
      
      {/* Task Content */}
      <div className="flex-1 flex items-center mr-3">
        {/* Completion Toggle Icon */}
        <button
          onClick={() => onToggleComplete(item.id)}
          className="mr-3 p-1 rounded-full transition-transform hover:scale-110"
          aria-label={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
        >
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-indigo-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-400" />
          )}
        </button>

        {/* Task Text/Edit Input */}
        {isEditingTask ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); }}
            autoFocus
            className="flex-1 text-lg text-gray-800 bg-gray-100 p-2 rounded-md border border-indigo-300 focus:outline-none"
            aria-label="Edit task content"
          />
        ) : (
          <span
            className={`text-lg cursor-pointer ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}
            onDoubleClick={() => setIsEditingTask(true)}
          >
            {item.text}
          </span>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2">
        {/* Edit Button (Visible when not completed and not currently editing) */}
        {!isCompleted && !isEditingTask && (
            <button
              onClick={() => setIsEditingTask(true)}
              className="p-2 text-indigo-500 hover:text-indigo-700 transition duration-150 rounded-full hover:bg-indigo-100"
              aria-label="Edit task"
            >
              <Edit2 className="w-5 h-5" />
            </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-red-500 hover:text-red-700 transition duration-150 rounded-full hover:bg-red-100"
          aria-label="Delete task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


export default function App() {
  const [listTitle, setListTitle] = useState('My Awesome To-Do List');
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [tasks, setTasks] = useState([
    { id: generateUniqueId(), text: 'Do homework', completed: false },
    { id: generateUniqueId(), text: 'Do assignment', completed: false },
    { id: generateUniqueId(), text: 'Regret your life decision', completed: true },
    { id: generateUniqueId(), text: 'Go to sleep', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [searchText, setSearchText] = useState('');

  // 1. Edit Title Logic
  const handleEditTitle = () => {
    setIsTitleEditing(true);
  };
  
  const handleTitleBlur = () => {
    setIsTitleEditing(false);
    if (listTitle.trim() === '') {
      setListTitle('My Awesome To-Do List');
    }
  };

  // 5. Add Task Logic
  const handleAddTask = () => {
    if (newTaskText.trim().length === 0) return;

    const newTodo = {
      id: generateUniqueId(),
      text: newTaskText.trim(),
      completed: false,
    };

    // 2. Auto Reload when adding
    setTasks([newTodo, ...tasks]);
    setNewTaskText('');
  };

  // 4. Delete Task Logic
  const handleDeleteTask = (id) => {
    // 2. Auto Reload when deleting
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Toggle Completion (Edit Status Logic)
  const handleToggleComplete = (id) => {
    // 2. Auto Reload when editing status
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // 1. Edit Task Text Logic
  const handleEditTask = (id, newText) => {
    // 2. Auto Reload when editing text
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: newText } : task
    ));
  };


  // 3. Search Task Logic
  const filteredTasks = useMemo(() => {
    const lowercasedSearch = searchText.toLowerCase().trim();
    
    // Sort tasks: Incomplete tasks first, then completed tasks
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.text.localeCompare(b.text);
    });

    if (lowercasedSearch === '') {
      return sortedTasks;
    }
    
    return sortedTasks.filter(task =>
      task.text.toLowerCase().includes(lowercasedSearch)
    );
  }, [tasks, searchText]);


  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 mt-10">
        
        {/*Editable Title Section */}
        <div className="mb-8 text-center">
          {isTitleEditing ? (
            <input
              type="text"
              className="text-3xl md:text-4xl font-extrabold text-gray-800 border-b-4 border-indigo-500 p-2 w-full text-center focus:outline-none bg-gray-50 rounded-lg transition-colors duration-200"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => { if (e.key === 'Enter') handleTitleBlur(); }}
              autoFocus
              aria-label="Edit list title"
            />
          ) : (
            <button onClick={handleEditTitle} className="group focus:outline-none">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors duration-200">
                {listTitle}
              </h1>
              <span className="block text-sm text-indigo-400 mt-1 transition-opacity opacity-0 group-hover:opacity-100">Click to Edit Title</span>
            </button>
          )}
        </div>

        {/*Search Task Input*/}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Search your tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search tasks"
          />
        </div>

        {/* Add Task Input Section*/}
        <div className="flex items-center mb-10 space-x-3">
          <input
            type="text"
            className="flex-1 h-14 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-gray-800 placeholder-indigo-400 shadow-md focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all focus:outline-none"
            placeholder="What do you need to do?"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
            aria-label="New task input"
          />
          <button
            onClick={handleAddTask}
            className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl hover:bg-indigo-700 transition-transform duration-200 transform hover:scale-105"
            aria-label="Add task"
          >
            <Plus className="w-7 h-7 text-white" />
          </button>
        </div>

        {/*Task List*/}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(item => (
              <TodoItem
                key={item.id}
                item={item}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
              />
            ))
          ) : (
            <div className="text-center mt-10 p-5 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
              <p className="text-lg text-gray-500">
                {searchText ? "No tasks found matching your search." : "Your to-do list is empty! Add a task above."}
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
