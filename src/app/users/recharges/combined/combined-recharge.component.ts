import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from '../../../shared/service/notification.service';
import {AuthRechargeService} from '../../../shared/service/auth-recharge.service';
import {catchError, finalize} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-combined-recharge-component',
    templateUrl: './combined-recharge.component.html',
    styleUrls: ['./combined-recharge.component.css']
})
export class CombinedRechargeComponent implements OnInit, OnDestroy {
    @Input() userId: string;
    @Input() display: boolean;

    public busy = false;
    public startDate: Date = null;
    public endDate: Date = null;
    private subscription: Subscription;

    constructor(private notificationService: NotificationService,
                private authRechargeService: AuthRechargeService) {}

    ngOnDestroy(): void {if (this.subscription) { this.subscription.unsubscribe(); }}

    ngOnInit(): void {}

    onDownload() {
        if (this.startDate == null) {
            return this.notificationService.error('Please select a start date');
        }

        if (this.endDate != null && this.startDate >= this.endDate) {
            return this.notificationService.error('The End Date must be later than the start date');
        }

        if (this.subscription) { this.subscription.unsubscribe(); }

        this.busy = true;

        this.subscription = this.authRechargeService.downloadCombined(this.userId, this.startDate, this.endDate).pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe(data => {
            const blob = new Blob([data], {type: 'application/vnd.ms-excel'});
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, 'adebola.xls');
        });
    }

    private handleError(err) {
        console.error(err.error);
        this.notificationService.error('Error Downloading File: ' + err.error.message);
        return throwError(err);
    }
}
