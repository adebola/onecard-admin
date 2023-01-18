import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ReportListComponent} from './reportlist/reportlist.component';
import {ReportRoutes} from './report.routing';
import {RechargeReportComponent} from './recharge/recharge-report.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ReportRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ReportListComponent,
        RechargeReportComponent
    ]
})
export class ReportModule {}
