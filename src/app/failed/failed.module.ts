import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FailedRoutes} from './failed.routing';
import {FailedSingleComponent} from './single/failed-single.component';
import {FailedBulkComponent} from './bulk/failed-bulk.component';
import {SharedModule} from '../shared/shared.module';
import {UserModule} from '../users/user.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FailedRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        UserModule
    ],
    providers: [DatePipe],
    declarations: [
        FailedSingleComponent,
        FailedBulkComponent
    ]
})
export class FailedModule {}
