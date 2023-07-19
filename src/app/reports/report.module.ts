import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ReportListComponent} from './reportlist/reportlist.component';
import {ReportRoutes} from './report.routing';
import {RechargeReportComponent} from './recharge/recharge-report.component';
import {WalletReportComponent} from './wallet/wallet-report.component';
import {UserWalletComponent} from './wallet/user/user-wallet.component';
import {ProviderWalletComponent} from './wallet/provider/provider-wallet.component';
import {TransactionReportComponent} from './transaction/transaction-report.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ReportRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ReportListComponent,
        RechargeReportComponent,
        WalletReportComponent,
        UserWalletComponent,
        ProviderWalletComponent,
        TransactionReportComponent
    ]
})
export class ReportModule {}
