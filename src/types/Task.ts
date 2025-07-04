export interface Task {
  _id?: string;
  title: string;
  description: string;
  state: 'pendiente' | 'terminada';
  category: string;
  color: string;
}
