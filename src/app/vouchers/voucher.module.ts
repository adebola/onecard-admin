import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';
import {VoucherRoutes} from './voucher.routing';
import {VoucherBatchlistComponent} from './voucherbatchlist/voucher-batchlist.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FieldErrorDisplayComponent} from './voucherform/field-error-display/field-error-display.component';
import {VoucherFormComponent} from './voucherform/voucherform.component';
import {VoucherListComponent} from './voucherlist/voucher-list.component';
import {SingleVoucherFormComponent} from './singlevoucherform/singlevoucherform.component';
import {ClusterListComponent} from './clusterlist/clusterlist.component';
import {ClusterFormComponent} from './clusterform/clusterform.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(VoucherRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [DatePipe, CurrencyPipe],
    declarations: [
        VoucherBatchlistComponent,
        VoucherListComponent,
        FieldErrorDisplayComponent,
        VoucherFormComponent,
        SingleVoucherFormComponent,
        ClusterListComponent,
        ClusterFormComponent
    ]
})
export class VoucherModule {}
