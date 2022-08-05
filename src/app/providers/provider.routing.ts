import {Routes} from '@angular/router';
import {ProviderListComponent} from './providerlist/provider-list.component';
import {ProviderFormComponent} from './providerform/provider-form.component';
import {ProviderCategoryListComponent} from './providercategorylist/provider-category-list.component';
import {CategoryFormComponent} from './categoryform/category-form.component';
import {RechargeProviderListComponent} from './rechargeproviderlist/recharge-provider-list.component';
import {RechargeProviderFormComponent} from './rechargeproviderform/recharge-provider-form.component';

export const ProviderRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'provider',
                component: ProviderListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'providerform',
                component: ProviderFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'providerform/:id',
                component: ProviderFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'category',
                component: ProviderCategoryListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'categoryform',
                component: CategoryFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'categoryform/:id',
                component: CategoryFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'rechargelist',
                component: RechargeProviderListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'rechargeproviderform',
                component: RechargeProviderFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'rechargeproviderform/:id',
                component: RechargeProviderFormComponent
            }
        ]
    }
];
