import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TestFormComponent} from './testform/testform.component';
import {TestRoutes} from './test.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TestRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        TestFormComponent
    ]
})
export class TestModule {}
