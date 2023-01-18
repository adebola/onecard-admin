import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UserRoutes} from './user.routing';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserListComponent} from './userlist/userlist.component';
import {UserFormComponent} from './userform/userform.component';
import {ProfileFormComponent} from './profileform/profileform.component';
import {FundingComponent} from './funding/funding.component';
import {RechargesComponent} from './recharges/recharges.component';
import {SingleRechargesComponent} from './recharges/single/single-recharges.component';
import {BulkRechargesComponent} from './recharges/bulk/bulk-recharge.component';
import {BulkIndividualRechargeComponent} from './recharges/bulk-individual/bulk-individual-recharge.component';
import {RetryModalComponent} from './modals/retry/retry-modal.component';
import {ResolveModalComponent} from './modals/resolve/resolve-modal.component';
import {BalanceModalComponent} from './modals/balance/balance-modal.component';
import {CombinedRechargeComponent} from './recharges/combined/combined-recharge.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UserRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [DatePipe],
    exports: [
        SingleRechargesComponent,
        BulkIndividualRechargeComponent
    ],
    declarations: [
        UserListComponent,
        UserFormComponent,
        ProfileFormComponent,
        FundingComponent,
        RechargesComponent,
        SingleRechargesComponent,
        BulkRechargesComponent,
        BulkIndividualRechargeComponent,
        RetryModalComponent,
        ResolveModalComponent,
        BalanceModalComponent,
        CombinedRechargeComponent
    ]
})
export class UserModule {}
