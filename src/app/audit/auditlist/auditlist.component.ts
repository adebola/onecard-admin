import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {AuditDatasource} from './audit.datasource';
import {Router} from '@angular/router';
import {AuditService} from '../../shared/service/audit.service';

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

    constructor( private router: Router,
                 private auditService: AuditService) {}

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {}

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
}
