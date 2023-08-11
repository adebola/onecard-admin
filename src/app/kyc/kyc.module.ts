import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {KycRoutes} from './kyc.routing';
import {SettingsFormComponent} from './settingsform/settings-form.component';



@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(KycRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        SettingsFormComponent
    ]
})
export class KycModule {}
