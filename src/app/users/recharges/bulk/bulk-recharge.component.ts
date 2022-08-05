import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatSelectChange} from '@angular/material/select';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {BulkRechargeDatasource} from '../../../shared/datasource/bulk-recharge.datasource';
import {UtilityService} from '../../../shared/service/utility.service';
import {AuthRechargeService} from '../../../shared/service/auth-recharge.service';
import {BulkIndividualDatasource} from '../../../shared/datasource/bulk-individual.datasource';
import {Subscription} from 'rxjs/Subscription';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

@Component({
    selector: 'app-bulk-recharges-component',
    templateUrl: './bulk-recharge.component.html',
    styleUrls: ['./bulk-recharge.component.css']
})
export class BulkRechargesComponent implements OnInit, OnDestroy, OnChanges {
    @Input() userId: string;
    @Input() display: boolean;

    public bulkId: string;
    public busy = false;

    private mainBulkGrid = true;
    private mainIndividualGrid = true;

    private searchBulkId: string;
    private searchIndividualRecipient: string;
    private searchIndividualProduct: string;

    public selectedRowIndex = -1;
    public searchBulkById = false;
    public searchBulkOptions = ['Id', 'Date'];
    public searchBulkByDate = false;
    public showIndividualRequests = false;
    public bulkColumns = ['id', 'servicecost', 'date'];
    private byBulkIdSubscription: Subscription;

    @ViewChild('byBulkId')  byBulkId: ElementRef<HTMLInputElement>;

    constructor(private utilityService: UtilityService,
                private authService: AuthRechargeService) {}

    public bulkRechargeDate: Date = null;
    public bulkDataSource: BulkRechargeDatasource;

    ngOnChanges(changes: SimpleChanges): void {
        if (this.display) {
            this.bulkDataSource = new BulkRechargeDatasource(this.authService);
            this.bulkDataSource.loadRecharges(this.userId);
        }
    }

    ngOnDestroy(): void {
        if (this.byBulkIdSubscription) {
            this.byBulkIdSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
    }

    logBulkEvent($event: PageEvent) {
        this.showIndividualRequests = false;

        if (this.mainBulkGrid) {
            this.bulkDataSource.loadRecharges(this.userId, $event.pageIndex + 1, $event.pageSize);
        } else if (this.searchBulkById) {
            this.bulkDataSource.search({
                userId: this.userId,
                pageNumber: $event.pageIndex + 1,
                pageSize: $event.pageSize,
                searchId: this.searchBulkId
            });
        } else if (this.searchBulkByDate) {
            this.bulkDataSource.search({
                userId: this.userId,
                pageNumber: $event.pageIndex + 1,
                pageSize: $event.pageSize,
                searchDate: this.utilityService.stringifyDate(this.bulkRechargeDate)
            });
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
                        this.bulkDataSource.search({
                            userId: this.userId,
                            pageNumber: 1,
                            pageSize: 20,
                            searchId:  this.searchBulkId
                        });
                    } else {
                        this.mainBulkGrid = true;
                        this.bulkDataSource.loadRecharges(this.userId);
                    }
                })
            ).subscribe();
    }

    bulkValueChange($event: MatDatepickerInputEvent<unknown, unknown | null>) {
        if (!this.bulkRechargeDate) {
            this.mainBulkGrid = true;
            return this.bulkDataSource.loadRecharges(this.userId);
        }

        this.mainBulkGrid = false;

        this.bulkDataSource.search({
            userId: this.userId,
            pageNumber: 1,
            pageSize: 20,
            searchDate: this.utilityService.stringifyDate(this.bulkRechargeDate)
        });
    }

    highlight(row) {
        this.selectedRowIndex = row.id;
        this.showIndividualRequests = true;
        // this.individualDataSource = new BulkIndividualDatasource(this.authService);
        this.bulkId = row.id;
        // this.individualDataSource.loadIndividualRequests(row.id);
    }

}
