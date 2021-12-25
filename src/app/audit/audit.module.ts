import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AuditlistComponent} from './auditlist/auditlist.component';
import {AuditRoutes} from './audit.routing';
import {AuditFormComponent} from './auditform/auditform.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuditRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    // providers: [DatePipe],
    declarations: [
        AuditlistComponent,
        AuditFormComponent
    ]
})
export class AuditModule {}
