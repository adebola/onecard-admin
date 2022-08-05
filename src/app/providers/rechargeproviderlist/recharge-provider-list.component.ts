import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {RechargeProviderDatasource} from './recharge-provider.datasource';
import {Router} from '@angular/router';
import {ProviderService} from '../../shared/service/provider.service';

@Component({
    selector: 'app-recharge-provider-list',
    templateUrl: './recharge-provider-list.component.html'
})
export class RechargeProviderListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public datasource: RechargeProviderDatasource;
    public displayedColumns = ['id', 'name', 'code', 'actions'];

    constructor( private router: Router,
                 private providerService: ProviderService) {}

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.datasource = new RechargeProviderDatasource(this.providerService);
        this.datasource.loadAllRechargeProviders();
    }

    logEvent($event: PageEvent) {
        this.datasource.loadAllRechargeProviders($event.pageIndex + 1, $event.pageSize);
    }

    onNewProvider() {
        this.router.navigate(['/providers/rechargeproviderform']);
    }

    onView(id) {
        this.router.navigate(['/providers/rechargeproviderform', id]);
    }
}
