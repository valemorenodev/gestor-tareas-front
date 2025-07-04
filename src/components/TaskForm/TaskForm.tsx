import { useEffect, useState } from 'react';
import { type Task } from '../../types/Task';
import './TaskForm.css';

interface Props {
  onCreate: (task: Task) => void;
  onUpdate: (id: string, updated: Partial<Task>) => void;
  editingTask?: Task;
  cancelEdit?: () => void;
}

const colors = ['#FF5733', '#3498DB', '#2ECC71', '#9B59B6'];
const categories = ['Trabajo', 'Personal', 'Estudio', 'Casa', 'Otros'];

const TaskForm = ({ onCreate, onUpdate, editingTask, cancelEdit }: Props) => {
  const [formData, setFormData] = useState<Omit<Task, '_id'>>({
    title: '',
    description: '',
    state: 'pendiente',
    category: '',
    color: colors[0],
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        state: editingTask.state,
        category: editingTask.category,
        color: editingTask.color,
      });
    }
  }, [editingTask]);

  const validate = () => {
    const newErrors = {
      title: '',
      description: '',
      category: ''
    };

    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    else if (formData.title.length < 5) newErrors.title = 'Debe tener al menos 5 caracteres';

    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    else if (formData.description.length < 10) newErrors.description = 'Debe tener al menos 10 caracteres';

    if (!formData.category) newErrors.category = 'Selecciona una categoría';

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Limpiar errores al escribir
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingTask && editingTask._id) {
      onUpdate(editingTask._id, formData);
    } else {
      onCreate(formData);
    }

    setFormData({ title: '', description: '', state: 'pendiente', category: '', color: colors[0] });
  };

  return (
    <form onSubmit={handleSubmit} className='task-form'>
      <h3>{editingTask ? 'Editar Tarea' : 'Crear nueva tarea'}</h3>

      <input
        name="title"
        placeholder="Título"
        value={formData.title}
        onChange={handleChange}
      />
      {errors.title && <span className="error">{errors.title}</span>}

      <input
        name="description"
        placeholder="Descripción"
        value={formData.description}
        onChange={handleChange}
      />
      {errors.description && <span className="error">{errors.description}</span>}

      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="">Selecciona categoría</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      {errors.category && <span className="error">{errors.category}</span>}

      <select name="color" value={formData.color} onChange={handleChange}>
        {colors.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <button type="submit" disabled={!formData.title || !formData.description || !formData.category}>
        {editingTask ? 'Guardar cambios' : 'Añadir tarea'}
      </button>

      {editingTask && <button type="button" onClick={cancelEdit}>Cancelar</button>}
    </form>
  );
};

export default TaskForm;