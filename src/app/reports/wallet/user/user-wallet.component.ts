import {AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserDatasource} from '../../../shared/datasource/user.datasource';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../../shared/service/user.service';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, finalize, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {UtilityService} from '../../../shared/service/utility.service';
import {ReportService} from '../../../shared/service/report.service';

@Component({
    selector: 'app-user-wallet',
    templateUrl: './user-wallet.component.html',
    styleUrls: ['./user-wallet.component.css']
})
export class UserWalletComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('input') input: ElementRef;
    @Input() mode: string;

    public busy: boolean;
    public walletForm: FormGroup;
    public selectedRowIndex: number;
    private selectedId: string = null;
    public datasource: UserDatasource;
    private subscription: Subscription = null;
    public displayedColumns = ['username'];
    private eventSubscription: Subscription = null;
    public displayDropDown = false;
    public transactionMode = false;

    constructor(@Inject(FormBuilder) private fb: FormBuilder,
                private userService: UserService,
                private reportService: ReportService,
                private utilityService: UtilityService) {}

    ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
    }

    ngOnInit(): void {
        if (this.mode === 'transaction') {
            this.transactionMode = true;
        }

        this.datasource = new UserDatasource(this.userService);
        this.createForm();
    }

    ngAfterViewInit(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }

        this.eventSubscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    if (this.input.nativeElement.value && this.input.nativeElement.value.length > 0) {
                        this.displayDropDown = true;
                        this.datasource.loadUsers(1, 20,
                            {
                                search: this.input.nativeElement.value,
                                admin:  null,
                                ordinary: null
                            });
                    } else {
                        this.selectedId = null;
                        this.displayDropDown = false;
                    }
                })
            ).subscribe();
    }

    onRowClicked(row) {
        this.input.nativeElement.value = row.username;
        this.selectedId = row.id;
    }

    onSubmit(walletForm: FormGroup) {
        const user: string = (this.input.nativeElement.value === null || this.input.nativeElement.value === '') ? null : this.selectedId;
        const end: Date = walletForm.value.endDate;
        const start: Date = walletForm.value.startDate;

        let startDate: string;
        let endDate: string;

        if (start) {
            startDate = this.utilityService.stringifyDateForJson(start);
        }

        if (end) {
            endDate = this.utilityService.stringifyDateForJson(end);
        }

        this.busy = true;

        let ob$: Observable<any>;

        if (this.mode === 'wallet') {
            ob$ = this.reportService.runWalletReport({
                id: user,
                type: 'user',
                startDate: startDate ? startDate : null,
                endDate: endDate ? endDate : null
            });
        } else {
            console.log('USER', user);
            ob$ = this.reportService.runTransactionReport({
                userId: user,
                startDate: startDate ? startDate : null,
                endDate: endDate ? endDate : null
            });
        }

        this.subscription = ob$.pipe(
            finalize(() => this.busy = false)
        ).subscribe(data => {
            const blob =
                new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const fileURL = URL.createObjectURL(blob);
            this.busy = false;
            window.open(fileURL);
        });
    }

    private createForm() {
        this.walletForm = this.fb.group({
            user: [null],
            startDate: [null],
            endDate: [null],
        });
    }
}
