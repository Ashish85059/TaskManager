import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css'],
})
export class TaskManagerComponent implements OnInit, OnChanges {
  tasks: any[] = [];

  ngOnInit(): void {
    this.fetchTasks();
  }

  async fetchTasks() {
    try {
      const response = await fetch(
        'https://taskmanager-backend-1zsu.onrender.com/api/v1/task'
      );
      const data = await response.json();

      // Log the API response to check its format
      console.log('API response:', data);

      if (data) {
        this.tasks = data.Tasks;
      }
    } catch (error) {
      console.log('Error fetching tasks:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {}

  title = new FormControl('', [Validators.required, Validators.minLength(2)]);
  description = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
  ]);
  date = new FormControl('');
  priority = new FormControl('');

  todoForm = new FormGroup({
    title: this.title,
    description: this.description,
    date: this.date,
    priority: this.priority,
  });

  logHistory(task: any, action: string) {
    const historyEntry = {
      date: new Date().toLocaleString(),
      action,
    };
    task.history.push(historyEntry);
    console.log(historyEntry);
  }

  async createTask(obj: any) {
    try {
      const response = await fetch(
        'https://taskmanager-backend-1zsu.onrender.com/api/v1/task',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.log('Error creating task:', error);
    }
  }

  submit() {
    if (this.todoForm.valid) {
      const uniqueId = uuidv4();
      let obj = {
        title: this.todoForm.value.title!,
        description: this.todoForm.value.description!,
        date: this.todoForm.value.date!,
        priority: this.todoForm.value.priority!,
        isCompleted: false,
        history: [],
      };
      this.logHistory(obj, 'Task created');
      this.todoForm.reset();
      this.tasks.push(obj);
      this.createTask(obj);
      console.log(this.tasks);
      console.log(this.todoForm.value);
      alert('Task is created successfully');
    } else {
      alert('Enter valid data');
      console.log('Invalid form');
    }
  }
}
