import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {ReportService} from '../../../shared/service/report.service';
import {UtilityService} from '../../../shared/service/utility.service';

@Component({
    selector: 'app-provider-wallet',
    templateUrl: './provider-wallet.component.html'
})
export class ProviderWalletComponent implements OnInit, OnDestroy {
    public busy: boolean;
    public providerWalletForm: FormGroup;
    private subscription: Subscription = null;
    public reportType = ['short', 'long'];

    constructor(@Inject(FormBuilder) private fb: FormBuilder,
                private reportService: ReportService,
                private utilityService: UtilityService) {}

    ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
    }

    ngOnInit(): void {
        this.createForm();
    }

    onSubmit(providerWalletForm: FormGroup) {
        const type: string = providerWalletForm.value.type;
        const start: Date = providerWalletForm.value.start;
        const end: Date = providerWalletForm.value.end;

        this.busy = true;

        let startDate: string = null;
        let endDate: string = null;

        if (start) {
            startDate = this.utilityService.stringifyDateForJson(start);
        }

        if (end) {
            endDate = this.utilityService.stringifyDateForJson(end);
        }

        this.subscription = this.reportService.runWalletReport({
            type: type,
            startDate: startDate,
            endDate: endDate
        }).pipe(
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
        this.providerWalletForm = this.fb.group({
            type: ['short'],
            start: [null],
            end: [null]
        });
    }
}
