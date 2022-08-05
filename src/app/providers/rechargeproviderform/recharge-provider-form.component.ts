import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../shared/service/notification.service';
import {catchError, finalize} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {ProviderService} from '../../shared/service/provider.service';
import {Subscription} from 'rxjs/Subscription';
import {formatCurrency} from '@angular/common';

@Component({
    selector: 'app-recharge-provider-form',
    templateUrl: './recharge-provider-form.component.html'
})
export class RechargeProviderFormComponent implements OnInit, OnDestroy {

    private id: string = null;
    public busy = false;
    public editMode = false;
    public suspended = false;
    public providerForm: FormGroup;
    private subscription: Subscription;

    constructor(private router: Router,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private providerService: ProviderService,
                private notificationService: NotificationService) {
    }


    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.editMode = !!this.id;
        this.createForm();
    }

    private createForm() {
        if (this.id) {
            this.providerForm = this.fb.group({
                id: [null],
                name: [null, Validators.required],
                code: [null, Validators.required],
                balance: [null],
            });

            this.subscription = this.providerService.getRechargeProvider(this.id).pipe(
                catchError(err => {
                    return throwError(err);
                })
            ).subscribe(provider => {
                if (provider == null) {
                    this.notificationService.error('Error Loading RechargeProvider : ' + this.id + '. It might not exist, please contact Technical Support');
                    return this.router.navigate(['/providers/category']);
                }

                this.providerForm.patchValue({
                    id: provider.id,
                    name: provider.name,
                    code: provider.code,
                    balance:  formatCurrency(provider.balance, 'en-US', '₦'),
                });
            });
        } else {
            this.providerForm = this.fb.group({
                name: [null, Validators.required],
                code: [null, Validators.required]
            });
        }
    }

    onSubmit(providerForm: FormGroup) {
        if (!providerForm.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!providerForm.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const name: string = providerForm.value.name;
        const code: string = providerForm.value.code;

        let obs$: Observable<any>;
        this.busy = true;

        if (this.editMode) {
            obs$ = this.providerService.updateRechargeProvider(this.id, {
                name: name,
                code: code,
            });
        } else {
            obs$ = this.providerService.saveRechargeProvider({
                name: name,
                code: code
            });
        }

        obs$.pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe(a => this.handleSuccess(a));

    }

    private handleSuccess(x: any) {
        this.notificationService.success('Save / Update Successful');
        this.router.navigate(['/providers/rechargelist']);
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        return throwError(err);
    }
}
