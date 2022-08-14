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
    private admin = false;

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

                    if (this.input.nativeElement.value && this.input.nativeElement.value.length > 0) {
                        this.datasource.loadUsers(1, 20,
                            {
                                search: this.input.nativeElement.value,
                                admin: this.admin ? true : null,
                                ordinary: this.admin ? null : true
                            });
                    } else {
                        this.loadUsers(1, 20);
                    }
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.route.url.subscribe(params => {
            this.datasource = new UserDatasource(this.userService);

            if (params[0].path === 'adminuser') {
               this.admin = true;
            }

            this.loadUsers(1, 20);
        });
    }

    logEvent($event: PageEvent) {
        this.loadUsers($event.pageIndex + 1, $event.pageSize);
    }

    onView(id) {
        this.router.navigate(['/users/userform', id]);
    }

    private loadUsers(index: number, page: number) {
        if (this.admin) {
            this.datasource.loadAdminUsers(1, 20);
        } else {
            this.datasource.loadOrdinaryUsers(1, 20);
        }
    }
}
