import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {SingleRecharge} from '../model/single-recharge.model';
import {AuthRechargeService} from '../service/auth-recharge.service';
import {SearchSingleFailedRecharge, SearchSingleRecharge} from '../model/search-single-recharge.model';
import {Page} from '../service/utility/page';

export class SingleRechargeDatasource implements DataSource<SingleRecharge> {
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;
    private singleSubject = new BehaviorSubject<SingleRecharge[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private singleRecharge: SingleRecharge[];
    private subscription: Subscription;

    constructor(private authService: AuthRechargeService) {}

    get page() {
        return 0;
    }

    get length() {
        if (this.singleRecharge) {
            return this.singleRecharge.length;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<SingleRecharge[] | ReadonlyArray<SingleRecharge>> {
        return this.singleSubject.asObservable();
    }

    loadFailedRecharges(pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.getSingleFailedRecharges(pageIndex, pageSize));
    }

    loadFailedUnresolvedRecharges(pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.getSingleFailedUnresolvedRecharges(pageIndex, pageSize));
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.singleSubject.complete();
        this.loadingSubject.complete();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadRecharges(id: string, pageIndex: number = 1, pageSize: number = 20) {
        this.load(this.authService.getUserSingleRecharges(id, pageIndex, pageSize));
    }

    private load(obs$: Observable<Page<SingleRecharge>>) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        // this.loadingSubject.next(true);

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.singleRecharge = page.list;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.totalSize = page.totalSize;
            this.singleSubject.next(page.list);
        });
    }

    search(search: Partial<SearchSingleRecharge>,  pageNumber: number = 1, pageSize: number = 20) {
        this.load(this.authService.searchSingleRecharge(search, pageNumber, pageSize));
    }

    searchFailed(search: Partial<SearchSingleFailedRecharge>, pageNumber: number = 1, pageSize: number = 20) {
        this.load(this.authService.searchSingleFailedRecharge(search, pageNumber, pageSize));
    }
}
