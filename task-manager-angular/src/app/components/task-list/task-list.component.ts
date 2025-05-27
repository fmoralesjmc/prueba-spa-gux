import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, combineLatest, map } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../../services/task.service';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatBadgeModule,
    MatTooltipModule,
    TaskItemComponent,
    TaskFormComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  tasks$: Observable<Task[]>;
  filteredTasks$: Observable<Task[]>;
  
  // Filtros
  searchTerm = '';
  selectedStatus: Task['status'] | 'todas' = 'todas';
  selectedPriority: Task['priority'] | 'todas' = 'todas';
  sortBy: 'dueDate' | 'createdAt' | 'priority' | 'title' = 'dueDate';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Estado del formulario
  showForm = false;
  editingTask: Task | null = null;
  isEditMode = false;

  // Contadores para badges
  pendingCount = 0;
  inProgressCount = 0;
  completedCount = 0;

  statusOptions = [
    { value: 'todas', label: 'Todas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'en progreso', label: 'En Progreso' },
    { value: 'completada', label: 'Completadas' }
  ];

  priorityOptions = [
    { value: 'todas', label: 'Todas' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' }
  ];

  sortOptions = [
    { value: 'dueDate', label: 'Fecha límite' },
    { value: 'createdAt', label: 'Fecha de creación' },
    { value: 'priority', label: 'Prioridad' },
    { value: 'title', label: 'Título' }
  ];

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
    this.filteredTasks$ = this.createFilteredTasks();
  }

  ngOnInit(): void {
    // Suscribirse a las tareas para actualizar contadores
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.updateCounts(tasks);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createFilteredTasks(): Observable<Task[]> {
    return combineLatest([
      this.tasks$
    ]).pipe(
      map(([tasks]) => {
        let filtered = [...tasks];

        // Filtrar por término de búsqueda
        if (this.searchTerm.trim()) {
          const term = this.searchTerm.toLowerCase();
          filtered = filtered.filter(task =>
            task.title.toLowerCase().includes(term) ||
            task.description.toLowerCase().includes(term)
          );
        }

        // Filtrar por estado
        if (this.selectedStatus !== 'todas') {
          filtered = filtered.filter(task => task.status === this.selectedStatus);
        }

        // Filtrar por prioridad
        if (this.selectedPriority !== 'todas') {
          filtered = filtered.filter(task => task.priority === this.selectedPriority);
        }

        // Ordenar
        filtered.sort((a, b) => {
          let comparison = 0;
          
          switch (this.sortBy) {
            case 'dueDate':
              comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
              break;
            case 'createdAt':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            case 'priority':
              const priorityOrder = { 'alta': 3, 'media': 2, 'baja': 1 };
              comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
              break;
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;
          }
          
          return this.sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
      })
    );
  }

  private updateCounts(tasks: Task[]): void {
    this.pendingCount = tasks.filter(t => t.status === 'pendiente').length;
    this.inProgressCount = tasks.filter(t => t.status === 'en progreso').length;
    this.completedCount = tasks.filter(t => t.status === 'completada').length;
  }

  onFiltersChange(): void {
    this.filteredTasks$ = this.createFilteredTasks();
  }

  onNewTask(): void {
    this.editingTask = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  onEditTask(task: Task): void {
    this.editingTask = task;
    this.isEditMode = true;
    this.showForm = true;
  }

  onDeleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }

  onUpdateStatus(event: { id: string, status: Task['status'] }): void {
    this.taskService.updateTaskStatus(event.id, event.status);
  }

  onTaskSubmit(taskData: CreateTaskRequest | UpdateTaskRequest): void {
    if (this.isEditMode && this.editingTask) {
      this.taskService.updateTask(this.editingTask.id, taskData as UpdateTaskRequest);
    } else {
      this.taskService.createTask(taskData as CreateTaskRequest);
    }
    this.onCancelForm();
  }

  onCancelForm(): void {
    this.showForm = false;
    this.editingTask = null;
    this.isEditMode = false;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'todas';
    this.selectedPriority = 'todas';
    this.sortBy = 'dueDate';
    this.sortOrder = 'asc';
    this.onFiltersChange();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.onFiltersChange();
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
