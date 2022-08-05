import {Routes} from '@angular/router';
import {TestFormComponent} from './testform/testform.component';

export const TestRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'test',
                component: TestFormComponent
            }
        ]
    },
];
