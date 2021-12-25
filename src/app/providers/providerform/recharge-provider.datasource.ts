import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ProviderService} from '../../shared/service/provider.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {RechargeProvider} from '../../shared/model/provider.model';

export class RechargeProviderDatasource implements DataSource<RechargeProvider> {
    private rechargeSubject = new BehaviorSubject<RechargeProvider[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    public loading$ = this.loadingSubject.asObservable();
    private rechargeProviders: RechargeProvider[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private providerService: ProviderService) {}

    get page() {

        if (this.rechargeProviders) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.rechargeProviders) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<RechargeProvider[] | ReadonlyArray<RechargeProvider>> {
        return this.rechargeSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.rechargeSubject.complete();
        this.loadingSubject.complete();
    }

    loadServiceProviderRechargeProviders(id: string) {
        this.subscription = this.providerService.getServiceRechargeProviders(id).pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(providers => {
            this.totalSize = providers.totalSize;
            this.pages = 1;
            this.pageSize = 20;
            this.pageNumber = 1;
            this.rechargeProviders = providers;
            this.rechargeSubject.next(providers);
        });
    }

    loadAllRechargeProviders(pageIndex = 1, pageSize = 20) {
        this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.providerService.getAllRechargeProviders(pageIndex, pageSize).pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.rechargeProviders = page.list;
            this.rechargeSubject.next(page.list);
        });
    }
}
