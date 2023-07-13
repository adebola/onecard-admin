import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../shared/service/user.service';
import {fromEvent, Observable} from 'rxjs';
import {ProviderService} from '../../shared/service/provider.service';
import {debounceTime, distinctUntilChanged, finalize, map, tap} from 'rxjs/operators';
import {ProviderServiceModel} from '../../shared/model/provider-services.model';
import {ReportService} from '../../shared/service/report.service';
import {Subscription} from 'rxjs/Subscription';
import {UserDatasource} from '../../shared/datasource/user.datasource';
import {PageEvent} from '@angular/material/paginator';

@Component({
    selector: 'app-recharge-report',
    templateUrl: './recharge-report.component.html'
})
export class RechargeReportComponent implements OnInit, OnDestroy, AfterViewInit {
    busy = false;
    public rechargeForm: FormGroup;
    public services$: Observable<ProviderServiceModel[]>;
    public types  = ['single', 'bulk'];
    public statuses = ['failed', 'success'];
    private subscription: Subscription = null;
    private selectedId: string = null;
    public displayDropdown = false;

    displayedColumns = ['username'];
    public datasource: UserDatasource;
    private eventSubscription: Subscription = null;

    @ViewChild('input') input: ElementRef;
    selectedRowIndex: number;

    constructor(@Inject(FormBuilder) private fb: FormBuilder,
                private userService: UserService,
                private reportService: ReportService,
                private providerService: ProviderService) {}

    ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
    }

    ngOnInit(): void {
        this.datasource = new UserDatasource(this.userService);
        this.services$ = this.providerService.getAllServices(1, 100)
            .pipe(map(m => m.list));
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
                        this.displayDropdown = true;
                        this.datasource.loadUsers(1, 20,
                            {
                                search: this.input.nativeElement.value,
                                admin:  null,
                                ordinary: null
                            });
                    } else {
                        this.selectedId = null;
                        this.displayDropdown = false;
                    }
                })
            ).subscribe();
    }


    onSubmit(rechargeForm: FormGroup) {
        const user: string = this.selectedId;
        const service: string = rechargeForm.value.service;
        const type: string = rechargeForm.value.type;
        const status: string = rechargeForm.value.status;
        const end: Date = rechargeForm.value.end;
        const start: Date = rechargeForm.value.start;

       let startDate = null;
       let endDate = null;

        if (start != null) {
            let startMonth: string;

            const m = start.getMonth() + 1;
            startMonth = String(m);
            if (m < 10) { startMonth = '0' + startMonth; }

            startDate = start.getFullYear() + '-' + startMonth + '-' + start.getDate() + ' 00:00:00';
        }

        if (end != null) {
            let endMonth: string;

            const l = end.getMonth() + 1;
            endMonth = String(l);
            if (l < 10) { endMonth = '0' + endMonth; }

            endDate = end.getFullYear() + '-' + endMonth + '-' + end.getDate() + ' 00:00:00';
        }

        this.busy = true;

        this.subscription = this.reportService.runRechargeReport({
            userId: (this.input.nativeElement.value === null || this.input.nativeElement.value === '') ? null : user,
            serviceCode: service,
            type: type,
            status: status,
            startDate: startDate ? startDate : null,
            endDate: endDate ? endDate : null
        }).pipe(
            finalize(() => this.busy = false)
        ).subscribe(data => {
            const blob = new Blob([data], {type: 'application/vnd.ms-excel'});
            const fileURL = URL.createObjectURL(blob);
            this.busy = false;
            window.open(fileURL);
        });
    }

    private createForm() {
        this.rechargeForm = this.fb.group({
            user: [null],
            service: [null],
            type: [null],
            status: [null],
            start: [null],
            end: [null]
        });
    }

    logEvent($event: PageEvent) {
        this.datasource.loadUsers($event.pageIndex + 1, $event.pageSize, {
            search: this.input.nativeElement.value,
            admin: null,
            ordinary: null
        });
    }

    onRowClicked(row) {
        this.input.nativeElement.value = row.username;
        this.selectedId = row.id;
    }
}
