import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ProviderService} from '../../shared/service/provider.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {ServiceAction} from '../../shared/model/provider.model';

export class ServiceActionDatasource implements DataSource<ServiceAction> {
    private actionSubject = new BehaviorSubject<ServiceAction[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private serviceActions: ServiceAction[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private providerService: ProviderService) {}

    get page() {

        if (this.serviceActions) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.serviceActions) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<ServiceAction[] | ReadonlyArray<ServiceAction>> {
        return this.actionSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.actionSubject.complete();
        this.loadingSubject.complete();
    }

    loadActionServices(pageIndex = 1, pageSize = 20, code: string) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.providerService.getServiceActions(pageIndex, pageSize, code).pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            console.log('SERVICEACTIONS', page);
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.serviceActions = page.list;
            this.actionSubject.next(page.list);
        });
    }
}
