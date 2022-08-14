import {Routes} from '@angular/router';
import {UserListComponent} from './userlist/userlist.component';
import {UserFormComponent} from './userform/userform.component';
import {ProfileFormComponent} from './profileform/profileform.component';

export const UserRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'user',
                component: UserListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'adminuser',
                component: UserListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'userform',
                component: UserFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'userform/:id',
                component: UserFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'profileform',
                component: ProfileFormComponent
            }
        ]
    },
];
