import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {VoucherService} from '../../shared/service/voucher.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {Batch} from '../../shared/model/voucher.model';


export class BatchDatasource implements DataSource<Batch> {
    private batchSubject = new BehaviorSubject<Batch[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private batches: Batch[];

    private subscription: Subscription;

    private pages: number;

    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private voucherService: VoucherService) {}

    get page() {

        if (this.batches) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.batches) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Batch[] | ReadonlyArray<Batch>> {
        return this.batchSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.batchSubject.complete();
        this.loadingSubject.complete();
    }

    loadClusterBatches(id: string, pageIndex = 1, pageSize = 20) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.voucherService.getBatchByClusterId(id, pageIndex, pageSize).pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;

            this.batches  = page.list;
            this.batchSubject.next(page.list);
        });
    }

    loadVoucherBatches(pageIndex = 1, pageSize = 20, searchString: string = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if ( searchString && searchString.length > 0) {
            obs$ = this.voucherService.searchVoucherBatch(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.voucherService.getVoucherBatches(pageIndex, pageSize);
        }

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize
            this.pageNumber = page.pageNumber;

            this.batches  = page.list;
            this.batchSubject.next(page.list);
        });
    }
}
