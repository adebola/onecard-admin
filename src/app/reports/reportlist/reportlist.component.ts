import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {ReportService} from '../../shared/service/report.service';
import {ReportDatasource} from './report.datasource';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, finalize, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';

const RECHARGE_REPORT = 1;
const WALLET_REPORT = 2;
const PROVIDER_BALANCE_REPORT = 3;
const TRANSACTION_REPORT = 4;

@Component({
    selector: 'app-report-list',
    templateUrl: './reportlist.component.html',
    styleUrls: ['./reportlist.component.css']
})
export class ReportListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public busy = false;
    public datasource: ReportDatasource;
    public displayedColumns = ['id', 'name', 'run'];
    private subscription: Subscription = null;

    constructor( private router: Router,
                 private reportService: ReportService) {}

    ngAfterViewInit(): void {
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.datasource.loadReports(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    ngOnDestroy(): void {}

    ngOnInit(): void {
        this.datasource = new ReportDatasource(this.reportService);
        this.datasource.loadReports();
    }

    onRun(id: number) {
        switch (id) {
            case RECHARGE_REPORT:
                this.router.navigate(['/reports/recharge'])
                    .then(r => {});
                break;

            case WALLET_REPORT:
                this.router.navigate(['/reports/wallet'])
                    .then(r => {});
                break;

            case PROVIDER_BALANCE_REPORT:
                if (this.subscription) { this.subscription.unsubscribe(); }
                this.subscription = this.reportService.runProviderBalanceReport().pipe(
                    finalize(() => this.busy = false)
                ).subscribe(data => {
                    const blob =
                        new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    const fileURL = URL.createObjectURL(blob);
                    this.busy = false;
                    window.open(fileURL);
                });
                break;

            case TRANSACTION_REPORT:
                this.router.navigate(['/reports/transaction'])
                    .then(r => {});
                break;

            default: {
                console.error('Invalid Route ', id);
                break;
            }
        }
    }

    onRun_OLD(id) {
        this.busy = true;

        this.reportService.runReport(id).pipe(
            finalize(() => this.busy = false)
        ).subscribe(data => {
            const blob = new Blob([data], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(blob);
            this.busy = false;
            window.open(fileURL);
        });
    }

    logEvent($event: PageEvent) {
        this.datasource.loadReports($event.pageIndex, $event.pageSize);
    }
}
