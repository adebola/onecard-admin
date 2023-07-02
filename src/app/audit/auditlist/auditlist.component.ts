import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {AuditDatasource} from './audit.datasource';
import {Router} from '@angular/router';
import {AuditService} from '../../shared/service/audit.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-audit-list',
    templateUrl: './auditlist.component.html',
    styleUrls: ['./auditlist.component.css']
})
export class AuditlistComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public datasource: AuditDatasource;
    public displayedColumns = ['user', 'action', 'date', 'view'];
    public startDate: Date = null;
    public endDate: Date = null;
    public subscription: Subscription = null;
    public busy = false;

    constructor( private router: Router,
                 private auditService: AuditService) {}

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
    }

    ngOnInit(): void {
        this.datasource = new AuditDatasource(this.auditService);
        this.datasource.loadAudits();
    }

    onView(id) {
        this.router.navigate(['/audit/view', id]);
    }

    logEvent($event: PageEvent) {
        this.datasource.loadAudits($event.pageIndex, $event.pageSize);
    }

    onDownload() {
        this.busy = true;
        if (this.subscription) { this.subscription.unsubscribe(); }

        this.subscription = this.auditService.runAuditReport(this.startDate, this.endDate).pipe(
            finalize(() => this.busy = false)
        ).subscribe(data => {
            const blob =
                new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const fileURL = URL.createObjectURL(blob);
            this.busy = false;
            window.open(fileURL);
        });
    }

    valueEndChange($event: MatDatepickerInputEvent<any, any>) {
        this.endDate = $event.value;
    }

    valueStartChange($event: MatDatepickerInputEvent<any, any>) {
        this.startDate = $event.value;
    }
}
