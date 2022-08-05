import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthRechargeService} from '../../../shared/service/auth-recharge.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-retry-modal',
    templateUrl: './retry-modal.component.html',
    styleUrls: ['./retry-modal.component.css']
})
export class RetryModalComponent implements OnInit, OnDestroy {
    public retryForm: FormGroup;
    private subscription: Subscription;

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: { id: string, recipient: string, type: string },
                private authRechargeService: AuthRechargeService,
                private notificationService: NotificationService,
                public dialogRef: MatDialogRef<RetryModalComponent>) {
    }

    ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
    }

    ngOnInit(): void {
        this.createForm();
    }

    onSubmit(form: FormGroup) {
        if (!form.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!form.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const rechargeId = form.value.rechargeId;
        const recipient = form.value.recipient;

        let ob$: Observable<any>;

        switch (this.data.type) {
            case 'single':
                ob$ = this.authRechargeService.retrySingleRecharge(rechargeId, recipient);
                break;

            case 'individual':
                ob$ = this.authRechargeService.retryIndividualBulk(rechargeId, recipient);
                break;

            default:
                return console.error('Unknown Retry Type: ', this.data.type);
        }

        if (this.subscription) { this.subscription.unsubscribe(); }

        this.subscription = ob$.pipe(
            catchError(err => {
                this.notificationService.error('Error Retrying Request: ' + err.error.message);
                return throwError(err);
            })
        ).subscribe(value => {
            if (value?.status === 200) {
                this.notificationService.success('The request has been re-tried successfully');
            } else {
                this.notificationService.error(value.message);
            }

            this.dialogRef.close('submit');
        });
    }

    private createForm() {
        this.retryForm = this.fb.group({
            rechargeId: [this.data.id],
            recipient: [this.data.recipient, Validators.required]
        });
    }

    onCancel() {
        this.dialogRef.close('cancel');
    }
}
