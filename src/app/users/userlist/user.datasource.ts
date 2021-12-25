import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {UserService} from '../../shared/service/user.service';
import {Page} from '../../shared/service/utility/page';
import {User} from '../../shared/model/user.model';

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

    loadUsers(searchString: string = null) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let ob$: Observable<Page<User>>;
        if (searchString) {
            ob$ = this.userService.searchUsers(searchString);
        } else {
            ob$ = this.userService.findUsers();
        }

        this.subscription = ob$.pipe(
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
