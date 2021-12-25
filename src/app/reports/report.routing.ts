import {Routes} from '@angular/router';
import {ReportListComponent} from './reportlist/reportlist.component';

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
];
