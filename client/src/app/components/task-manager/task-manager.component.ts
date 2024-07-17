import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoList } from '../../../models/TodoListModel';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.css',
})
export class TaskManagerComponent implements OnInit, OnChanges {
  tasks: any[] = [];

  ngOnInit(): void {
    const storedTasks = localStorage.getItem('taskList');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
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

  logHistory(task:TodoList , action: string) {
    const historyEntry = {
      date: new Date().toISOString(),
      action,
    };
    task.history.push(historyEntry);
    console.log(historyEntry)
  }

  submit() {
    if (this.todoForm.valid) {
      const uniqueId = uuidv4();
      let obj:TodoList ={
        id: uniqueId,
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
      console.log(this.tasks);
      console.log(this.todoForm.value);
      localStorage.setItem('taskList', JSON.stringify(this.tasks));
      alert('Task is created successfully');
    } else {
      alert("Enter valid data")
      console.log('Invalid form');
    }
  }
}
