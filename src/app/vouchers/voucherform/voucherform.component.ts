import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { VoucherService} from '../../shared/service/voucher.service';
import {Subscription} from 'rxjs/Subscription';
import {catchError, finalize} from 'rxjs/operators';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {NotificationService} from '../../shared/service/notification.service';
import {DatePipe} from '@angular/common';
import {saveAs} from 'file-saver';
import {Batch, Cluster} from '../../shared/model/voucher.model';


@Component({
    selector: 'app-voucher-form',
    templateUrl: './voucherform.component.html'
})
export class VoucherFormComponent implements OnInit, OnDestroy {

    public busy = false;
    public editMode = false;
    private activatedSubject = new BehaviorSubject<boolean>(false);
    private suspendedSubject = new BehaviorSubject<boolean>(false);
    public activated$ = this.activatedSubject.asObservable();
    public suspended$ = this.suspendedSubject.asObservable();
    public voucherForm: FormGroup;
    public clusters$: Observable<Cluster[]>;
    public expiryDate: Date = null;
    private id: string = null;
    private subscription: Subscription;
    private saveAsSubscription: Subscription;
    private batch: Batch;

    @ViewChild('expirydate') datePicker: HTMLInputElement;

    constructor(private router: Router,
                private fb: FormBuilder,
                private datePipe: DatePipe,
                private route: ActivatedRoute,
                private voucherService: VoucherService,
                private notificationService: NotificationService) {
    }

    public ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.editMode = !!this.id;

        if (!this.editMode) {
            this.clusters$ = this.voucherService.getValidClusters();
        }

        this.createForm();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if (this.saveAsSubscription) {
            this.saveAsSubscription.unsubscribe();
        }

        this.activatedSubject.complete();
        this.suspendedSubject.complete();
    }

    onSubmit(form: FormGroup) {

        if (!form.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!form.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const denomination: number = form.value.denomination;
        const count: number = form.value.count;
        let clusterId;

        if (this.editMode) {
            clusterId = this.batch.clusterId;
        } else {
            clusterId = form.value.selectcluster;
        }

        const computedDate = new Date(this.expiryDate);
        const month: number = computedDate.getMonth() + 1;
        let newMonth: string = String(month);

        let obs$: Observable<Batch>;

        if (month < 10) {
            newMonth = '0' + newMonth;
        }

        this.busy = true;

        if (this.editMode) {
            obs$ = this.voucherService.updateVoucherBatch(this.id, {
                denomination: denomination,
                voucherCount: count,
                clusterId: clusterId,
                expiryDate: computedDate.getFullYear() + '-' + newMonth + '-' + computedDate.getDate()
            });
        } else {

            obs$ = this.voucherService.saveVoucherBatch({
                denomination: denomination,
                voucherCount: count,
                clusterId: clusterId
            });
        }

        obs$.pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe(batch => this.handleSuccess(batch));
    }

    downloadFile() {

        if (this.saveAsSubscription) {
            this.saveAsSubscription.unsubscribe();
        }

        this.saveAsSubscription = this.voucherService.getCodeFile(this.id).subscribe(data => {
            saveAs(data, 'onecard.xlsx');
        });
    }

    onActivate() {
        this.voucherService.activateBatch(this.id).subscribe(batch => {
            this.activatedSubject.next(batch.activated);
            this.notificationService
                .success('The Batch has been activated, please note it cannot be de-activated but it can be suspended');
        });
    }

    onSuspend() {
        this.voucherService.suspendBatch(this.id).subscribe(batch => {
           this.suspendedSubject.next(batch.suspended);
            this.notificationService
                .success('The Batch has been Suspended Successfully');
        });
    }

    onUnsuspend() {
        this.voucherService.unsuspendBatch(this.id).subscribe(batch => {
            this.suspendedSubject.next(batch.suspended);
            this.notificationService
                .success('The Batch has been Un-Suspended Successfully');
        });
    }

    private createForm() {
        if (this.id) {
            this.voucherForm = this.fb.group({
                batchId: [null],
                cluster: [null],
                createdon: [null],
                createdby: [null],
                denomination: [null, Validators.required],
                count: [null, Validators.required],
                activationDate: [null],
                activatedBy: [null],
                expiryDate: [null, Validators.required],
            });

            this.subscription = this.voucherService.getVoucherBatch(this.id).pipe(
                catchError(err => {
                    return throwError(err);
                })
            ).subscribe(batch => {
                if (batch == null) {
                    this.notificationService.error('Error Loading Batch : ' + this.id + '. It might not exist, please contact Technical Support');
                    return this.router.navigate(['/vouchers/voucher']);
                }

                this.batch = batch;
                this.suspendedSubject.next(batch.suspended);
                this.activatedSubject.next(batch.activated);

                let activateDateString: String = null;

                if (batch.activationDate) {
                    activateDateString = this.datePipe.transform(batch.activationDate);
                }

                this.voucherForm.patchValue({
                    batchId: batch.id,
                    createdon: this.datePipe.transform(new Date(batch.createdDate), 'mediumDate'),
                    createdby: batch.createdBy,
                    denomination: batch.denomination,
                    count: batch.voucherCount,
                    activationDate: activateDateString,
                    activatedBy: batch.activatedBy
                });

                if (batch.expiryDate) {
                    this.expiryDate = new Date(batch.expiryDate);
                }

                this.voucherService.getClusterById(batch.clusterId).subscribe(cluster => {
                    this.voucherForm.patchValue({
                        cluster: cluster.name
                    });
                });
            });
        } else {
            this.voucherForm = this.fb.group({
                denomination: [null, Validators.required],
                count: [null, Validators.required],
                selectcluster: [null, Validators.required]
            });
        }
    }

    private handleSuccess(b: Batch) {
        this.notificationService.success('Vouchers have been saved / updated accordingly');
        this.router.navigate(['/vouchers/voucherform', b.id]);
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        return throwError(err);
    }
}
