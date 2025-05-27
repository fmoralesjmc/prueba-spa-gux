export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  dueDate: Date;
  status: 'pendiente' | 'en progreso' | 'completada';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  dueDate: Date;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: 'pendiente' | 'en progreso' | 'completada';
}
