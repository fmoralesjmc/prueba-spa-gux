import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'task-manager-tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasksFromStorage();
  }

  private loadTasksFromStorage(): void {
    try {
      const storedTasks = localStorage.getItem(this.STORAGE_KEY);
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
        this.tasksSubject.next(tasks);
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
    }
  }

  private saveTasksToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTaskById(id: string): Task | undefined {
    return this.tasksSubject.value.find(task => task.id === id);
  }

  createTask(taskRequest: CreateTaskRequest): Task {
    const newTask: Task = {
      id: this.generateId(),
      ...taskRequest,
      status: 'pendiente',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentTasks = this.tasksSubject.value;
    const updatedTasks = [...currentTasks, newTask];
    
    this.tasksSubject.next(updatedTasks);
    this.saveTasksToStorage(updatedTasks);
    
    return newTask;
  }

  updateTask(id: string, updateRequest: UpdateTaskRequest): Task | null {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    const updatedTask: Task = {
      ...currentTasks[taskIndex],
      ...updateRequest,
      updatedAt: new Date()
    };

    const updatedTasks = [...currentTasks];
    updatedTasks[taskIndex] = updatedTask;
    
    this.tasksSubject.next(updatedTasks);
    this.saveTasksToStorage(updatedTasks);
    
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === currentTasks.length) {
      return false; // Task not found
    }
    
    this.tasksSubject.next(filteredTasks);
    this.saveTasksToStorage(filteredTasks);
    
    return true;
  }

  updateTaskStatus(id: string, status: Task['status']): Task | null {
    return this.updateTask(id, { status });
  }

  getTasksByStatus(status: Task['status']): Observable<Task[]> {
    return new BehaviorSubject(
      this.tasksSubject.value.filter(task => task.status === status)
    ).asObservable();
  }

  getTasksByPriority(priority: Task['priority']): Observable<Task[]> {
    return new BehaviorSubject(
      this.tasksSubject.value.filter(task => task.priority === priority)
    ).asObservable();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
