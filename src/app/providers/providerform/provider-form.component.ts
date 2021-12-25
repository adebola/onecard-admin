import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {ProviderService} from '../../shared/service/provider.service';
import {catchError, finalize} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {NotificationService} from '../../shared/service/notification.service';
import {DatePipe} from '@angular/common';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ServiceActionDatasource} from './service-action.datasource';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {Provider, ProviderCategory, ServiceAction} from '../../shared/model/provider.model';

@Component({
    selector: 'app-provider-form',
    templateUrl: './provider-form.component.html',
    styleUrls: ['./provider-form.component.css']
})
export class ProviderFormComponent implements OnInit, OnDestroy {
    private id: string = null;
    public busy = false;
    public editMode = false;
    public activated = false;
    public suspended = false;
    public providerForm: FormGroup;
    public actionForm: FormGroup;
    public datasource: ServiceActionDatasource;

    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public categories: ProviderCategory[];
    private subscription: Subscription;

    @ViewChild('button') button: HTMLButtonElement;

    public actionEditMode = true;
    public rechargeDisplay = false;
    public actionDisplay = false;
    public selectedRowIndex = -1;

    private tabSubscription: Subscription;
    private saveSubscription: Subscription;
    private provider: Provider;
    public action: ServiceAction;
    public displayedColumns = ['id', 'name', 'price', 'action'];

    constructor(private router: Router,
                private fb: FormBuilder,
                private datePipe: DatePipe,
                private route: ActivatedRoute,
                public providerService: ProviderService,
                private notificationService: NotificationService) {
    }

    // =========================== PROVIDER FORM SECTION ===================================

    ngOnInit(): void {
        this.providerService.loadCategories();
        this.id = this.route.snapshot.paramMap.get('id');
        this.editMode = !!this.id;
        this.createForm();

        if (this.id) {
            this.loadDataSource();
            this.providerService.loadActions();
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
        const category: string = providerForm.value.category;
        const code: string = providerForm.value.code;

        let obs$: Observable<any>;

        if (this.editMode) {
            const activated: boolean = providerForm.value.activated;

            obs$ = this.providerService.updateProvider(this.id, {
                name: name,
                category: category,
                code: code
            });
        } else {
            obs$ = this.providerService.saveProvider({
                name: name,
                category: category,
                code: code
            });
        }

        obs$.pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe((p) => this.handleSuccess(p));
    }

    private createForm() {
        if (this.id) {
            this.providerForm = this.fb.group({
                providerId: [null],
                name: [null, Validators.required],
                category: [null, Validators.required],
                code: [null, Validators.required],
                createdby: [null],
                createdon: [null],
                activateDate: [null],
                activatedBy: [null],
                activated: [null],
                activationDate: [null]
            });

            this.subscription = this.providerService.getProvider(this.id).pipe(
                catchError(err => {
                    return throwError(err);
                })
            ).subscribe(provider => {
                if (provider == null) {
                    this.notificationService.error('Error Loading Provider : ' + this.id + '. It might not exist, please contact Technical Support');
                    return this.router.navigate(['/providers/provider']);
                }

                console.log(provider);
                this.activated = provider.activated;
                this.suspended = provider.suspended;

                let activateDateString: String = null;

                if (provider.activationDate) {
                    activateDateString = this.datePipe.transform(provider.activationDate);
                }

                this.providerForm.patchValue({
                    providerId: provider.id,
                    name: provider.name,
                    category: provider.category,
                    code: provider.code,
                    createdby: provider.createdBy,
                    createdon: this.datePipe.transform(new Date(provider.createdDate), 'mediumDate'),
                    activationDate: activateDateString,
                    activated: provider.activated,
                    activatedBy: provider.activatedBy
                });
            });
        } else {
            this.providerForm = this.fb.group({
                name: [null, Validators.required],
                category: [null, Validators.required],
                code: [null, Validators.required],
            });
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if (this.tabSubscription) {
            this.tabSubscription.unsubscribe();
        }

        if (this.saveSubscription) {
            this.saveSubscription.unsubscribe();
        }
    }

    // =========================== ACTION FORM SECTION ===================================

    logEvent($event: PageEvent) {
        this.datasource.loadActionServices($event.pageIndex + 1, $event.pageSize, this.provider.code);
    }

    tabSelectedChange($event: MatTabChangeEvent) {
        if ($event.index === 0) {
            this.selectedRowIndex = -1;
            this.actionDisplay = false;
            this.rechargeDisplay = false;
        }
    }

    actionSubmit(actionForm: FormGroup) {
        if (!actionForm.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!actionForm.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const name: string = actionForm.value.name;
        const price: number = actionForm.value.cost;
        const code: string = actionForm.value.code;
        const action: string = actionForm.value.action;

        let ob$: Observable<any>;

        if (this.actionEditMode) {
            ob$ = this.providerService.updateServiceAction(this.action.id.toString(), {
                serviceName: name,
                serviceCost: price,
                serviceCode: code,
                actionName: action,
                providerCode: this.action.providerCode,
            }).pipe(
                catchError(err => {
                    return throwError(err);
                })
            );
        } else {
            ob$ = this.providerService.saveServiceAction( {
                serviceName: name,
                serviceCost: price,
                serviceCode: code,
                actionName: action,
                providerCode: this.provider.code,
            }).pipe(
                catchError(err => {
                    return throwError(err);
                })
            );
        }

        if (this.saveSubscription) {
            this.saveSubscription.unsubscribe();
        }

        this.saveSubscription = ob$.subscribe(o => {
            this.notificationService.info('Service has been saved / updated successfully');
            console.log(o);
            this.datasource.loadActionServices(1, 20, this.provider.code);
        });
    }

    private loadDataSource() {
        if (this.tabSubscription) {
            this.tabSubscription.unsubscribe();
        }

        this.tabSubscription = this.providerService.getProvider(this.id).subscribe(provider => {
            this.datasource = new ServiceActionDatasource(this.providerService);
            this.datasource.loadActionServices(1, 20, provider.code);
            this.provider = provider;
        });
    }

    private createEditActionForm() {
        this.actionEditMode = true;

        this.actionForm = this.fb.group({
            serviceId: [null],
            name: [null, Validators.required],
            cost: [null],
            action: [null, Validators.required],
            code: [null, Validators.required]
        });

        this.providerService.getServiceAction(this.selectedRowIndex).pipe(
            catchError(err => this.handleError(err))
        ).subscribe(a => {
            this.action = a;
            this.actionForm.patchValue({
                serviceId: a.id,
                name: a.serviceName,
                cost: a.serviceCost,
                action: a.actionName,
                code: a.serviceCode
            });
        });
    }

    private handleSuccess(provider: Provider) {
        this.router.navigate(['/providers/providerform/', (provider && provider.id) ? provider.id : this.id]);
        this.notificationService.success('The Provider has been successfully updated / created');
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        return throwError(err);
    }

    public createNewActionForm() {
        this.actionEditMode = false;
        this.actionDisplay = true;

        this.actionForm = this.fb.group({
            name: [null, Validators.required],
            cost: [null],
            action: [null, Validators.required],
            code: [null, Validators.required]
        });
    }

    onActivate() {
        this.providerService.activateProvider(this.id).subscribe(provider => {
            this.activated = provider.activated;

            if (this.activated) {
                this.providerForm.patchValue({
                    activationDate: this.datePipe.transform(provider.activationDate),
                    activatedBy: provider.activatedBy
                });
            }

            this.notificationService.success('The Provider has been activated successfully');
        });
    }

    onSuspend() {
        this.providerService.suspendProvider(this.id).subscribe(provider => {
            this.suspended = provider.suspended;
            this.notificationService.success('The Provider has been suspended successfully');
        });
    }

    onUnsuspend() {
        this.providerService.unsuspendProvider(this.id).subscribe(provider => {
            this.suspended = provider.suspended;
            this.notificationService.success('The Provider has been Un-suspended successfully');
        });
    }

    highlight(row) {
        console.log(row);
        this.selectedRowIndex = row.id;
        this.actionDisplay = true;
        this.rechargeDisplay = false;
        this.createEditActionForm();
    }

    onRechargeProviders() {
        this.rechargeDisplay = true;
    }
}
