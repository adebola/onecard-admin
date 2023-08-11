import {Routes} from '@angular/router';
import {SettingsFormComponent} from './settingsform/settings-form.component';

export const KycRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'settings',
                component: SettingsFormComponent
            }
        ]
    }
];
