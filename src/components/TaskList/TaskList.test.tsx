import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';
import { type Task } from '../../types/Task';

// Mock del componente hijo TaskItem
jest.mock('../TaskItem/TaskItem', () => ({
  __esModule: true,
  default: ({ task }: { task: Task }) => (
    <li data-testid="mock-task-item">{task.title}</li>
  )
}));

describe('TaskList Component', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const tareas: Task[] = [
    {
      _id: '1',
      title: 'Tarea 1',
      description: 'Desc 1',
      category: 'Trabajo',
      color: '#FF0000',
      state: 'pendiente',
    },
    {
      _id: '2',
      title: 'Tarea 2',
      description: 'Desc 2',
      category: 'Casa',
      color: '#00FF00',
      state: 'pendiente',
    },
    {
      _id: '3',
      title: 'Tarea 3',
      description: 'Desc 3',
      category: 'Casa',
      color: '#0000FF',
      state: 'terminada',
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza secciones pendientes y terminadas correctamente', () => {
    render(
      <TaskList
        tasks={tareas}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText(/📝 Tareas Pendientes/i)).toBeInTheDocument();
    expect(screen.getByText(/✅ Tareas Terminadas/i)).toBeInTheDocument();
  });

  test('muestra tareas agrupadas por categoría', () => {
    render(
      <TaskList
        tasks={tareas}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Trabajo')).toBeInTheDocument();
    expect(screen.getAllByText('Casa')).toHaveLength(2);

    const items = screen.getAllByTestId('mock-task-item');
    expect(items).toHaveLength(3);
  });

  test('muestra mensaje cuando no hay tareas pendientes ni terminadas', () => {
    render(
      <TaskList
        tasks={[]}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText(/No hay tareas pendientes/i)).toBeInTheDocument();
    expect(screen.getByText(/No hay tareas terminadas/i)).toBeInTheDocument();
  });
});