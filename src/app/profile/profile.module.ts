import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProfileRoutes} from './profile.routing';
import {ProfileFormComponent} from './profileform/profileform.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProfileRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ProfileFormComponent
    ]
})
export class ProfileModule {}
