import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {ProviderService} from '../../shared/service/provider.service';
import {Provider} from '../../shared/model/provider.model';

export class ProviderDatasource implements DataSource<Provider> {
    private providerSubject = new BehaviorSubject<Provider[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private providers: Provider[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private providerService: ProviderService) {}

    get page() {

        if (this.providers) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.providers) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Provider[] | ReadonlyArray<Provider>> {
        return this.providerSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.providerSubject.complete();
        this.loadingSubject.complete();
    }

    loadProviders(pageIndex = 1, pageSize = 20, searchString: string = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.providerService.searchProviders(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.providerService.getProviders(pageIndex, pageSize);
        }

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.providers = page.list;
            this.providerSubject.next(page.list);
        });
    }
}
