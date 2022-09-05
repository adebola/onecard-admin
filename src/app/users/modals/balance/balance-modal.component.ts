import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {catchError, finalize} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {NotificationService} from '../../../shared/service/notification.service';
import {AccountService} from '../../../shared/service/account.service';
import {Subscription} from 'rxjs/Subscription';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-balance-modal',
    templateUrl: './balance-modal.component.html',
    styleUrls: ['./balance-modal.component.css']
})
export class BalanceModalComponent implements  OnInit, OnDestroy {
    public busy = false;
    public selectedType = 1;
    public balanceForm: FormGroup;
    private accountSubscription: Subscription;
    @ViewChild('submit') submitButton: MatButton;
    public typeOptions = [{id: 1, description: 'Top-up Balance'}, {id: 2, description: 'Adjust Balance'}];

    constructor(private fb: FormBuilder,
                private accountService: AccountService,
                @Inject(MAT_DIALOG_DATA) public data: {id: string, bulkId: string, type: string},
                private notificationService: NotificationService,
                public dialogRef: MatDialogRef<BalanceModalComponent>) { }

    ngOnDestroy(): void {}

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

        let obs$: Observable<any>;

        if (this.selectedType === 1) {
            obs$ = this.accountService.updateBalance(this.data.id, balance, narrative);
        } else {
            obs$ = this.accountService.adjustBalance(this.data.id, balance, narrative);
        }

        this.busyForm();

        this.accountSubscription = obs$.pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.unBusyForm())
        ).subscribe((result) => {
            if (  result.status === 200  ) {
                this.notificationService.success('The User Balance has been updated accordingly');
                this.closDialog(result.balance);
            } else {
                this.notificationService.error(result.errMessage);
                this.closDialog('cancel');
            }
        });
    }

    onCancel() {
        this.closDialog('cancel');
    }

    private closDialog(status: any) {
        if (this.accountSubscription) {
            this.accountSubscription.unsubscribe();
        }

        this.dialogRef.close(status);
    }

    private createForm() {
        this.balanceForm = this.fb.group({
            balance: [null, Validators.required],
            narrative: [null, Validators.required]
        });
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        this.closDialog('cancel');
        return throwError(err);
    }

    private busyForm() {
        this.busy = true;
        this.submitButton.disabled = true;
    }

    private unBusyForm() {
        this.busy = false;
        this.submitButton.disabled = false;
    }
}
