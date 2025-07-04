import { type Task } from '../../types/Task';
import TaskItem from '../TaskItem/TaskItem';
import './TaskList.css';

interface Props {
  tasks: Task[];
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskList = ({ tasks, onToggle, onDelete, onEdit }: Props) => {
  // Agrupar tareas por categoría
  const groupByCategory = (taskList: Task[]) => {
    return taskList.reduce<Record<string, Task[]>>((acc, task) => {
      const cat = task.category || 'Sin categoría';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(task);
      return acc;
    }, {});
  };

  const pendientes = tasks.filter(task => task.state === 'pendiente');
  const terminadas = tasks.filter(task => task.state === 'terminada');

  const pendientesPorCategoria = groupByCategory(pendientes);
  const terminadasPorCategoria = groupByCategory(terminadas);

  const renderGroupedTasks = (groupedTasks: Record<string, Task[]>) =>
    Object.entries(groupedTasks).map(([category, tasks]) => (
      <div key={category} className='task-category'>
        <h4>{category}</h4>
        <ul style={{ paddingLeft: '1rem' }}>
          {tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      </div>
    ));

  return (
    <div className='task-list'>
      <section className='task-list-pending'>
        <h3>📝 Tareas Pendientes</h3>
        {Object.keys(pendientesPorCategoria).length > 0
          ? renderGroupedTasks(pendientesPorCategoria)
          : <p>No hay tareas pendientes.</p>}
      </section>

      <hr />

      <section className='task-list-completed'>
        <h3>✅ Tareas Terminadas</h3>
        {Object.keys(terminadasPorCategoria).length > 0
          ? renderGroupedTasks(terminadasPorCategoria)
          : <p>No hay tareas terminadas.</p>}
      </section>
    </div>
  );
};

export default TaskList;