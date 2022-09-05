import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {fromEvent, throwError} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, finalize, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {SingleRechargeDatasource} from '../../../shared/datasource/single-recharge.datasource';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ResolveModalComponent} from '../../modals/resolve/resolve-modal.component';
import {RetryModalComponent} from '../../modals/retry/retry-modal.component';
import {AuthRechargeService} from '../../../shared/service/auth-recharge.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {PageEvent} from '@angular/material/paginator';
import {UtilityService} from '../../../shared/service/utility.service';

@Component({
    selector: 'app-single-recharges-component',
    templateUrl: './single-recharges.component.html',
    styleUrls: ['./single-recharges.component.css']
})
export class SingleRechargesComponent implements OnInit, OnDestroy, OnChanges {
    @Input() userId: string;
    @Input() display: boolean;
    public busy = false;

    private mainSingleGrid = true;
    public rechargeDate: Date = null;
    private searchRecipient: string;
    private searchProduct: string;

    public searchByDate = false;
    public searchByProduct = false;
    public searchByRecipient = false;
    public searchRechargeOptions = ['Recipient', 'Product', 'Date'];
    public singleColumns = ['id', 'servicecode', 'servicecost', 'date', 'status', 'retry', 'refund', 'resolve'];

    private byProductSubscription: Subscription;
    private byRecipientSubscription: Subscription;

    @ViewChild('byProduct') byProduct: ElementRef<HTMLInputElement>;
    @ViewChild('byRecipient') byRecipient: ElementRef<HTMLInputElement>;

    private singlePageIndex = 1;
    private singlePageSize = 20;

    public singleDatasource: SingleRechargeDatasource;

    ngOnDestroy(): void {
        if (this.byRecipientSubscription) {
            this.byRecipientSubscription.unsubscribe();
        }

        if (this.byProductSubscription) {
            this.byProductSubscription.unsubscribe();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.display) {
            this.singleDatasource = new SingleRechargeDatasource(this.authService);
            this.singleDatasource.loadRecharges(this.userId);
        }
    }

    ngOnInit(): void {}

    constructor(public matDialog: MatDialog,
                private utilityService: UtilityService,
                private authService: AuthRechargeService,
                private notificationService: NotificationService) {}

    onChange($event: MatSelectChange) {
        this.searchByDate = false;
        this.searchByRecipient = false;
        this.searchByProduct = false;

        if ($event.value === 'Recipient') {
            this.searchByRecipient = true;
            setTimeout(() => {
                this.initByRecipient();
            }, 500);
        } else if ($event.value === 'Product') {
            this.searchByProduct = true;
            setTimeout(() => {
                this.initByProduct();
            }, 500);
        } else {
            this.searchByDate = true;
        }
    }

    valueChange($event: MatDatepickerInputEvent<unknown, unknown | null>) {
        if (!this.rechargeDate) {
            this.mainSingleGrid = true;
            return this.singleDatasource.loadRecharges(this.userId);
        }

        this.mainSingleGrid = false;

        this.singleDatasource.search({
            userId: this.userId,
            pageNumber: 1,
            pageSize: 20,
            searchDate: this.utilityService.stringifyDate(this.rechargeDate)
        });
    }

    private initByRecipient() {
        if (this.byRecipientSubscription) {
            this.byRecipientSubscription.unsubscribe();
        }

        this.byRecipientSubscription = fromEvent(this.byRecipient.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.searchRecipient = this.byRecipient.nativeElement.value;

                    if (this.searchRecipient && this.searchRecipient.length > 0) {
                        this.mainSingleGrid = false;
                        this.singleDatasource.search({
                            userId: this.userId,
                            pageNumber: 1,
                            pageSize: 20,
                            searchRecipient: this.searchRecipient
                        });
                    } else {
                        this.mainSingleGrid = true;
                        this.singleDatasource.loadRecharges(this.userId);
                    }
                })
            ).subscribe();
    }

    private initByProduct() {
        if (this.byProductSubscription) {
            this.byProductSubscription.unsubscribe();
        }

        this.byProductSubscription = fromEvent(this.byProduct.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.searchProduct = this.byProduct.nativeElement.value;
                    if (this.searchProduct && this.searchProduct.length > 0) {
                        this.mainSingleGrid = false;
                        this.singleDatasource.search({
                            userId: this.userId,
                            pageNumber: 1,
                            pageSize: 20,
                            searchProduct: this.searchProduct
                        });
                    } else {
                        this.mainSingleGrid = true;
                        this.singleDatasource.loadRecharges(this.userId);
                    }
                })
            ).subscribe();
    }

    singleRefund(id) {
        console.log('SingleRefund', id);
        this.authService.refundSingleRecharge(id).pipe(
            catchError(err => {
                this.notificationService.error('Error Refunding Recharge: ' + err.error.message);
                return throwError(err);
            })
        ).subscribe(m => {
            this.notificationService.success(m.message);
            this.singleDatasource.loadRecharges(this.userId, this.singlePageIndex, this.singlePageSize)
        });
    }

    openSingleModal(id) {
        const modalDialog = this.matDialog.open(ResolveModalComponent, this.configureModal(
            {id: id, bulkId: null, type: 'single'}
        ));
        modalDialog.afterClosed().subscribe((result) => {
            if (result === 'submit') { this.reloadPage(); }
        });
    }

    openRefundModal(id: string, recipient: string) {
        const modalDialog = this.matDialog.open(RetryModalComponent, this.configureModal(
            {id: id, recipient: recipient, type: 'single'}
        ));
        modalDialog.afterClosed().subscribe((result) => {
            if (result === 'submit') { this.reloadPage(); }
        });
    }

    logSingleEvent($event: PageEvent) {
        if (this.mainSingleGrid) {
            this.singlePageIndex = $event.pageIndex + 1;
            this.singlePageSize = $event.pageSize;

            this.singleDatasource.loadRecharges(this.userId, this.singlePageIndex , this.singlePageSize );
        } else if (this.searchByDate) {
            this.singleDatasource.search({
                userId: this.userId,
                pageNumber: $event.pageIndex + 1,
                pageSize: $event.pageSize,
                searchRecipient: this.searchRecipient
            });
        } else if (this.searchByProduct) {
            this.singleDatasource.search({
                userId: this.userId,
                pageNumber: $event.pageIndex + 1,
                pageSize: $event.pageSize,
                searchProduct: this.searchProduct
            });
        } else if (this.searchByDate) {
            this.singleDatasource.search({
                userId: this.userId,
                pageNumber: $event.pageIndex + 1,
                pageSize: $event.pageSize,
                searchDate: this.utilityService.stringifyDate(this.rechargeDate)
            });
        }
    }

    private reloadPage() {
        this.singleDatasource.loadRecharges(this.userId, this.singlePageIndex, this.singlePageSize)
    }

    private configureModal(data: Partial<{id: string, recipient: string, type: string, bulkId: string}>): MatDialogConfig {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.id = 'modal-dialog';
        dialogConfig.height = '350px';
        dialogConfig.width = '550px';
        dialogConfig.data = data;

        return dialogConfig;
    }

    onDownload() {
        this.authService.downloadSingleFailedByUserId(this.userId).pipe(
            finalize(() => this.busy = false)
        ).subscribe(data => {
            console.log(data);
            const blob = new Blob([data], {type: 'application/vnd.ms-excel'});
            const fileURL = URL.createObjectURL(blob);
            this.busy = false;
            window.open(fileURL);
        });
    }
}
