import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/service/user.service';
import {Subscription} from 'rxjs/Subscription';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {UserDatasource} from '../../shared/datasource/user.datasource';

@Component({
    selector: 'app-user-list',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.css']
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('input') input: ElementRef;
    public datasource: UserDatasource;
    public displayedColumns = ['username', 'email', 'firstname', 'lastname', 'actions'];
    private id: string = null;

    private eventSubscription: Subscription = null;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private userService: UserService) {}

    ngAfterViewInit(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }

        this.id = null;

        this.eventSubscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.datasource.loadUsers(1, 20, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.datasource = new UserDatasource(this.userService);
        this.datasource.loadUsers(1, 20);
    }

    logEvent($event: PageEvent) {
        this.datasource.loadUsers($event.pageIndex + 1, $event.pageSize);
    }

    onView(id) {
        this.router.navigate(['/users/userform', id]);
    }
}
