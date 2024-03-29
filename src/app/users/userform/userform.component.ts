import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../shared/service/notification.service';
import {UserService} from '../../shared/service/user.service';
import {catchError} from 'rxjs/operators';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {DatePipe} from '@angular/common';
import {MatSelectionList} from '@angular/material/list';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {TransactionDatasource} from '../../shared/datasource/transactions.datasource';
import {AccountService} from '../../shared/service/account.service';
import {Voucher} from '../../shared/model/voucher.model';
import {User} from '../../shared/model/user.model';
import {Role} from '../../shared/model/role.model';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {BalanceModalComponent} from '../modals/balance/balance-modal.component';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {DailyLimitModalComponent} from '../modals/daily-limit/daily-limit-modal.component';

@Component({
    selector: 'app-user-form',
    templateUrl: './userform.component.html',
    styleUrls: ['./userform.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
    public busy = false;
    public id: string = null;
    public userForm: FormGroup;
    private subscription: Subscription;
    private activateSubscription: Subscription;
    public user: User;

    private allRolesSubject = new BehaviorSubject<Role[]>(null);
    private assignedRolesSubject = new BehaviorSubject<Role[]>(null);

    public allRoles$: Observable<Role[]> = this.allRolesSubject.asObservable();
    public assignedRoles$: Observable<Role[]> = this.assignedRolesSubject.asObservable();

    @ViewChild('availableroles') availableRoles: MatSelectionList;
    @ViewChild('assignedroles') assignedRoles: MatSelectionList;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('balance') balanceInput: ElementRef;

    public datasource: TransactionDatasource;
    public displayedColumns = ['id', 'date', 'service', 'amount'];
    public showTransactions = false;
    public showRecharges = false;
    public showFunding = false;

    constructor(private router: Router,
                private fb: FormBuilder,
                private datePipe: DatePipe,
                private matDialog: MatDialog,
                private route: ActivatedRoute,
                private userService: UserService,
                private accountService: AccountService,
                private notificationService: NotificationService) {
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.activateSubscription) {
            this.activateSubscription.unsubscribe();
        }

        this.allRolesSubject.complete();
        this.assignedRolesSubject.complete();
    }

    private initRoles() {
        this.userService.findAllRoles().subscribe(roles => {
            this.userService.findUserRoles(this.id).subscribe(u => {
                for (let i = roles.length - 1; i >= 0; --i) {
                    if (u.find(o => o.name === roles[i].name)) {
                        roles.splice(i, 1);
                    }
                }

                this.assignedRolesSubject.next(u);
                this.allRolesSubject.next(roles);
            });
        });
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.initRoles();
        this.createForm();
    }

    private createForm() {
        this.userForm = this.fb.group({
            userId: [null],
            createdOn: [null],
            enabled: [null],
            dailyLimit: [null],
            kycVerified: [null],
            emailVerified: [null],
            firstname: [null, Validators.required],
            lastname: [null, Validators.required],
            username: [null, Validators.required],
            email: [null, Validators.required],
            balance: [null]
        });

        this.subscription = this.userService.findUserById(this.id).pipe(
            catchError(err => {
                return throwError(err);
            })
        ).subscribe(user => {
            if (user == null) {
                this.notificationService.error('Error Loading User : ' + this.id + '. may not exist, please contact Technical Support');
                return this.router.navigate(['/users/user']);
            }

            this.user = user;

            const formatter = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
            });

            this.userForm.patchValue({
                userId: user.id,
                createdOn: this.datePipe.transform(new Date(user.createdDate), 'mediumDate'),
                enabled: user.enabled,
                emailVerified: user.emailVerified,
                kycVerified: user.account.kycVerified,
                firstname: user.firstName,
                lastname: user.lastName,
                username: user.username,
                email: user.email,
                balance: formatter.format(user.account?.balance)
            });

            if (!user.account.kycVerified) {
                this.userForm.patchValue({
                    dailyLimit: formatter.format(user.account?.dailyLimit),
                });
            }
        });
    }

    onSubmit(form: FormGroup) {
        if (!form.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!form.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const enabled = form.controls.enabled.touched ? form.value.enabled : null;
        const firstName = form.controls.firstname.touched ? form.value.firstname : null;
        const lastName = form.controls.lastname.touched ? form.value.lastname : null;

        this.subscription = this.userService.updateUser(this.id, {
            enabled: enabled,
            firstName: firstName,
            lastName: lastName
        }).pipe(
            catchError(err => this.handleError(err)),
        ).subscribe((b) => this.handleSuccess(b));
    }

    addRoles() {
        const roles: string[] = [];

        if (this.availableRoles.selectedOptions.selected.length > 0) {
            for (let i = 0; i < this.availableRoles.selectedOptions.selected.length; i++) {
                roles[i] = this.availableRoles.selectedOptions.selected[i].value;
            }

            this.userService.addRole(this.id, roles).pipe(
                catchError(err => this.handleError(err)),
            ).subscribe(r => {
                this.notificationService.success('The Role(s) has been added successfully');
                this.initRoles();
            });
        }
    }

    removeRoles() {
        const roles: string[] = [];

        if (this.assignedRoles.selectedOptions.selected.length > 0) {
            for (let i = 0; i < this.assignedRoles.selectedOptions.selected.length; i++) {
                roles[i] = this.assignedRoles.selectedOptions.selected[i].value;
            }

            this.userService.removeRole(this.id, roles).pipe(
                catchError(err => this.handleError(err)),
            ).subscribe(r => {
                this.notificationService.success('The Role(s) has been removed successfully');
                this.initRoles();
            });
        }
    }

    private handleSuccess(v: Voucher) {
        this.notificationService.success('The User has been updated successfully');
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log('SINGLE USER FORM ERROR');
        console.log(err);
        return throwError(err);
    }

    onShowTransaction() {
        if (this.showTransactions) {
            this.showTransactions = false;
        } else {
            this.datasource = new TransactionDatasource(this.accountService);
            this.datasource.loadTransactions(this.id);

            this.showTransactions = true;
        }
    }

    onShowRecharges() {
        this.showRecharges = !this.showRecharges;
    }

    onShowFunding() {
        this.showFunding = !this.showFunding;
    }

    logEvent($event: PageEvent) {
        this.datasource.loadTransactions(this.id, $event.pageIndex + 1, $event.pageSize);
    }

    private getBalanceModal(id: string): MatDialogRef<BalanceModalComponent> {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.id = 'modal-dialog';
        dialogConfig.height = '400px';
        dialogConfig.width = '550px';
        dialogConfig.data = {id: id};
        return this.matDialog.open(BalanceModalComponent, dialogConfig);
    }

    private getLimitModal(id: string): MatDialogRef<DailyLimitModalComponent> {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.id = 'modal-dialog';
        dialogConfig.height = '400px';
        dialogConfig.width = '550px';
        dialogConfig.data = {id: id};
        return this.matDialog.open(DailyLimitModalComponent, dialogConfig);
    }

    openBalanceModal() {
        this.getBalanceModal(this.user.account.id).afterClosed().subscribe((result) => {
            if (result !== 'cancel') {
                const formatter = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                });

                this.userForm.patchValue({
                    balance: formatter.format(result)
                });
            }
        });
    }

    openLimitModal() {
        this.getLimitModal(this.user.account.id).afterClosed().subscribe((result) => {
            if (result !== 'cancel') {
                const formatter = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                });

                this.userForm.patchValue({
                    dailyLimit: formatter.format(result)
                });
            }
        });

    }

    onEnabledChange($event: MatCheckboxChange) {
        if (this.activateSubscription) {
            this.activateSubscription.unsubscribe();
        }
        this.activateSubscription = this.userService.toggleUserActivation(this.id).subscribe();
    }
}
