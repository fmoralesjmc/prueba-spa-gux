import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() updateStatus = new EventEmitter<{ id: string, status: Task['status'] }>();

  // Exponer Math para usar en el template
  Math = Math;

  onEdit(): void {
    this.editTask.emit(this.task);
  }

  onDelete(): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.deleteTask.emit(this.task.id);
    }
  }

  onStatusChange(status: Task['status']): void {
    this.updateStatus.emit({ id: this.task.id, status });
  }

  getPriorityColor(): string {
    switch (this.task.priority) {
      case 'alta': return 'warn';
      case 'media': return 'accent';
      case 'baja': return 'primary';
      default: return 'primary';
    }
  }

  getStatusColor(): string {
    switch (this.task.status) {
      case 'completada': return 'primary';
      case 'en progreso': return 'accent';
      case 'pendiente': return 'warn';
      default: return 'primary';
    }
  }

  getStatusIcon(): string {
    switch (this.task.status) {
      case 'completada': return 'check_circle';
      case 'en progreso': return 'schedule';
      case 'pendiente': return 'pending';
      default: return 'pending';
    }
  }

  isOverdue(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && this.task.status !== 'completada';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysUntilDue(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
