import { useEffect, useState } from 'react';
import { type Task } from './types/Task';
import { createTask, deleteTask, getTasks, updateTask } from './services/taskService';
import TaskForm from './components/TaskForm/TaskForm';
import TaskList from './components/TaskList/TaskList';
import { getTasksFromLocal, saveTasksToLocal } from './utils/localStorage';
import './index.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    getTasks()
      .then(data => {
        setTasks(data);
        saveTasksToLocal(data);
      })
      .catch(() => {
        const local = getTasksFromLocal();
        setTasks(local);
      });
  }, []);

  const handleCreate = async (task: Task) => {
    try {
      const newTask = await createTask(task);
      const updated = [...tasks, newTask];
      setTasks(updated);
      saveTasksToLocal(updated);
    } catch {
      const fakeTask = { ...task, _id: `local-${Date.now()}` };
      const updated = [...tasks, fakeTask];
      setTasks(updated);
      saveTasksToLocal(updated);
    }
  };

  const handleUpdate = async (id: string, updatedFields: Partial<Task>) => {
    const updatedList = tasks.map(t =>
      t._id === id ? { ...t, ...updatedFields } : t
    );
    setTasks(updatedList);
    saveTasksToLocal(updatedList);

    try {
      if (!id.startsWith('local-')) await updateTask(id, updatedFields);
    } catch {
      console.warn('No se pudo actualizar en el backend');
    }

    setEditingTask(undefined); // salir del modo edición
  };

  const handleToggle = async (id: string, done: boolean) => {
    const updatedList = tasks.map(task =>
      task._id === id
        ? { ...task, state: (done ? 'terminada' : 'pendiente') as 'pendiente' | 'terminada' }
        : task
    );
    setTasks(updatedList);
    saveTasksToLocal(updatedList);

    try {
      if (!id.startsWith('local-')) await updateTask(id, { state: done ? 'terminada' : 'pendiente' });
    } catch {
      console.warn('No se pudo actualizar en el backend');
    }
  };

  const handleDelete = async (id: string) => {
    const updated = tasks.filter(t => t._id !== id);
    setTasks(updated);
    saveTasksToLocal(updated);

    try {
      if (!id.startsWith('local-')) await deleteTask(id);
    } catch {
      console.warn('No se pudo eliminar en el backend');
    }
  };

  return (
    <div className='App'>
      <h2>Gestor de Tareas</h2>
      <TaskForm
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editingTask={editingTask}
        cancelEdit={() => setEditingTask(undefined)}
      />
      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={(task) => setEditingTask(task)}
      />
    </div>
  );
}

export default App;