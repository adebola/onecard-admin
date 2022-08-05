import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BulkRecharge} from '../model/bulk-recharge.model';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {AuthRechargeService} from '../service/auth-recharge.service';
import {catchError, finalize} from 'rxjs/operators';
import {SearchBulkFailedRecharge, SearchBulkRecharge} from '../model/search-bulk-recharge.model';
import {Page} from '../service/utility/page';

export class BulkRechargeDatasource implements DataSource<BulkRecharge> {
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;
    private bulkSubject = new BehaviorSubject<BulkRecharge[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private bulkRecharge: BulkRecharge[];
    private subscription: Subscription;

    constructor(private authService: AuthRechargeService) {}

    get page() {
        return 0;
    }

    get length() {
        if (this.bulkRecharge) {
            return this.bulkRecharge.length;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<BulkRecharge[] | ReadonlyArray<BulkRecharge>> {
        return this.bulkSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.bulkSubject.complete();
        this.loadingSubject.complete();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadFailedRecharges(pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.getBulkFailedRecharges(pageIndex, pageSize));
    }

    loadFailedUnresolvedRecharges(pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.getBulkFailedUnresolvedRecharges(pageIndex, pageSize));
    }

    loadRecharges(id: string, pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.getUserBulkRecharges(id, pageIndex, pageSize));
    }

    search(search: Partial<SearchBulkRecharge>) {
        this.load(this.authService.searchBulkRecharge(search));
    }

    searchFailed(search: Partial<SearchBulkFailedRecharge>, pageIndex: number = 1, pageSize: number = 20 ) {
        this.load(this.authService.searchBulkFailedRecharge(search, pageIndex, pageSize));
    }

    private load(obs$: Observable<Page<BulkRecharge>>) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.bulkRecharge = page.list;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.totalSize = page.totalSize;
            this.bulkSubject.next(page.list);
        });
    }
}
