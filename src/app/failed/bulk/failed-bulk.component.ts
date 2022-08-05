import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {UtilityService} from '../../shared/service/utility.service';
import {AuthRechargeService} from '../../shared/service/auth-recharge.service';
import {BulkRechargeDatasource} from '../../shared/datasource/bulk-recharge.datasource';
import {PageEvent} from '@angular/material/paginator';
import {MatSelectChange} from '@angular/material/select';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-failed-bulk',
    templateUrl: './failed-bulk.component.html',
    styleUrls: ['./failed-bulk.component.css']
})
export class FailedBulkComponent implements OnInit, OnDestroy, OnChanges {
    public bulkId: string;
    public busy = false;
    private unresolved = false;
    public type: string;

    private mainBulkGrid = true;
    private searchBulkId: string;

    public selectedRowIndex = -1;
    public searchBulkById = false;
    public searchBulkOptions = ['Id', 'Date'];
    public searchBulkByDate = false;
    public showIndividualRequests = false;
    public bulkColumns = ['id', 'servicecost', 'date'];
    private byBulkIdSubscription: Subscription;

    private bulkPageIndex = 1;
    private bulkPageSize = 20;

    public bulkRechargeDate: Date = null;
    public bulkDataSource: BulkRechargeDatasource;

    @ViewChild('byBulkId')  byBulkId: ElementRef<HTMLInputElement>;

    constructor(private route: ActivatedRoute,
                private utilityService: UtilityService,
                private authService: AuthRechargeService) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.bulkDataSource = new BulkRechargeDatasource(this.authService);
        this.reload();
    }

    ngOnDestroy(): void {
        if (this.byBulkIdSubscription) {
            this.byBulkIdSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.route.url.subscribe(params => {
            if (params[0].path === 'bulk_unresolved') {
                this.unresolved = true;
                this.type = 'failed-unresolved';
            } else {
                this.type = 'failed';
            }

            this.bulkDataSource = new BulkRechargeDatasource(this.authService);
            this.reload();
        });
    }

    logBulkEvent($event: PageEvent) {
        this.showIndividualRequests = false;

        this.bulkPageIndex = $event.pageIndex + 1;
        this.bulkPageSize = $event.pageSize;

        if (this.mainBulkGrid) {
            if (this.unresolved) {
                this.bulkDataSource.loadFailedUnresolvedRecharges(this.bulkPageIndex, this.bulkPageSize);
            } else {
                this.bulkDataSource.loadFailedRecharges(this.bulkPageIndex, this.bulkPageSize);
            }
        } else if (this.searchBulkById) {
            this.bulkDataSource.searchFailed({
                searchId: this.searchBulkId,
                unresolved: this.unresolved ? this.unresolved : null
            }, this.bulkPageIndex, this.bulkPageSize);
        } else if (this.searchBulkByDate) {
            this.bulkDataSource.searchFailed({
                searchDate: this.utilityService.stringifyDate(this.bulkRechargeDate),
                unresolved: this.unresolved ? this.unresolved : null
            }, this.bulkPageIndex, this.bulkPageSize);
        }
    }

    onBulkChange($event: MatSelectChange) {
        this.searchBulkById = false;
        this.searchBulkByDate = false;

        if ($event.value === 'Id') {
            this.searchBulkById = true;
            setTimeout(() => {
                this.initByBulkId();
            }, 500);
        } else {
            this.searchBulkByDate = true;
        }
    }

    private initByBulkId() {
        if (this.byBulkIdSubscription) {
            this.byBulkIdSubscription.unsubscribe();
        }

        this.byBulkIdSubscription = fromEvent(this.byBulkId.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.searchBulkId = this.byBulkId.nativeElement.value;

                    if (this.searchBulkId && this.searchBulkId.length > 0) {
                        this.mainBulkGrid = false;
                        this.bulkDataSource.searchFailed({
                            searchId:  this.searchBulkId,
                            unresolved: this.unresolved ? this.unresolved : null
                        }, 1, 20);
                    } else {
                        this.mainBulkGrid = true;
                        this.reload();
                    }
                })
            ).subscribe();
    }

    bulkValueChange($event: MatDatepickerInputEvent<unknown, unknown | null>) {
        if (!this.bulkRechargeDate) {
            this.mainBulkGrid = true;
            return this.reload();
        }

        this.mainBulkGrid = false;

        this.bulkDataSource.searchFailed({
            searchDate: this.utilityService.stringifyDate(this.bulkRechargeDate),
            unresolved: this.unresolved ? this.unresolved : null
        }, 1, 20);
    }

    highlight(row) {
        this.selectedRowIndex = row.id;
        this.showIndividualRequests = true;
        // this.individualDataSource = new BulkIndividualDatasource(this.authService);
        this.bulkId = row.id;
        // this.individualDataSource.loadIndividualRequests(row.id);
    }

    private reload() {
        if (this.unresolved) {
            this.bulkDataSource.loadFailedUnresolvedRecharges();
        } else {
            this.bulkDataSource.loadFailedRecharges();
        }
    }
}
