import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {AuthRechargeService} from '../service/auth-recharge.service';
import {catchError, finalize} from 'rxjs/operators';
import {IndividualRequests} from '../model/bulk-recharge.model';
import {SearchIndividualBulk} from '../model/search-individual-bulk.model';
import {Page} from '../service/utility/page';

export class BulkIndividualDatasource implements DataSource<IndividualRequests> {
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;
    private individualSubject = new BehaviorSubject<IndividualRequests[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private individualRequests: IndividualRequests[];
    private subscription: Subscription;

    constructor(private authService: AuthRechargeService) {}

    get page() {
        return 0;
    }

    get length() {
        if (this.individualRequests) {
            return this.individualRequests.length;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<IndividualRequests[] | ReadonlyArray<IndividualRequests>> {
        return this.individualSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.individualSubject.complete();
        this.loadingSubject.complete();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadFailedIndividualRequests(id: string, pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.getBulkIndividualFailedRequests(id, pageIndex, pageSize));
    }

    loadFailedUnresolvedIndividualRequests(id: string, pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.getBulkIndividualFailedUnresolvedRequests(id, pageIndex, pageSize));
    }

    loadIndividualRequests(id: string, pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.getBulkIndividualRequests(id, pageIndex, pageSize));
    }

    search(requests: Partial<SearchIndividualBulk>, pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.searchBulkIndividualRecharge(requests, pageIndex, pageSize));
    }

    searchFailed(requests: Partial<SearchIndividualBulk>, pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.searchFailedBulkIndividualRecharge(requests, pageIndex, pageSize));
    }

    private load(ob$: Observable<Page<IndividualRequests>>) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = ob$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.individualRequests = page.list;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.totalSize = page.totalSize;
            this.individualSubject.next(page.list);
        });
    }
}
