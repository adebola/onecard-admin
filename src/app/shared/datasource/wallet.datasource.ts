import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {WalletFund} from '../model/wallet-fund.model';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {AccountService} from '../service/account.service';

export class WalletDatasource implements DataSource<WalletFund> {
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;
    private walletSubject = new BehaviorSubject<WalletFund[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private walletFunds: WalletFund[];
    private subscription: Subscription;

    constructor(private accountService: AccountService) {}

    get page() {
        return 0;
    }

    get length() {

        if (this.walletFunds) {
            return this.walletFunds.length;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<WalletFund[]> {
        return this.walletSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.walletSubject.complete();
        this.loadingSubject.complete();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadWalletFundings(id: string, pageIndex = 1, pageSize = 20) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.accountService.findWalletFunding(id, pageIndex, pageSize).pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.walletFunds = page.list;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.totalSize = page.totalSize;
            this.walletSubject.next(page.list);
        });
    }
}
