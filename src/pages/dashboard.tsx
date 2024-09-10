import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/task?userId=${user.id}`)
        .then((response) => response.json())
        .then((data) => setTasks(data));
    }
  }, [user]);

  const addTask = async () => {
    if (!newTask) return;

    await fetch('/api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTask, userId: user.id }),
    });

    setNewTask('');
    fetch(`/api/task?userId=${user.id}`)
      .then((response) => response.json())
      .then((data) => setTasks(data));
  };

  const deleteTask = async (id: number) => {
    await fetch(`/api/task/${id}`, {
      method: 'DELETE',
    });

    fetch(`/api/task?userId=${user.id}`)
      .then((response) => response.json())
      .then((data) => setTasks(data));
  };

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const filteredTasks = tasks.filter((task: any) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>To-Do List</h1>
      <button onClick={logout}>Logout</button> {/* Tombol Logout */}

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks"
      />

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {filteredTasks.map((task: any) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
