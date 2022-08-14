import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {UserService} from '../service/user.service';
import {Page} from '../service/utility/page';
import {User} from '../model/user.model';
import {SearchUserModel} from '../model/search-user.model';

export class UserDatasource implements DataSource<User> {
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;
    private userSubject = new BehaviorSubject<User[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private users: User[];
    private subscription: Subscription;

    constructor(private userService: UserService) {}

    get page() {
        return 0;
    }

    get length() {
        if (this.users) {
            return this.users.length;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<User[] | ReadonlyArray<User>> {
        return this.userSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userSubject.complete();
        this.loadingSubject.complete();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadAdminUsers(pageIndex: number, pageSize: number) {
        this.load(this.userService.findAdminUsers(pageIndex, pageSize));
    }

    loadOrdinaryUsers(pageIndex: number, pageSize: number) {
        this.load(this.userService.findOrdinaryUsers(pageIndex, pageSize));
    }

    loadUsers(pageIndex: number, pageSize: number, search: Partial<SearchUserModel> = null) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if (search) {
            this.load(this.userService.searchUsers(1, 20, search));
        } else {
            this.load(this.userService.findUsers(pageIndex, pageSize));
        }
    }

    loadOrganizationUsers(id: string, pageIndex = 1, pageSize = 20) {
        this.load(this.userService.findUserByOrganizationId(id, pageIndex, pageSize));
    }

    private load(ob$: Observable<Page<User>>) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

       ob$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.users = page.list;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.totalSize = page.totalSize;
            this.userSubject.next(page.list);
        });
    }
}
