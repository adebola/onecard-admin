import {Routes} from '@angular/router';
import {ProfileFormComponent} from './profileform/profileform.component';


export const ProfileRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'profile',
                component: ProfileFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'login',
                component: ProfileFormComponent
            }
        ]
    }
];
