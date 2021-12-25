import {Routes} from '@angular/router';
import {AuditlistComponent} from './auditlist/auditlist.component';
import {AuditFormComponent} from './auditform/auditform.component';

export const AuditRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'audit',
                component: AuditlistComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'view/:id',
                component: AuditFormComponent
            }
        ]
    }
];
