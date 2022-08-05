import {Routes} from '@angular/router';
import {OrganizationListComponent} from './organizationlist/organizationlist.component';
import {OrganizationFormComponent} from './organizationform/organizationform.component';

export const OrganizationRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'organization',
                component: OrganizationListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'organizationform',
                component: OrganizationFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'organizationform/:id',
                component: OrganizationFormComponent
            }
        ]
    },
];
