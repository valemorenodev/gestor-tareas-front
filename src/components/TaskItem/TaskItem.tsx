import { type Task } from '../../types/Task';

interface Props {
  task: Task;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onEdit }: Props) => {
  return (
    <li style={{ color: task.color }}>
      <input
        type="checkbox"
        checked={task.state === 'terminada'}
        onChange={() => onToggle(task._id!, task.state !== 'terminada')}
      />
      <strong>{task.title}</strong> - {task.description}
      <button onClick={() => onEdit(task)}>✏️ Editar</button>
      <button onClick={() => onDelete(task._id!)}>🗑️ Eliminar</button>
    </li>
  );
};

export default TaskItem;