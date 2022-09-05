import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProviderService} from '../../shared/service/provider.service';
import {RechargeProviderDatasource} from '../rechargeproviderlist/recharge-provider.datasource';
import {NotificationService} from '../../shared/service/notification.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {RechargeProviderModalComponent} from '../modals/rechargeprovider/recharge-provider-modal.component';

@Component({
    selector: 'app-provider-details',
    templateUrl: './provider-details.component.html',
    styleUrls: ['./provider-details.component.css']
})
export class ProviderDetailsComponent implements OnInit, OnDestroy {
    @Input()
    serviceId: number;

    constructor(private matDialog: MatDialog,
                private providerService: ProviderService,
                private notificationService: NotificationService) {}

    public priority: number = null;
    public selectedRowIndex = -1;
    public datasource: RechargeProviderDatasource;
    public displayedColumns = ['name', 'code', 'priority'];

    ngOnDestroy(): void {}

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
        this.priority = row.weight;
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

   addProvider() {
       this.getRechargeProviderModal('add').afterClosed().subscribe(result => {
           if (result === 'submit') {
               this.refresh();
           }
       });
   }

   editProvider() {
       if (this.selectedRowIndex <= 0) {
           return this.notificationService.error('Please select a Recharge Provider to edit');
       }

       this.getRechargeProviderModal('edit').afterClosed().subscribe(result => {
           if (result === 'submit') {
               this.refresh();
           }
       });
   }

    private getRechargeProviderModal(mode: string): MatDialogRef<RechargeProviderModalComponent> {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.id = 'modal-dialog';
        dialogConfig.height = '385px';
        dialogConfig.width = '420px';
        dialogConfig.data = {
            serviceId: this.serviceId,
            providerId: this.selectedRowIndex > 0 ?  this.selectedRowIndex : null,
            priority: this.priority,
            mode: mode
        };
        return this.matDialog.open(RechargeProviderModalComponent, dialogConfig);
    }

    private refresh() {
        this.loadDataSource(this.serviceId.toString());
    }
}
