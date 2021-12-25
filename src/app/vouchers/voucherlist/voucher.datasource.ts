import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {VoucherService} from '../../shared/service/voucher.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {Voucher} from '../../shared/model/voucher.model';

export class VoucherDatasource implements DataSource<Voucher> {
    private voucherSubject = new BehaviorSubject<Voucher[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private vouchers: Voucher[];

    private subscription: Subscription;

    private pages: number;

    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private voucherService: VoucherService) {}

    get page() {

        if (this.vouchers) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.vouchers) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Voucher[] | ReadonlyArray<Voucher>> {
        return this.voucherSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.voucherSubject.complete();
        this.loadingSubject.complete();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadBatchVouchers(id: string, pageIndex = 1, pageSize = 20) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.voucherService.getVouchersByBatchId(pageIndex, pageSize, id).pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;

            this.vouchers  = page.list;
            this.voucherSubject.next(page.list);
        });
    }

    loadVouchers(pageIndex = 1, pageSize = 20, searchString: string = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if ( searchString && searchString.length > 0) {
            obs$ = this.voucherService.searchVoucher(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.voucherService.getVouchers(pageIndex, pageSize);
        }

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;

            this.vouchers  = page.list;
            this.voucherSubject.next(page.list);
        });
    }
}
