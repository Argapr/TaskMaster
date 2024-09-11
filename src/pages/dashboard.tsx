import { useState, useEffect } from 'react';
import Image from 'next/image';

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
    try {
      const response = await fetch(`/api/task?taskId=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Update tasks secara lokal setelah task dihapus
      const updatedTasks = tasks.filter((task: any) => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const filteredTasks = tasks.filter((task: any) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">To-Do List</h1>
        <button 
          onClick={logout} 
          className="px-2 py-2"
        >
          <Image src="/assets/out.png" alt="icon logout" width={30} height={30} />
        </button>
      </div>

      {/* Input Search Task */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks"
        className="w-full mt-3 max-w-md px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Wrapper Input Task Baru + Tombol Add Task */}
      <div className="w-full max-w-md flex items-center mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          onClick={addTask} 
          className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
        >
          <Image src="/assets/plus.png" alt="icon add" width={28} height={30} />
        </button>
      </div>

      {/* Daftar Task */}
      <ul className="w-full max-w-md space-y-4 mt-5">
        {filteredTasks.map((task: any) => (
          <li key={task.id} className="flex justify-between items-center p-4 bg-white rounded-md shadow-md">
            <span>{task.title}</span>
            <button 
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Image src="/assets/delete.png" alt="icon delete" width={27} height={30} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
