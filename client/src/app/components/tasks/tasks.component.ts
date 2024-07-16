import { Component, OnInit } from '@angular/core';


// Generate a unique ID

import { TodoList } from '../../../models/TodoListModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  tasks: TodoList[] = [];

  ngOnInit(): void {
    const storedTasks = localStorage.getItem('taskList');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
    this.sortByDueDate();
  }

  setToLocalStorage() {
    localStorage.setItem('taskList', JSON.stringify(this.tasks));
  }

  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.setToLocalStorage();
  }

  sortByDueDate(): void {
    this.tasks.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // sortByPriority(): void {
  //   const priorityOrder = { low: 1, medium: 2, high: 3 };

  //   this.tasks.sort(
  //     (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  //   );
  //   this.setToLocalStorage();
  // }

  sortByStatus(): void {
    this.tasks.sort((a, b) => {
      return a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1;
    });
  }

  onSortChange(sortBy: string): void {
    switch (sortBy) {
      case 'dueDate':
        this.sortByDueDate();
        break;
      case 'priority':
        // this.sortByPriority();
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
    this.setToLocalStorage();
  }
}
