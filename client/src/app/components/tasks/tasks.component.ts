import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { TodoList } from '../../../models/TodoListModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})

export class TasksComponent implements OnInit {
  tasks: TodoList[] = [];
  selectedTask: TodoList | null = null;
  showModal: boolean = false;

  ngOnInit(): void {
    this.fetchTasks();
    this.sortByDueDate();
  }

  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task._id !== taskId);
    this.deleteTaskMongo(taskId);
  }

  sortByDueDate(): void {
    this.tasks.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  sortByStatus(): void {
    this.tasks.sort((a, b) => {
      return a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1;
    });
  }

  sortByPriority(): void {
    const priorityOrder = ['low', 'medium', 'high'];
    this.tasks.sort((a, b) => {
      return (
        priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority)
      );
    });
  }

  onSortChange(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value;
    switch (sortBy) {
      case 'dueDate':
        this.sortByDueDate();
        break;
      case 'priority':
        this.sortByPriority();
        break;
      case 'status':
        this.sortByStatus();
        break;
      default:
        this.sortByStatus();
        break;
    }
  }

  toggleCompleted(task: TodoList): void {
    task.isCompleted = !task.isCompleted;
    this.logHistory(
      task,
      `Marked as ${task.isCompleted ? 'completed' : 'pending'}`
    );
    this.updateTask(task);
  }

  openEditModal(task: TodoList): void {
    this.selectedTask = { ...task };
    this.showModal = true;
  }

  closeEditModal(): void {
    this.selectedTask = null;
    this.showModal = false;
  }

  saveTask(): void {
    if (this.selectedTask) {
      const index = this.tasks.findIndex(
        (t) => t._id === this.selectedTask!._id
      );
      if (index !== -1) {
        this.tasks[index] = this.selectedTask;
        this.logHistory(this.tasks[index], 'Task edited');
        this.updateTask(this.selectedTask);
      }
    }
    this.closeEditModal();
  }

  async updateTask(task: TodoList) {
    try {
      const response = await fetch(
        `https://taskmanager-0hmr.onrender.com/api/v1/task/${task._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        }
      );

      if (!response.ok) {
        throw new Error('Error in network');
      }

      const result = await response.json();
      console.log('Updated task:', result);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async fetchTasks() {
    try {
      const response = await fetch(
        'https://taskmanager-0hmr.onrender.com/api/v1/task'
      );
      const responseData = await response.json();

      if (responseData.Tasks) {
        this.tasks = responseData.Tasks;
      }
    } catch (error) {
      console.log('Error fetching tasks:', error);
    }
  }

  async deleteTaskMongo(taskId: string) {
    try {
      const response = await fetch(
        `https://taskmanager-0hmr.onrender.com/api/v1/task/${taskId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Error in network');
      }
      this.fetchTasks();
    } catch (error) {
      console.log('Error deleting task:', error);
    }
  }

  logHistory(task: TodoList, action: string) {
    const historyEntry = {
      date: new Date().toLocaleString(),
      action,
    };
    task.history.push(historyEntry);
  }

  exportToCSV(): void {
    const csvRows = [];
    const headers = [
      'Title',
      'Description',
      'Due Date',
      'Priority Level',
      'Status',
    ];
    csvRows.push(headers.join(','));

    for (const task of this.tasks) {
      const values = [
        task.title,
        task.description,
        task.date,
        task.priority,
        task.isCompleted ? 'COMPLETED' : 'PENDING',
      ];
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    saveAs(blob, 'tasks.csv');
  }

  trackByTaskId(index: number, task: TodoList): string {
    return task._id;
  }
}
