import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {AccountService} from '../../shared/service/account.service';
import {Transaction} from '../../shared/model/account.model';

export class TransactionDatasource implements DataSource<Transaction> {
    private transactionSubject = new BehaviorSubject<Transaction[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private transactions: Transaction[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private accountService: AccountService) {}

    get page() {

        if (this.transactions) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.transactions) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Transaction[] | ReadonlyArray<Transaction>> {
        return this.transactionSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.transactionSubject.complete();
        this.loadingSubject.complete();
    }

    loadTransactions(id: string, pageIndex = 1, pageSize = 20) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.accountService.findUserTransactions(pageIndex, pageSize, id).pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            console.log('PAGE', page);
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.transactions = page.list;
            this.transactionSubject.next(page.list);
        });
    }
}
