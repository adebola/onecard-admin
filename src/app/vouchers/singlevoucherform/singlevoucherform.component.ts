import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe, formatCurrency} from '@angular/common';
import {VoucherService} from '../../shared/service/voucher.service';
import {NotificationService} from '../../shared/service/notification.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-single-voucher-form',
    templateUrl: './singlevoucherform.component.html'
})
export class SingleVoucherFormComponent implements OnInit, OnDestroy {

    public busy = false;
    public suspended = false;
    public activated = false;
    private id: string = null;
    public voucherForm: FormGroup;
    private subscription: Subscription;

    public expiryDate: Date = null;

    constructor(private router: Router,
                private fb: FormBuilder,
                private datePipe: DatePipe,
                private route: ActivatedRoute,
                private voucherService: VoucherService,
                private  notificationService: NotificationService) {}

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.createForm();
    }

    private createForm() {

        if (this.id) {
            this.voucherForm = this.fb.group({
                voucherId: [null],
                batchId: [null],
                createdon: [null],
                createdby: [null],
                activatedon: [null],
                activatedby: [null],
                serialNumber: [null],
                denomination: [null],
                activated: [null],
                expiryDate: [null]
            });

            this.subscription = this.voucherService.getVoucherById(this.id).pipe(
                catchError(err => {
                    console.log('SINGLEVOUCHERFORM ERROR', err);
                    return throwError(err);
                })
            ).subscribe(voucher => {
                if (voucher == null) {
                    this.notificationService.error('Error Loading Voucher : ' + this.id + '. It might not exist, please contact Technical Support');
                    return this.router.navigate(['/vouchers/voucher']);
                }

                this.activated = voucher.activated;
                this.suspended = voucher.suspended;

                this.voucherForm.patchValue({
                    voucherId: voucher.id,
                    batchId: voucher.batchId,
                    createdon: this.datePipe.transform(new Date(voucher.createdDate), 'mediumDate'),
                    createdby: voucher.createdBy,
                    denomination: formatCurrency(voucher.denomination, 'en-US', '₦'),
                    serialNumber: voucher.serialNumber,
                    activated: voucher.activated,
                    expiryDate: this.datePipe.transform(new Date(voucher.expiryDate), 'mediumDate'),
                });

                if (this.activated) {
                    this.voucherForm.patchValue({
                        activatedon: this.datePipe.transform(new Date(voucher.activationDate), 'mediumDate'),
                        activatedby: voucher.activatedBy,
                    });
                }
            });
        }
    }

    onSubmit(form: FormGroup) {
        return this.router.navigate(['/vouchers/voucher']);
    }

    onSuspend() {
        this.voucherService.suspendVoucher(this.id).subscribe(voucher => {
            this.suspended = voucher.suspended;
            this.notificationService
                .success('The Voucher has been suspended');
        });
    }

    onUnsuspend() {
        this.voucherService.unsuspendVoucher(this.id).subscribe(voucher => {
            this.suspended = voucher.suspended;
            this.notificationService.success('The Vouchers has been Un-suspended');
        });
    }
}
