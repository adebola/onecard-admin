import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OrganizationRoutes} from './organization.routing';
import {OrganizationListComponent} from './organizationlist/organizationlist.component';
import {OrganizationFormComponent} from './organizationform/organizationform.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(OrganizationRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [DatePipe],
    declarations: [
        OrganizationListComponent,
        OrganizationFormComponent,
    ]
})
export class OrganizationModule {}
