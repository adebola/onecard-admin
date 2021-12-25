import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ProviderService} from '../../shared/service/provider.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {ProviderCategory} from '../../shared/model/provider.model';

export class ProviderCategoryDatasource implements DataSource<ProviderCategory> {

    private categorySubject = new BehaviorSubject<ProviderCategory[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private providerCategories: ProviderCategory[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private providerService: ProviderService) {}

    get page() {

        if (this.providerCategories) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.providerCategories) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<ProviderCategory[] | ReadonlyArray<ProviderCategory>> {
        return this.categorySubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.categorySubject.complete();
        this.loadingSubject.complete();
    }

    loadProviderCategories(pageIndex = 1, pageSize = 20, searchString: string = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.providerService.searchProviderCategories(pageIndex, pageSize, searchString).pipe(
                catchError(() => of(null)),
                finalize(() => this.loadingSubject.next(false))
            );
        } else {
            obs$ = this.providerService.getProviderCategories(pageIndex, pageSize).pipe(
                catchError(() => of(null)),
                finalize(() => this.loadingSubject.next(false))
            );
        }

        this.subscription = obs$.subscribe(page => {
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.providerCategories  = page.list;
            this.categorySubject.next(page.list);
        });
    }
}
