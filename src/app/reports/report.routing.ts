import {Routes} from '@angular/router';
import {ReportListComponent} from './reportlist/reportlist.component';
import {RechargeReportComponent} from './recharge/recharge-report.component';

export const ReportRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'report',
                component: ReportListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'recharge',
                component: RechargeReportComponent
            }
        ]
    },
];
