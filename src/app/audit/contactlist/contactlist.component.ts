import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {ContactDatasource} from './contact.datasource';
import {ContactService} from '../../shared/service/contact.service';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-contact-list',
    templateUrl: './contactlist.component.html',
    styleUrls: ['./contactlist.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public datasource: ContactDatasource;
    private eventSubscription: Subscription;
    public displayedColumns = ['id', 'name', 'email', 'phone', 'view'];

    constructor( private router: Router,
                 private contactService: ContactService) {}

    ngAfterViewInit(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }


        this.eventSubscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.datasource.loadContacts(0, 20, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.datasource = new ContactDatasource(this.contactService);
        this.datasource.loadContacts();
    }

    onView(id) {
        this.router.navigate(['/audit/view-contact', id]);
    }

    logEvent($event: PageEvent) {
        this.datasource.loadContacts($event.pageIndex, $event.pageSize);
    }
}
