import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UserRoutes} from '../users/user.routing';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserListComponent} from './userlist/userlist.component';
import {UserFormComponent} from './userform/userform.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UserRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [DatePipe],
    declarations: [
        UserListComponent,
        UserFormComponent
    ]
})
export class UserModule {}
