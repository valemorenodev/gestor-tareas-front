import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList/TaskList';
import type { Task } from '../../types/Task';

const mockTasks: Task[] = [
  {
    _id: '1',
    title: 'Tarea 1',
    description: 'Descripción 1',
    state: 'pendiente',
    category: 'Trabajo',
    color: '#FF5733',
  },
  {
    _id: '2',
    title: 'Tarea 2',
    description: 'Descripción 2',
    state: 'pendiente',
    category: 'Casa',
    color: '#3498DB',
  },
  {
    _id: '3',
    title: 'Tarea 3',
    description: 'Descripción 3',
    state: 'terminada',
    category: 'Casa', // 👈 Este valor repite 'Casa'
    color: '#2ECC71',
  },
];

jest.mock('../TaskItem/TaskItem', () => (props: any) => {
  return <li data-testid="mock-task-item">{props.task.title}</li>;
});

describe('TaskList Component', () => {
  test('muestra tareas agrupadas por categoría', () => {
    render(<TaskList tasks={mockTasks} onToggle={() => {}} onDelete={() => {}} onEdit={() => {}} />);

    // ✅ Verifica que 'Trabajo' y 'Casa' estén como categorías
    expect(screen.getByText('Trabajo')).toBeInTheDocument();

    // ✅ Esta línea es la que lanzaba el error antes. Se arregla usando getAllByText
    const casaHeadings = screen.getAllByText('Casa');
    expect(casaHeadings).toHaveLength(2); // Una en pendientes, otra en completadas

    // ✅ Verifica que las tareas mock estén en pantalla
    const items = screen.getAllByTestId('mock-task-item');
    expect(items).toHaveLength(3);
  });
});