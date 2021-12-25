import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {ReportService} from '../../shared/service/report.service';
import {Report} from '../../shared/model/report.model';

export class ReportDatasource implements DataSource<Report> {
    private reportSubject = new BehaviorSubject<Report[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private reports: Report[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private reportService: ReportService) {}

    get page() {

        if (this.reports) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {

        if (this.reports) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Report[] | ReadonlyArray<Report>> {
        return this.reportSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.reportSubject.complete();
        this.loadingSubject.complete();
    }

    loadReports(pageIndex = 1, pageSize = 20, searchString: string = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.reportService.search(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.reportService.findAll(pageIndex, pageSize);
        }

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.totalSize = page.totalSize;
            this.pages = page.pages;
            this.pageSize = page.pageSize;
            this.pageNumber = page.pageNumber;
            this.reports = page.list;
            this.reportSubject.next(page.list);
        });
    }
}
