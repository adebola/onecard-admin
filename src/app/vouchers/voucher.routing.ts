import {Routes} from '@angular/router';
import {VoucherBatchlistComponent} from './voucherbatchlist/voucher-batchlist.component';
import {VoucherFormComponent} from './voucherform/voucherform.component';
import {VoucherListComponent} from './voucherlist/voucher-list.component';
import {SingleVoucherFormComponent} from './singlevoucherform/singlevoucherform.component';
import {ClusterListComponent} from './clusterlist/clusterlist.component';
import {ClusterFormComponent} from './clusterform/clusterform.component';

export const VoucherRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'voucher',
                component: VoucherListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'voucher/:id',
                component: VoucherListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'batch',
                component: VoucherBatchlistComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'batch/:id',
                component: VoucherBatchlistComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'voucherform',
                component: VoucherFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'voucherform/:id',
                component: VoucherFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'singlevoucherform/:id',
                component: SingleVoucherFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'cluster',
                component: ClusterListComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'clusterform',
                component: ClusterFormComponent
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'clusterform/:id',
                component: ClusterFormComponent
            }
        ]
    }
];
