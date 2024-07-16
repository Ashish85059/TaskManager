import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoList } from '../../../models/TodoListModel';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.css',
})
export class TaskManagerComponent implements OnInit,OnChanges{
  tasks:any[]=[];

  ngOnInit(): void {
      const storedTasks = localStorage.getItem('taskList');
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      }
  }
  ngOnChanges(changes: SimpleChanges): void {

  }


  title=new FormControl("",[
    Validators.required,
    Validators.minLength(5)
  ]);
  description=new FormControl("", [
    Validators.required,
    Validators.minLength(10)]
  );
  date=new FormControl("");
  priority=new FormControl("");

  todoForm=new FormGroup({
    title:this.title,
    description:this.description,
    date:this.date,
    priority:this.priority,
  })


  submit(){
    if(this.todoForm.valid){
      const uniqueId = uuidv4();
      let obj={
        id:uniqueId,
        title:this.todoForm.value.title,
        description:this.todoForm.value.description,
        date:this.todoForm.value.date,
        priority:this.todoForm.value.priority,
        isCompleted:false
      }
      this.todoForm.reset();
      this.tasks.push(obj);
      console.log(this.tasks)
      console.log(this.todoForm.value)
      localStorage.setItem('taskList', JSON.stringify(this.tasks));
      alert("Task is created successfully")
    }
    else{
      console.log("Invalid form")
    }
  }

}
