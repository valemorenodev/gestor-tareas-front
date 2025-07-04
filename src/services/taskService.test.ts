import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { type Task } from '../types/Task';

global.fetch = jest.fn(); // mock global

const mockFetch = fetch as jest.Mock;

describe('API service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getTasks retorna lista de tareas correctamente', async () => {
    const mockTasks: Task[] = [
      { _id: '1', title: 'Test', description: 'Descripción', state: 'pendiente', category: 'Trabajo', color: '#000' }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks
    });

    const result = await getTasks();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3030/api/tasks');
    expect(result).toEqual(mockTasks);
  });

  test('getTasks lanza error si la respuesta falla', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(getTasks()).rejects.toThrow('Error al cargar tareas');
  });

  test('createTask realiza POST correctamente', async () => {
    const newTask: Task = {
      _id: '1',
      title: 'Nueva',
      description: 'Desc',
      category: 'Casa',
      color: '#fff',
      state: 'pendiente',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newTask
    });

    const result = await createTask(newTask);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3030/api/tasks', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(newTask),
    }));
    expect(result).toEqual(newTask);
  });

  test('updateTask realiza PUT correctamente', async () => {
    const partial = { title: 'Actualizada' };
    const updatedTask = { ...partial, _id: '1' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedTask,
    });

    const result = await updateTask('1', partial);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3030/api/tasks/1', expect.objectContaining({
      method: 'PUT',
    }));
    expect(result).toEqual(updatedTask);
  });

  test('deleteTask realiza DELETE correctamente', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    await deleteTask('1');
    expect(fetch).toHaveBeenCalledWith('http://localhost:3030/api/tasks/1', expect.objectContaining({
      method: 'DELETE',
    }));
  });

  test('deleteTask lanza error si falla', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(deleteTask('1')).rejects.toThrow('Error al eliminar tarea');
  });
});