import {Routes} from '@angular/router';
import {TaskListComponent} from './tasklist/tasklist.component';


export const TaskRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'task',
                component: TaskListComponent
            }
        ]
    },
];
