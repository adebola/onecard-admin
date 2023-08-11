import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {AccountService} from '../../../shared/service/account.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-limit-modal',
    templateUrl: './daily-limit-modal.component.html',
})
export class DailyLimitModalComponent implements  OnInit, OnDestroy {
    public busy = false;
    public limitForm: FormGroup;
    @ViewChild('input') input: ElementRef<HTMLInputElement>;
    @ViewChild('submit') submitButton: MatButton;

    private subscription: Subscription = null;

    constructor(private fb: FormBuilder,
                private accountService: AccountService,
                private notificationService: NotificationService,
                public dialogRef: MatDialogRef<DailyLimitModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {id: string, bulkId: string, type: string}) { }

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
        const limit = form.value.limit;

        this.busyForm();

        this.subscription = this.accountService.updateLimit(this.data.id, limit, narrative).pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.unBusyForm())
        ).subscribe((result) => {
            this.closDialog(limit);
        });
    }

    onCancel() {
        this.closDialog('cancel');
    }

    private busyForm() {
        this.busy = true;
        this.submitButton.disabled = true;
    }

    private unBusyForm() {
        this.busy = false;
        this.submitButton.disabled = false;
    }

    private createForm() {
        this.limitForm = this.fb.group({
            limit: [null, Validators.required],
            narrative: [null, Validators.required]
        });
    }

    private closDialog(status: any) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.dialogRef.close(status);
    }

    private handleError(err: { error: { message: string; }; }) {
        this.notificationService.error(err.error.message);
        console.log(err);
        this.closDialog('cancel');
        return throwError(err);
    }
}
