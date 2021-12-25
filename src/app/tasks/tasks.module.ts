import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TaskListComponent} from './tasklist/tasklist.component';
import {TaskRoutes} from './tasks.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TaskRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [DatePipe],
    declarations: [
        TaskListComponent
    ]
})
export class TaskModule {}
