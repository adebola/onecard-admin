import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {Contact} from '../../shared/model/contact.model';
import {ContactService} from '../../shared/service/contact.service';

export class ContactDatasource implements DataSource<Contact> {
    private auditSubject = new BehaviorSubject<Contact[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private contacts: Contact[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private contactService: ContactService) {}

    get page() {

        if (this.contacts) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.contacts) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Contact[] | ReadonlyArray<Contact>> {
        return this.auditSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.auditSubject.complete();
        this.loadingSubject.complete();
    }

    loadContacts(pageIndex = 0, pageSize = 20, searchString: string = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.contactService.search(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.contactService.findAll(pageIndex, pageSize);
        }

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            console.log('PAGE', page);
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.contacts = page.list;
            this.auditSubject.next(page.list);
        });
    }
}
