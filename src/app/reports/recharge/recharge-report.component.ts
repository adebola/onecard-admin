import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/service/user.service';
import {Observable} from 'rxjs';
import {SimpleUser} from '../../shared/model/simple-user.model';
import {ProviderService} from '../../shared/service/provider.service';
import {finalize, map} from 'rxjs/operators';
import {ProviderServiceModel} from '../../shared/model/provider-services.model';
import {ReportService} from '../../shared/service/report.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-recharge-report',
    templateUrl: './recharge-report.component.html',
})
export class RechargeReportComponent implements OnInit, OnDestroy {
    busy = false;
    private build: FormBuilder;
    public rechargeForm: FormGroup;
    public users$: Observable<SimpleUser[]>;
    public services$: Observable<ProviderServiceModel[]>;
    public types  = ['single', 'bulk'];
    public statuses = ['failed', 'success'];
    private subscription: Subscription = null;

    constructor(@Inject(FormBuilder) private fb: FormBuilder,
                private userService: UserService,
                private reportService: ReportService,
                private providerService: ProviderService) {}

    ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe();}
    }

    ngOnInit(): void {
        this.users$ = this.userService.findUsersNonPaged();
        this.services$ = this.providerService.getAllServices(1, 100)
            .pipe(map(m => m.list));
        this.createForm();
    }

    onSubmit(rechargeForm: FormGroup) {
        const user: string = rechargeForm.value.user;
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
            userId: user,
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
}
