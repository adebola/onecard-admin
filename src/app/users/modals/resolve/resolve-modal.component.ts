import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthRechargeService} from '../../../shared/service/auth-recharge.service';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {NotificationService} from '../../../shared/service/notification.service';

@Component({
    selector: 'app-resolve-modal',
    templateUrl: './resolve-modal.component.html',
    styleUrls: ['./resolve-modal.component.css']
})

export class ResolveModalComponent implements  OnInit, OnDestroy {
    public resolveForm: FormGroup;

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: {id: string, bulkId: string, type: string},
                private authRechargeService: AuthRechargeService,
                private notificationService: NotificationService,
                public dialogRef: MatDialogRef<ResolveModalComponent>) { }

    ngOnDestroy(): void {}

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        console.log('DATA', this.data);

        this.resolveForm = this.fb.group({
            rechargeId: [this.data.type === 'bulk' ? this.data.bulkId : this.data.id],
            narrative: [null, Validators.required]
        });
    }

    onCancel() {
        this.dialogRef.close('cancel');
    }

    onSubmit(form: FormGroup) {
        if (!form.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!form.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const narrative = form.controls.narrative.touched ? form.value.narrative : null;

        let ob$:  Observable<any>;

        switch (this.data.type) {
            case 'single':
                ob$ = this.authRechargeService.resolveSingleRecharge(this.data.id, {
                    rechargeId: this.data.id,
                    message: narrative
                });
                break;

            case 'individual':
                ob$ = this.authRechargeService.resolveIndividualBulk(this.data.id, {
                    rechargeId: this.data.bulkId,
                    individualId: parseInt(this.data.id, 0),
                    message: narrative
                });
                break;

            case 'bulk':
                ob$ = this.authRechargeService.resolveBulk(this.data.bulkId, {
                    rechargeId: this.data.bulkId,
                    message: narrative
                });
                break;

            default:
                return console.error('Unknown Resolve type' + this.data.type);
        }

       ob$.pipe(
            catchError(err => {
                this.notificationService.error('Error closing request: ' + err.error.message);
                return throwError(err);
            })
        ).subscribe(value => {
            this.notificationService.success('The request has been closed resolution id: ' + value.id);
           this.dialogRef.close('submit');
        });
    }
}
