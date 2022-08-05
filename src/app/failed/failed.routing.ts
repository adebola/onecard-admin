import {Routes} from '@angular/router';
import {FailedSingleComponent} from './single/failed-single.component';
import {FailedBulkComponent} from './bulk/failed-bulk.component';

export const FailedRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'single',
                component: FailedSingleComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'single_unresolved',
                component: FailedSingleComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'bulk',
                component: FailedBulkComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'bulk_unresolved',
                component: FailedBulkComponent
            }
        ]
    }
];
