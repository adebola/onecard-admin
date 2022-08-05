import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Organization} from '../../shared/model/organization.model';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {UserService} from '../../shared/service/user.service';
import {Page} from '../../shared/service/utility/page';
import {catchError, finalize} from 'rxjs/operators';

export class OrganizationDatasource implements DataSource<Organization> {
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;
    private orgSubject = new BehaviorSubject<Organization[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private organizations: Organization[];
    private subscription: Subscription;

    constructor(private userService: UserService) {}

    get page() {
        return 0;
    }

    get length() {

        if (this.organizations) {
            return this.organizations.length;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Organization[]> {
        return this.orgSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.orgSubject.complete();
        this.loadingSubject.complete();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadOrganizations(pageIndex = 1, pageSize = 20, searchString: string = null) {

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let ob$: Observable<Page<Organization>>;

        if (searchString) {
            ob$ = this.userService.searchOrganizations(searchString);
        } else {
            ob$ = this.userService.findAllOrganizations(pageIndex, pageSize);
        }

        this.subscription = ob$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.organizations = page.list;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.totalSize = page.totalSize;
            this.orgSubject.next(page.list);
        });
    }
}
