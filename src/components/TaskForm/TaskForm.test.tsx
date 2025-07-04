import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from './TaskForm';
import type { Task } from '../../types/Task';

describe('TaskForm Component', () => {
  const onCreate = jest.fn();
  const onUpdate = jest.fn();
  const cancelEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el formulario correctamente en modo creación', async () => {
    render(<TaskForm onCreate={onCreate} onUpdate={onUpdate} />);
    expect(await screen.findByText(/crear nueva tarea/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/título/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir tarea/i })).toBeDisabled();
  });

  test('muestra errores si se envía el formulario con datos inválidos', async () => {
  render(<TaskForm onCreate={onCreate} onUpdate={onUpdate} />);

  fireEvent.change(screen.getByPlaceholderText(/título/i), {
    target: { value: 'abc' }
  });

  fireEvent.change(screen.getByPlaceholderText(/descripción/i), {
    target: { value: 'desc' }
  });

  fireEvent.change(screen.getByRole('combobox', { name: 'Categoría' }), { target: { value: 'Trabajo' } });

  const submitButton = screen.getByRole('button', { name: /añadir tarea/i });
  expect(submitButton).toBeEnabled();

  fireEvent.click(submitButton);

  expect(await screen.findByText(/debe tener al menos 5 caracteres/i)).toBeInTheDocument();
  expect(await screen.findByText(/debe tener al menos 10 caracteres/i)).toBeInTheDocument();
});

  test('llama a onCreate cuando el formulario es válido', () => {
    render(<TaskForm onCreate={onCreate} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByPlaceholderText(/título/i), { target: { value: 'Tarea válida' } });
    fireEvent.change(screen.getByPlaceholderText(/descripción/i), {
      target: { value: 'Descripción válida para la tarea' }
    });
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Trabajo' } });
    fireEvent.change(selects[1], { target: { value: '#FF5733' } });
    fireEvent.click(screen.getByRole('button', { name: /añadir tarea/i }));

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Tarea válida',
        description: 'Descripción válida para la tarea',
        category: 'Trabajo',
        state: 'pendiente'
      })
    );
  });

  test('muestra modo edición correctamente y llama a onUpdate', async () => {
    const mockTask: Task = {
      _id: '123',
      title: 'Editar tarea',
      description: 'Descripción existente',
      category: 'Personal',
      color: '#FF5733',
      state: 'pendiente'
    };

    render(
      <TaskForm
        onCreate={onCreate}
        onUpdate={onUpdate}
        editingTask={mockTask}
        cancelEdit={cancelEdit}
      />
    );

    expect(screen.getByDisplayValue('Editar tarea')).toBeInTheDocument();
    expect(await screen.findByText(/guardar cambios/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/título/i), {
      target: { value: 'Tarea editada' }
    });

    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    expect(onUpdate).toHaveBeenCalledWith('123', expect.objectContaining({ title: 'Tarea editada' }));
  });

  test('llama a cancelEdit si se presiona cancelar', () => {
    const mockTask: Task = {
      _id: '123',
      title: 'Tarea',
      description: 'desc',
      category: 'Otros',
      color: '#2ECC71',
      state: 'pendiente'
    };

    render(
      <TaskForm
        onCreate={onCreate}
        onUpdate={onUpdate}
        editingTask={mockTask}
        cancelEdit={cancelEdit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(cancelEdit).toHaveBeenCalled();
  });
});