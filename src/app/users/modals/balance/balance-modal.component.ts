import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {NotificationService} from '../../../shared/service/notification.service';
import {AccountService} from '../../../shared/service/account.service';
import {Provider} from '../../../shared/model/provider.model';

@Component({
    selector: 'app-balance-modal',
    templateUrl: './balance-modal.component.html',
    styleUrls: ['./balance-modal.component.css']
})

export class BalanceModalComponent implements  OnInit, OnDestroy {
    public balanceForm: FormGroup;

    constructor(private fb: FormBuilder,
                private accountService: AccountService,
                @Inject(MAT_DIALOG_DATA) public data: {id: string, bulkId: string, type: string},
                private notificationService: NotificationService,
                public dialogRef: MatDialogRef<BalanceModalComponent>) { }

    ngOnDestroy(): void {
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

        const narrative = form.value.narrative;
        const balance = form.value.balance;

        this.accountService.updateBalance(this.data.id, balance, narrative).pipe(
            catchError(err => this.handleError(err)),
        ).subscribe((result) => {
            if (  result.status === 200  ) {
                this.notificationService.success('The User Balance has been updated accordingly');
                this.dialogRef.close(result.balance);
            } else {
                this.notificationService.error(result.errMessage);
                this.dialogRef.close('cancel');
            }
        });
    }

    onCancel() {
        this.dialogRef.close('cancel');
    }

    private createForm() {
        console.log('DATA', this.data);

        this.balanceForm = this.fb.group({
            balance: [null, Validators.required],
            narrative: [null, Validators.required]
        });
    }

    private handleSuccess(provider: Provider) {
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        return throwError(err);
    }
}
