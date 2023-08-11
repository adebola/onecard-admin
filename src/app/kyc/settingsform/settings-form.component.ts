import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {KycService} from '../../shared/service/kyc.service';
import {catchError, finalize} from 'rxjs/operators';
import {KycSettings} from '../../shared/model/kyc.model';
import {Observable, throwError} from 'rxjs';
import {NotificationService} from '../../shared/service/notification.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-settings-form',
    templateUrl: './settings-form.component.html',
})
export class SettingsFormComponent implements OnInit, OnDestroy {
    busy = false;
    public settings$: Observable<KycSettings>;
    private subscription: Subscription = null;

    private kycService: KycService;
    private notificationService: NotificationService;

    @ViewChild('user') userEdit: ElementRef<HTMLInputElement>;
    @ViewChild('corporate') corporateEdit: ElementRef<HTMLInputElement>;

    constructor(kycService: KycService, notificationService: NotificationService) {
        this.kycService = kycService;
        this.notificationService = notificationService;
    }

    ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
    }

    ngOnInit(): void {
        this.settings$ = this.kycService.getKycSettings()
            .pipe(
                catchError(err => this.handleError(err)),
            );
    }

    private handleError(err: { error: { message: string; }; }) {
        this.notificationService.error(err.error.message);
        console.log(err);
        return throwError(err);
    }

    setLimit($event: MatSlideToggleChange) {
        this.busy = true;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.kycService.updateKycSettings({
            enabled: $event.checked ? '1' : '0'
        }).pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe();
    }

    setFirstName($event: MatSlideToggleChange) {
        this.busy = true;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.kycService.updateKycSettings({
            firstName: $event.checked ? '1' : '0'
        }).pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe();
    }

    setLastName($event: MatSlideToggleChange) {
        this.busy = true;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.kycService.updateKycSettings({
            lastName: $event.checked ? '1' : '0'
        }).pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe();
    }

    setTelephone($event: MatSlideToggleChange) {
        this.busy = true;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.kycService.updateKycSettings({
            telephone: $event.checked ? '1' : '0'
        }).pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe();
    }

    saveLimits() {
        this.busy = true;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.kycService.updateKycSettings({
            userLimit: Number(this.userEdit.nativeElement.value),
            corporateLimit: Number(this.corporateEdit.nativeElement.value)
        }).pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe();
    }
}
