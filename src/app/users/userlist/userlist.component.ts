import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {UserDatasource} from './user.datasource';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/service/user.service';
import {Subscription} from 'rxjs/Subscription';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

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
                    this.datasource.loadUsers(this.input.nativeElement.value);
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
        this.datasource.loadUsers();
    }

    logEvent($event: PageEvent) {}

    onView(id) {
        this.router.navigate(['/users/userform', id]);
    }
}
