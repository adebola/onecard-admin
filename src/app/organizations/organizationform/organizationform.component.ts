import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Organization} from '../../shared/model/organization.model';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {TransactionDatasource} from '../../shared/datasource/transactions.datasource';
import {PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {UserService} from '../../shared/service/user.service';
import {AccountService} from '../../shared/service/account.service';
import {NotificationService} from '../../shared/service/notification.service';
import {catchError, finalize} from 'rxjs/operators';
import {UserDatasource} from '../../shared/datasource/user.datasource';
import {User} from '../../shared/model/user.model';
import {MatSelectionList} from '@angular/material/list';

@Component({
    selector: 'app-organization-form',
    templateUrl: './organizationform.component.html',
    styleUrls: ['./organizationform.component.css']
})
export class OrganizationFormComponent implements OnInit, OnDestroy {
    public busy = false;
    public editMode = false;
    public id: string = null;
    public organizationForm: FormGroup;
    private subscription: Subscription;
    public organization: Organization;
    public showTransactions = false;
    public showUsers = false;

    private availableUsersSubject = new BehaviorSubject<User[]>(null);
    private assignedUsersSubject = new BehaviorSubject<User[]>(null);

    public availableUsers$: Observable<User[]> = this.availableUsersSubject.asObservable();
    public assignedUsers$: Observable<User[]> = this.assignedUsersSubject.asObservable();

    public txDatasource: TransactionDatasource;
    public transactionColumns = ['id', 'date', 'service', 'amount'];

    public userDatasource: UserDatasource;
    public userColumns = ['username', 'email', 'firstname', 'lastname', 'actions'];

    @ViewChild('balance') balanceInput: ElementRef;
    @ViewChild('availableusers') availableUsers: MatSelectionList;
    @ViewChild('assignedusers') assignedUsers: MatSelectionList;

    constructor(private router: Router,
                private datePipe: DatePipe,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private userService: UserService,
                private accountService: AccountService,
                private notificationService: NotificationService) {}


    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.availableUsersSubject.complete();
        this.assignedUsersSubject.complete();
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.editMode = !!this.id;
        this.createForm();
    }

    onSubmit(form: FormGroup) {
        if (!form.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!form.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const organizationName = form.value.organizationName;

        let obs$: Observable<Organization>;

        if (this.editMode) {
            obs$ = this.userService.updateOrganization(this.id, {
                organizationName: organizationName
            });
        } else {
            obs$ = this.userService.saveOrganization( {
                organizationName: organizationName
            });
        }

        obs$.pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe(organization => this.handleSuccess(organization));
    }

    onShowTransaction() {
        if (this.showTransactions) {
            this.showTransactions = false;
        } else {
            this.txDatasource = new TransactionDatasource(this.accountService);
            this.txDatasource.loadTransactions(this.id);
            this.showTransactions = true;
        }
    }

    saveBalance() {
        const value = this.balanceInput.nativeElement.value;

        if (!value) {
            return this.notificationService.error('Please enter a valid number for the new Balance');
        }

        this.accountService.updateBalance(this.organization.account.id, value).pipe(
            catchError(err => this.handleError(err)),
        ).subscribe(() => {
            this.notificationService.success('The User Balance has been updated accordingly');

            this.subscription = this.userService.findOrganizationById(this.id).pipe(
                catchError(err => {
                    return throwError(err);
                })
            ).subscribe(org => {
                this.organization = org;

                const formatter = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                });

                this.organizationForm.patchValue({
                    balance: formatter.format(org.account?.balance)
                });
            });
        });
    }

    logEventTransactions($event: PageEvent) {
        this.txDatasource.loadTransactions(this.id, $event.pageIndex + 1, $event.pageSize);
    }

    logEventUsers($event: PageEvent) {
        this.userDatasource.loadOrganizationUsers(this.id, $event.pageIndex + 1, $event.pageSize);
    }

    private createForm() {
        this.organizationForm = this.fb.group({
            organizationId: [null],
            organizationName: [null],
            createdon: [null],
            createdby: [null],
            balance: [null]
        });

        if (this.editMode) {
            this.subscription = this.userService.findOrganizationById(this.id).pipe(
                catchError(err => {
                    console.log('EDIT ORGANIZATION ERROR', err);
                    return throwError(err);
                })
            ).subscribe(organization => {
                if (organization == null) {
                    // tslint:disable-next-line:max-line-length
                    this.notificationService.error('Error Loading Organization : ' + this.id + '. It might not exist, please contact Technical Support');
                    return this.router.navigate(['/organizations/organization']);
                }

                this.organization = organization;

                const formatter = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                });

                console.log('ORGANIZATION', organization);

                this.organizationForm.patchValue({
                    organizationId: organization.id,
                    organizationName: organization.organizationName,
                    createdon: this.datePipe.transform(new Date(organization.createdDate), 'mediumDate'),
                    createdby: organization.createdBy,
                    balance: formatter.format(organization.account?.balance)
                });
            });
        }
    }

    private handleSuccess(o: Organization) {
        this.notificationService.success('Organization saved / updated successfully');
        this.router.navigate(['/organizations/organizationform', o.id]);
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        return throwError(err);
    }

    private initUsers() {
        this.userService.findUserByOrganizationId(this.id, 1, 50).subscribe(u => {
            this.assignedUsersSubject.next(u.list);
        });

        this.userService.findUserForOrganization(1, 50).subscribe(s => {
            this.availableUsersSubject.next(s.list);
        });
    }

    onShowUser() {
        if (this.showUsers) {
            this.showUsers = false;
        } else {
            this.userDatasource = new UserDatasource(this.userService);
            this.userDatasource.loadOrganizationUsers(this.id);
            this.showUsers = true;
        }
    }

    onAddUser() {
        const users: string[] = [];

        if (this.availableUsers.selectedOptions.selected.length > 0) {
            for (let i = 0; i < this.availableUsers.selectedOptions.selected.length; i++) {
                users[i] = this.availableUsers.selectedOptions.selected[i].value;
            }

            this.userService.addUserToOrganization(this.id, users).pipe(
                catchError(err => this.handleError(err)),
            ).subscribe(r => {
                this.notificationService.success('The User(s) has been successfully added to ' + this.organization.organizationName);
                this.initUsers();
            });
        }
    }

    onRemoveUser() {
        const users: string[] = [];

        if (this.assignedUsers.selectedOptions.selected.length > 0) {
            for (let i = 0; i < this.assignedUsers.selectedOptions.selected.length; i++) {
                users[i] = this.assignedUsers.selectedOptions.selected[i].value;
            }

            this.userService.removeUserFromOrganization(this.id, users).pipe(
                catchError(err => this.handleError(err)),
            ).subscribe(r => {
                this.notificationService.success('The User(s) has been successfully removed from ' + this.organization.organizationName);
                this.initUsers();
            });
        }
    }

    onRemoveSingleUser(id: string) {
        const users: string[] = [];
        users[0] = id;

        this.userService.removeUserFromOrganization(this.id, users).pipe(
            catchError(err => this.handleError(err)),
        ).subscribe(r => {
            this.userDatasource.loadOrganizationUsers(this.id);
            this.notificationService.success('The User has been successfully removed from ' + this.organization.organizationName);
        });
    }

    test() {
        console.log('TEST');
    }
}
