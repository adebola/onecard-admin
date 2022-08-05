import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatSelectChange} from '@angular/material/select';
import {BulkIndividualDatasource} from '../../../shared/datasource/bulk-individual.datasource';
import {fromEvent, throwError} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {UtilityService} from '../../../shared/service/utility.service';
import {AuthRechargeService} from '../../../shared/service/auth-recharge.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {RetryModalComponent} from '../../modals/retry/retry-modal.component';
import {NotificationService} from '../../../shared/service/notification.service';
import {ResolveModalComponent} from '../../modals/resolve/resolve-modal.component';

@Component({
    selector: 'app-bulk-individual-recharge-component',
    templateUrl: './bulk-individual-recharge.component.html',
    styleUrls: ['./bulk-individual-recharge.component.css']
})
export class BulkIndividualRechargeComponent implements OnInit, OnDestroy, OnChanges {
    @Input() bulkId: string;
    @Input() type: string;

    public individualStatus = false;
    private mainIndividualGrid = true;

    public searchIndividualByProduct = false;
    public searchIndividualByStatus = false;
    public searchIndividualByRecipient = false;

    private searchIndividualRecipient: string;
    private searchIndividualProduct: string;

    public mainSingleGrid = true;
    public individualDataSource: BulkIndividualDatasource;

    public individualStatusOptions = null;
    public searchIndividualOptions = null;
    public individualColumns = null;

    private byIndividualProductSubscription: Subscription;
    private byIndividualRecipientSubscription: Subscription;

    private pageIndex = 1;
    private pageSize = 20;

    @ViewChild('byIndividualProduct') byIndividualProduct: ElementRef<HTMLInputElement>;
    @ViewChild('byIndividualRecipient') byIndividualRecipient: ElementRef<HTMLInputElement>;

    constructor(private matDialog: MatDialog,
                private utilityService: UtilityService,
                private authService: AuthRechargeService,
                private notificationService: NotificationService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.refreshDataSource();
    }

    ngOnDestroy(): void {
        if (this.byIndividualProductSubscription) {
            this.byIndividualProductSubscription.unsubscribe();
        }

        if (this.byIndividualRecipientSubscription) {
            this.byIndividualRecipientSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        if (this.type === 'normal') {
            this.individualStatusOptions = ['Success', 'Failure'];
            this.searchIndividualOptions = ['Status', 'Product', 'Recipient'];
            this.individualColumns = ['service', 'cost', 'recipient', 'status', 'retry', 'refund', 'resolve'];
        } else {
            this.searchIndividualOptions = ['Product', 'Recipient'];
            this.individualColumns = ['service', 'cost', 'recipient', 'retry', 'refund', 'resolve'];
        }
    }

    logIndividualEvent($event: PageEvent) {
        this.pageSize = $event.pageSize;
        this.pageIndex = $event.pageIndex + 1;
        this.refreshGrid();
    }

    private refreshGrid() {
        if (this.mainSingleGrid) {
            this.refreshDataSource();
        } else if (this.searchIndividualByProduct) {
            this.searchByProduct();
        } else if (this.searchIndividualByRecipient) {
            this.searchByRecipient();
        } else if (this.searchIndividualByStatus) {
            this.searchByStatus();
        }
    }

    private searchByProduct() {
        switch (this.type) {
            case 'normal':
                this.individualDataSource.search({
                    bulkId: this.bulkId,
                    product: this.searchIndividualProduct
                }, this.pageIndex, this.pageSize);
                break;

            case 'failed':
                this.individualDataSource.searchFailed({
                    bulkId: this.bulkId,
                    product: this.searchIndividualProduct,
                }, this.pageIndex, this.pageSize);
                break;

            case 'failed-unresolved':
                this.individualDataSource.searchFailed({
                    bulkId: this.bulkId,
                    product: this.searchIndividualProduct,
                    unresolved: true
                }, this.pageIndex, this.pageSize);
                break;

            default:
                break;
        }
    }

    private searchByRecipient() {
        switch (this.type) {
            case 'normal':
                this.individualDataSource.search({
                    bulkId: this.bulkId,
                    recipient: this.searchIndividualRecipient
                }, this.pageIndex, this.pageSize);
                break;

            case 'failed':
                this.individualDataSource.searchFailed({
                    bulkId: this.bulkId,
                    recipient: this.searchIndividualRecipient
                }, this.pageIndex, this.pageSize);
                break;

            case 'failed-unresolved':
                this.individualDataSource.searchFailed({
                    bulkId: this.bulkId,
                    recipient: this.searchIndividualRecipient
                }, this.pageIndex, this.pageSize);
                break;

            default:
                break;
        }
    }

    private searchByStatus() {
        switch (this.type) {
            case 'normal':
                this.individualDataSource.search({
                    bulkId: this.bulkId,
                    status: this.individualStatus
                }, this.pageIndex, this.pageSize);
                break;

            default:
                break;
        }
    }


    private refreshDataSource() {
        this.individualDataSource = new BulkIndividualDatasource(this.authService);

        switch (this.type) {
            case 'normal':
                this.individualDataSource.loadIndividualRequests(this.bulkId, this.pageIndex, this.pageSize);
                break;

            case 'failed':
                this.individualDataSource.loadFailedIndividualRequests(this.bulkId, this.pageIndex, this.pageSize);
                break;

            case 'failed-unresolved':
                this.individualDataSource.loadFailedUnresolvedIndividualRequests(this.bulkId, this.pageIndex, this.pageSize);
                break;

            default:
                break;
        }
    }

    onIndividualStatusChange($event: MatSelectChange) {
        this.mainSingleGrid = false;

        if ($event.value === 'Success') {
            this.individualStatus = false;
        } else {
            this.individualStatus = true;
        }

        this.searchByStatus();
    }

    onIndividualChange($event: MatSelectChange) {
        this.searchIndividualByStatus = false;
        this.searchIndividualByProduct = false;
        this.searchIndividualByRecipient = false;

        if ($event.value === 'Recipient') {
            this.searchIndividualByRecipient = true;

            setTimeout(() => {
                this.initByIndividualRecipient();
            }, 500);
        } else if ($event.value === 'Product') {
            this.searchIndividualByProduct = true;
            setTimeout(() => {
                this.initByIndividualProduct();
            }, 500);
        } else {
            this.searchIndividualByStatus = true;
        }
    }

    private initByIndividualRecipient() {
        if (this.byIndividualRecipientSubscription) {
            this.byIndividualRecipientSubscription.unsubscribe();
        }

        this.byIndividualRecipientSubscription = fromEvent(this.byIndividualRecipient.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.searchIndividualRecipient = this.byIndividualRecipient.nativeElement.value;

                    if (this.searchIndividualRecipient && this.searchIndividualRecipient.length > 0) {
                        this.mainIndividualGrid = false;
                        this.searchByRecipient();
                    } else {
                        this.mainIndividualGrid = true;
                        this.refreshDataSource();
                    }
                })
            ).subscribe();
    }

    private initByIndividualProduct() {
        if (this.byIndividualProductSubscription) {
            this.byIndividualProductSubscription.unsubscribe();
        }

        this.byIndividualProductSubscription = fromEvent(this.byIndividualProduct.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.searchIndividualProduct = this.byIndividualProduct.nativeElement.value;

                    if (this.searchIndividualProduct && this.searchIndividualProduct.length > 0) {
                        this.mainIndividualGrid = false;
                        this.searchByProduct();
                    } else {
                        this.mainIndividualGrid = true;
                        this.refreshDataSource();
                    }
                })
            ).subscribe();
    }

    openIndividualResolveModal(id) {
        this.getResolveModal(id, this.bulkId, 'individual').afterClosed().subscribe((result) => {
            if (result === 'submit') {
                this.refreshGrid();
            }
        });
    }

    openIndividualRetryModal(id: string, recipient: string) {
        this.getRetryModal(id, recipient, 'individual').afterClosed().subscribe((result) => {
            if (result === 'submit') {
                this.refreshGrid();
            }
        });
    }

    individualRefund(id: string) {
        this.authService.refundIndividualBulk(id, this.bulkId).pipe(
            catchError(err => {
                this.notificationService.error('Error refunding Individual Request: ' + err.error.message);
                return throwError(err);
            })
        ).subscribe(() =>
            this.notificationService.success('The individual request has been refunded successfully')
        );
    }

    refundAll() {
        this.authService.refundBulk(this.bulkId).pipe(
            catchError(err => {
                this.notificationService.error('Error refunding Bulk Request: ' + err.error.message);
                return throwError(err);
            })
        ).subscribe(() =>
            this.notificationService.success('The refunded request has been submitted successfully')
        );
    }

    resolveAll() {
        this.getResolveModal(null, this.bulkId, 'bulk').afterClosed().subscribe((result) => {
            if (result === 'submit') {
                this.refreshDataSource();
            }
        });
    }

    private getResolveModal(id: number, bulkId: string, type: string): MatDialogRef<ResolveModalComponent> {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.id = 'modal-dialog';
        dialogConfig.height = '350px';
        dialogConfig.width = '550px';
        dialogConfig.data = {id: id, bulkId: bulkId, type: type};
        return this.matDialog.open(ResolveModalComponent, dialogConfig);
    }

    private getRetryModal(id: string, recipient: string, type: string): MatDialogRef<RetryModalComponent> {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.id = 'modal-dialog';
        dialogConfig.height = '350px';
        dialogConfig.width = '550px';
        dialogConfig.data = {id: id, recipient: recipient, type: type};

        return this.matDialog.open(RetryModalComponent, dialogConfig);
    }

    retryAll(bulkId: string) {
        this.authService.retryBulk(bulkId).pipe(
            catchError(err => {
                this.notificationService.error('Error Retrying Request: ' + err.error.message);
                return throwError(err);
            })
        ).subscribe(() => {
            this.notificationService.success('The retry request has been submitted successfully');
        });
    }
}
