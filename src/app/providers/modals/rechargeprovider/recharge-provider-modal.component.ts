import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../../shared/service/notification.service';
import {MatSelectChange} from '@angular/material/select';
import {Observable, throwError} from 'rxjs';
import {RechargeProvider} from '../../../shared/model/recharge-provider.model';
import {catchError, map} from 'rxjs/operators';
import {ProviderServiceModel} from '../../../shared/model/provider-services.model';
import {Subscription} from 'rxjs/Subscription';
import {ProviderService} from '../../../shared/service/provider.service';

@Component({
    selector: 'app-recharge-provider-modal',
    templateUrl: './recharge-provider-modal.component.html',
    styleUrls: ['./recharge-provider-modal.component.css']
})
export class RechargeProviderModalComponent implements OnInit, OnDestroy {
    public rechargeForm: FormGroup;
    public rechargeProvider$: Observable<RechargeProvider[]>;
    public serviceProvider$: Observable<ProviderServiceModel[]>;

    private subscription: Subscription;

    public rechargeProvider: number;
    public serviceProvider: number;

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: {serviceId: number, providerId: number, priority: number, mode: string},
                private providerService: ProviderService,
                private notificationService: NotificationService,
                public dialogRef: MatDialogRef<RechargeProviderModalComponent>) { }

    ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
    }

    ngOnInit(): void {
        this.rechargeProvider$ = this.providerService.getAllRechargeProviders(1, 1000)
            .pipe(map(r => r.list));

        this.serviceProvider$ = this.providerService.getAllServices(1, 1000)
            .pipe(map(r => r.list));

        this.createForm();
    }

    onSubmit(rechargeForm: FormGroup) {
        if (!rechargeForm.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!rechargeForm.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const priority: number = rechargeForm.value.priority;
        const provider: number = rechargeForm.value.provider;
        const service: number = rechargeForm.value.service;

        if (this.subscription) { this.subscription.unsubscribe(); }

        let obs$: Observable<{status: number, message: string}>;

        if (this.data.mode === 'add') {
            obs$ = this.providerService.addRechargeProviderToService(provider, service, priority);
        } else {
            obs$ = this.providerService.amendRechargeProviderService(provider, service, priority);
        }

        this.subscription = obs$.pipe(
            catchError(err => this.handleError(err))
        ).subscribe(result => {
            if (  result.status === 200  ) {
                this.notificationService.success('The record has been amended / updated successfully');
                this.dialogRef.close('submit');
            } else {
                this.notificationService.error(result.message);
                this.dialogRef.close('cancel');
            }
        });
    }

    onServiceChange($event: MatSelectChange) {
        this.serviceProvider = $event.value;
    }

    onProviderChange($event: MatSelectChange) {
        this.rechargeProvider = $event.value;
    }

    onCancel() {
        this.dialogRef.close('cancel');
    }

    private createForm() {
        if (this.data.mode === 'add') {
            this.rechargeForm = this.fb.group({
                provider: [null, Validators.required],
                service: [this.data.serviceId, Validators.required],
                priority: [1, Validators.required]
            });
        } else {
            this.rechargeForm = this.fb.group({
                provider: [this.data.providerId, Validators.required],
                service: [this.data.serviceId, Validators.required],
                priority: [this.data.priority, Validators.required]
            });
        }
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        this.dialogRef.close('cancel');
        return throwError(err);
    }
}
