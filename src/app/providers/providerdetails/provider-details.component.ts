import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProviderService} from '../../shared/service/provider.service';
import {RechargeProviderDatasource} from '../providerform/recharge-provider.datasource';
import {NotificationService} from '../../shared/service/notification.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
    selector: 'app-provider-details',
    templateUrl: './provider-details.component.html',
    styleUrls: ['./provider-details.component.css']
})
export class ProviderDetailsComponent implements OnInit, OnDestroy {

    @Input()
    serviceId: number;

    constructor(private providerService: ProviderService,
                private notificationService: NotificationService) {}

    public selectedRowIndex = -1;
    public datasource: RechargeProviderDatasource;
    public dislayedColumns = ['id', 'name', 'code'];

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.loadDataSource(this.serviceId.toString());
    }

    private loadDataSource(id: string) {
        this.providerService.getServiceRechargeProviders(id).subscribe( recharge => {
            this.datasource = new RechargeProviderDatasource(this.providerService);
            this.datasource.loadServiceProviderRechargeProviders(id);
        });
    }

    highlight(row) {
        this.selectedRowIndex = row.id;
    }

    addProvider() {

    }

    removeProvider() {
        if (this.selectedRowIndex <= 0) {
            return this.notificationService.error('Please select a Recharge Provider to remove');
        }

        this.providerService.removeRechargeProviderFromService(this.selectedRowIndex, this.serviceId)
            .pipe(
                catchError(err => {
                    return throwError(err);
                })
            ).subscribe(o => {
                this.loadDataSource(this.serviceId.toString());
                this.notificationService.success('The Recharge Provider has been removed');
                this.selectedRowIndex = 0;
            });
    }
}
