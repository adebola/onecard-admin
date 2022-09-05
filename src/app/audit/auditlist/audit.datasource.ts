import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {AuditService} from '../../shared/service/audit.service';
import {Audit} from '../../shared/model/audit.model';

export class AuditDatasource implements DataSource<Audit> {
    private auditSubject = new BehaviorSubject<Audit[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private audits: Audit[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private auditService: AuditService) {}

    get page() {

        if (this.audits) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.audits) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Audit[] | ReadonlyArray<Audit>> {
        return this.auditSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.auditSubject.complete();
        this.loadingSubject.complete();
        this.subscription.unsubscribe();
    }

    loadAudits(pageIndex = 0, pageSize = 20, searchString: string = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
        } else {
            obs$ = this.auditService.findAll(pageIndex, pageSize);
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
            this.audits = page.list;
            this.auditSubject.next(page.list);
        });
    }
}
