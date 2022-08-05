import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/service/user.service';
import {fromEvent, throwError} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {OrganizationDatasource} from './organization.datasource';
import {NotificationService} from '../../shared/service/notification.service';

@Component({
    selector: 'app-organization-list',
    templateUrl: './organizationlist.component.html',
    styleUrls: ['./organizationlist.component.css']
})
export class OrganizationListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('input') input: ElementRef;
    public datasource: OrganizationDatasource;
    public displayedColumns = ['id', 'organizationName', 'actions'];
    private id: string = null;

    private eventSubscription: Subscription = null;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private userService: UserService,
                 private notificationService: NotificationService) {}

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
                    this.datasource.loadOrganizations(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.datasource = new OrganizationDatasource(this.userService);
        this.datasource.loadOrganizations();
    }

    logEvent($event: PageEvent) {
        this.datasource.loadOrganizations($event.pageIndex + 1, $event.pageSize);
    }

    onEdit(id) {
        this.router.navigate(['/organizations/organizationform', id]);
    }

    onGenerate() {
        this.router.navigate(['/organizations/organizationform']);
    }

    onDelete(id) {
        this.userService.removeOrganization(id).pipe(
            catchError(err => {
                this.notificationService.error(err.error.message);
                return throwError(err);
            }),
        ).subscribe(() => {
            this.notificationService.success('Organization removed successfully');
            this.datasource.loadOrganizations();
        });
    }
}

