import {Routes} from '@angular/router';
import {ReportListComponent} from './reportlist/reportlist.component';
import {RechargeReportComponent} from './recharge/recharge-report.component';
import {WalletReportComponent} from './wallet/wallet-report.component';

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

    {
        path: '',
        children: [
            {
                path: 'wallet',
                component: WalletReportComponent
            }
        ]
    },
];
