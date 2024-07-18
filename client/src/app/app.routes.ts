import { Routes } from '@angular/router';
import { TaskManagerComponent } from './components/task-manager/task-manager.component';
import { TasksComponent } from './components/tasks/tasks.component';

export const routes: Routes = [
    {path:"addTask",component:TaskManagerComponent},
    {path:"",component:TasksComponent}
];
