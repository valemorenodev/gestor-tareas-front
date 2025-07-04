import { type Task } from '../../types/Task';
import './TaskItem.css'

interface Props {
  task: Task;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onEdit }: Props) => {
  return (
    <li style={{ color: task.color }} className='task-item'>
      <input
        type="checkbox"
        checked={task.state === 'terminada'}
        onChange={() => onToggle(task._id!, task.state !== 'terminada')}
      />
      <span><strong>{task.title}</strong><p> - {task.description}</p></span>
      <div>
        <button onClick={() => onEdit(task)}>✏️ Editar</button>
        <button onClick={() => onDelete(task._id!)}>🗑️ Eliminar</button>
      </div>
    </li>
  );
};

export default TaskItem;