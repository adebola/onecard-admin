import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {WalletDatasource} from '../../shared/datasource/wallet.datasource';
import {AccountService} from '../../shared/service/account.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
    selector: 'app-funding-component',
    templateUrl: './funding.component.html',
    styleUrls: ['./funding.component.css']
})
export class FundingComponent  implements OnInit, OnDestroy, OnChanges {
    @Input() display: boolean;
    @Input() userId: string;

    public datasource: WalletDatasource;
    public displayedColumns = ['amount', 'type', 'date'];
    public busy = false;

    constructor(private accountService: AccountService) {}

    ngOnDestroy(): void {}

    ngOnInit(): void {
        // this.datasource = new WalletDatasource(this.accountService);
        // this.datasource.loadWalletFundings(this.userId);
    }

    logEvent($event: PageEvent) {
        this.datasource.loadWalletFundings(this.userId, $event.pageIndex + 1, $event.pageSize);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.display) {
            this.datasource = new WalletDatasource(this.accountService);
            this.datasource.loadWalletFundings(this.userId);
        }
    }
}
