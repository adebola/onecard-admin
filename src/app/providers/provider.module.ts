import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProviderListComponent} from './providerlist/provider-list.component';
import {ProviderRoutes} from './provider.routing';
import {ProviderFormComponent} from './providerform/provider-form.component';
import {ProviderCategoryListComponent} from './providercategorylist/provider-category-list.component';
import {CategoryFormComponent} from './categoryform/category-form.component';
import {ProviderDetailsComponent} from './providerdetails/provider-details.component';
import {AddProviderComponent} from './addProvider/addprovider.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProviderRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [DatePipe],
    declarations: [
        ProviderListComponent,
        ProviderFormComponent,
        ProviderCategoryListComponent,
        CategoryFormComponent,
        ProviderDetailsComponent,
        AddProviderComponent
    ]
})
export class ProviderModule {}
