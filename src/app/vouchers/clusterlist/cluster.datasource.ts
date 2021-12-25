import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {VoucherService} from '../../shared/service/voucher.service';
import {Cluster} from '../../shared/model/voucher.model';

export class ClusterDatasource implements DataSource<Cluster> {
    private clusterSubject = new BehaviorSubject<Cluster[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private clusters: Cluster[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private voucherService: VoucherService) {}

    get page() {

        if (this.clusters) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.clusters) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Cluster[] | ReadonlyArray<Cluster>> {
        return this.clusterSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.clusterSubject.complete();
        this.loadingSubject.complete();
    }

    loadClusters(pageIndex = 1, pageSize = 20, searchString: string = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.voucherService.searchClusters(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.voucherService.getClusters(pageIndex, pageSize);
        }

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            console.log('PAGE', page);
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.clusters = page.list;
            this.clusterSubject.next(page.list);
        });
    }
}
