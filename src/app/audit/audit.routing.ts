import {Routes} from '@angular/router';
import {AuditlistComponent} from './auditlist/auditlist.component';
import {AuditFormComponent} from './auditform/auditform.component';
import {ContactListComponent} from './contactlist/contactlist.component';
import {ContactFormComponent} from './contactform/contactform.component';

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
    },
    {
        path: '',
        children: [
            {
                path: 'contact',
                component: ContactListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'view-contact/:id',
                component: ContactFormComponent
            }
        ]
    }
];
