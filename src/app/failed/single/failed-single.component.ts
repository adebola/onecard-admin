import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {SingleRechargeDatasource} from '../../shared/datasource/single-recharge.datasource';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {UtilityService} from '../../shared/service/utility.service';
import {AuthRechargeService} from '../../shared/service/auth-recharge.service';
import {NotificationService} from '../../shared/service/notification.service';
import {MatSelectChange} from '@angular/material/select';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {fromEvent, throwError} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ResolveModalComponent} from '../../users/modals/resolve/resolve-modal.component';
import {RetryModalComponent} from '../../users/modals/retry/retry-modal.component';
import {PageEvent} from '@angular/material/paginator';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-failed-single',
    templateUrl: './failed-single.component.html'
})
export class FailedSingleComponent implements OnInit, OnDestroy, OnChanges {
    public busy = false;

    private unresolved = false;

    private mainSingleGrid = true;
    public rechargeDate: Date = null;
    private searchRecipient: string;
    private searchProduct: string;

    public searchByDate = false;
    public searchByProduct = false;
    public searchByRecipient = false;
    public searchRechargeOptions = ['Recipient', 'Product', 'Date'];
    public singleColumns = ['id', 'servicecode', 'servicecost', 'date', 'retry', 'refund', 'resolve'];

    private byProductSubscription: Subscription;
    private byRecipientSubscription: Subscription;

    @ViewChild('byProduct') byProduct: ElementRef<HTMLInputElement>;
    @ViewChild('byRecipient') byRecipient: ElementRef<HTMLInputElement>;

    private singlePageIndex = 1;
    private singlePageSize = 20;

    public singleDatasource: SingleRechargeDatasource;

    constructor(public matDialog: MatDialog,
                private route: ActivatedRoute,
                private utilityService: UtilityService,
                private authService: AuthRechargeService,
                private notificationService: NotificationService) {}

    ngOnDestroy(): void {
        if (this.byRecipientSubscription) {
            this.byRecipientSubscription.unsubscribe();
        }

        if (this.byProductSubscription) {
            this.byProductSubscription.unsubscribe();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.singleDatasource = new SingleRechargeDatasource(this.authService);

        if (this.unresolved) {
            this.singleDatasource.loadFailedUnresolvedRecharges();
        } else {
            this.singleDatasource.loadFailedRecharges();
        }
    }

    ngOnInit(): void {
        this.route.url.subscribe(params => {
            if (params[0].path === 'single_unresolved') {
                this.unresolved = true;
            }

            this.singleDatasource = new SingleRechargeDatasource(this.authService);

            if (this.unresolved) {
                this.singleDatasource.loadFailedUnresolvedRecharges();
            } else {
                this.singleDatasource.loadFailedRecharges();
            }
        });
    }

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

            if (this.unresolved) {
                this.singleDatasource.loadFailedUnresolvedRecharges();
            } else {
                this.singleDatasource.loadFailedRecharges();
            }
        }

        this.mainSingleGrid = false;

        this.singleDatasource.searchFailed({
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
                        this.singleDatasource.searchFailed({
                            searchRecipient: this.searchRecipient
                        });
                    } else {
                        this.mainSingleGrid = true;

                        if (this.unresolved) {
                            this.singleDatasource.loadFailedUnresolvedRecharges();
                        } else {
                            this.singleDatasource.loadFailedRecharges();
                        }
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
                        this.singleDatasource.searchFailed({
                            searchProduct: this.searchProduct
                        });
                    } else {
                        this.mainSingleGrid = true;

                        if (this.unresolved) {
                            this.singleDatasource.loadFailedUnresolvedRecharges();
                        } else {
                            this.singleDatasource.loadFailedRecharges();
                        }
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

            if (this.unresolved) {
                this.singleDatasource.loadFailedUnresolvedRecharges(this.singlePageIndex, this.singlePageSize);
            } else {
                this.singleDatasource.loadFailedRecharges(this.singlePageIndex, this.singlePageSize);
            }
        });
    }

    openResolveModal(id) {
        const modalDialog = this.matDialog.open(ResolveModalComponent, this.configureModal(
            {
                id: id, bulkId: null, type: 'single', recipient: null
            })
        );

        modalDialog.afterClosed().subscribe((result) => {
            if (result === 'submit') {
                if (this.unresolved) {
                    this.singleDatasource.loadFailedUnresolvedRecharges(this.singlePageIndex, this.singlePageSize);
                } else {
                    this.singleDatasource.loadFailedRecharges(this.singlePageIndex, this.singlePageSize);
                }
            }
        });
    }

    openRetryModal(id: string, recipient: string) {
        const modalDialog = this.matDialog.open(RetryModalComponent, this.configureModal(
            {
                id: id, recipient: recipient, type: 'single', bulkId: null
            })
        );

        modalDialog.afterClosed().subscribe((result) => {
           if (result === 'submit') {
               if (this.unresolved) {
                   this.singleDatasource.loadFailedUnresolvedRecharges(this.singlePageIndex, this.singlePageSize);
               } else {
                   this.singleDatasource.loadFailedRecharges(this.singlePageIndex, this.singlePageSize);
               }
           }
        });
    }

    logSingleEvent($event: PageEvent) {
        if (this.mainSingleGrid) {
            this.singlePageIndex = $event.pageIndex + 1;
            this.singlePageSize = $event.pageSize;

            if (this.unresolved) {
                this.singleDatasource.loadFailedUnresolvedRecharges(this.singlePageIndex, this.singlePageSize);
            } else {
                this.singleDatasource.loadFailedRecharges(this.singlePageIndex, this.singlePageSize);
            }
        } else if (this.searchByDate) {
            this.singleDatasource.searchFailed({
                searchRecipient: this.searchRecipient
            });
        } else if (this.searchByProduct) {
            this.singleDatasource.searchFailed({
                searchProduct: this.searchProduct
            });
        } else if (this.searchByDate) {
            this.singleDatasource.searchFailed({
                searchDate: this.utilityService.stringifyDate(this.rechargeDate)
            });
        }
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
}
