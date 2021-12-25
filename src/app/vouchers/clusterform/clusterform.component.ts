import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe, formatCurrency} from '@angular/common';
import {VoucherService} from '../../shared/service/voucher.service';
import {NotificationService} from '../../shared/service/notification.service';
import {catchError, finalize} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Cluster} from '../../shared/model/voucher.model';

@Component({
    selector: 'app-cluster-form',
    templateUrl: './clusterform.component.html'
})
export class ClusterFormComponent implements OnInit, OnDestroy {
    public busy = false;
    public editMode = false;
    public activated = false;
    public suspended = false;
    private id: string = null;
    public clusterForm: FormGroup;
    private subscription: Subscription;
    private cluster: Cluster;

    constructor(private router: Router,
                private fb: FormBuilder,
                private datePipe: DatePipe,
                private route: ActivatedRoute,
                private voucherService: VoucherService,
                private  notificationService: NotificationService) {}

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');

        this.editMode = !!this.id;
        this.createForm();
    }

    private createForm() {
        if (this.id) {
            this.clusterForm = this.fb.group({
                id: [null],
                name: [null, Validators.required],
                amount: [null, Validators.required],
                balance: [null],
                activationDate: [null],
                activatedBy: [null],
                description: [null, Validators.required],
                createdBy: [null],
                createdDate: [null],
            });

            this.subscription = this.voucherService.getClusterById(this.id).pipe(
                catchError(err => {
                    return throwError(err);
                })
            ).subscribe(cluster => {
                if (cluster == null) {
                    this.notificationService.error('Error Loading Cluster : ' + this.id + '. It might not exist, please contact Technical Support');
                    return this.router.navigate(['/vouchers/cluster']);
                }

                this.cluster = cluster;

                this.activated = cluster.activated;
                this.suspended = cluster.suspended;

                const activateDateString = cluster.activationDate ? this.datePipe.transform(cluster.activationDate) : null;
                const createDateString = cluster.createdDate ? this.datePipe.transform(cluster.createdDate) : null;

                this.clusterForm.patchValue({
                    id: cluster.id,
                    name: cluster.name,
                    amount: cluster.amount,
                    balance: formatCurrency(cluster.balance, 'en-US', '₦'),
                    activationDate: activateDateString,
                    activatedBy: cluster.activatedBy,
                    description: cluster.description,
                    createdBy: cluster.createdBy,
                    createdDate: createDateString
                });
            });
        } else {
            this.clusterForm = this.fb.group({
                name: [null, Validators.required],
                amount: [null, Validators.required],
                description: [null, Validators.required]
            });
        }
    }

    onSubmit(clusterForm: FormGroup) {

        if (!clusterForm.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!clusterForm.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const name: string = clusterForm.value.name;
        const amount: number = clusterForm.value.amount;
        const description: string = clusterForm.value.description;

        let obs$: Observable<any>;
        this.busy = true;

        if (this.editMode) {
            if (this.cluster.balance > amount) {
                this.busy = false;
                return this.notificationService.error('The Adjusted Amount is less than the balance');
            }

            obs$ = this.voucherService.updateCluster(this.id, {
                name: name,
                amount: amount,
                description: description
            });
        } else {
            obs$ = this.voucherService.saveCluster({
                name: name,
                amount: amount,
                description: description
            });
        }

        obs$.pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe(a => this.handleSuccess(a));
    }

    onActivate() {
        this.voucherService.activateCluster(this.id).subscribe(cluster => {
            this.activated = cluster.activated;
            this.notificationService
                .success('The Cluster has been activated, please note it cannot be de-activated but it can be suspended');
        });
    }

    onSuspend() {
        this.voucherService.suspendCluster(this.id).subscribe(cluster => {
            this.suspended = cluster.suspended;
            this.notificationService
                .success('The Cluster and associated Batches and Vouchers have been suspended');
        });
    }

    onUnsuspend() {
        this.voucherService.unsuspendCluster(this.id).subscribe(cluster => {
            this.suspended = cluster.suspended;
            this.notificationService.success('The Cluster and associated Batches and Vouchers have been Un-suspended');
        });
    }

    private handleSuccess(x: any) {
        this.notificationService.success('Save / Update Successful');
        this.router.navigate(['/vouchers/cluster']);
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        return throwError(err);
    }
}
