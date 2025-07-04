import type { Task } from '../types/Task';

const STORAGE_KEY = 'tareas_local';

export const saveTasksToLocal = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const getTasksFromLocal = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};