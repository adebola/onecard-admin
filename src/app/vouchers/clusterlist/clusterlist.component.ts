import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {fromEvent} from 'rxjs';
import {VoucherService} from '../../shared/service/voucher.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ClusterDatasource} from './cluster.datasource';

@Component({
    selector: 'app-cluster-list',
    templateUrl: './clusterlist.component.html',
    styleUrls: ['./clusterlist.component.css']
})
export class ClusterListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('input') input: ElementRef;
    public datasource: ClusterDatasource;
    public displayedColumns = ['id', 'name', 'amount', 'balance', 'actions'];
    private id: string = null;

    private eventSubscription: Subscription = null;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private voucherService: VoucherService) {}

    ngAfterViewInit(): void {

        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }

        this.id = null;

        this.eventSubscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.datasource.loadClusters(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.datasource = new ClusterDatasource(this.voucherService);
        this.datasource.loadClusters();
    }

    onView(id) {
        this.router.navigate(['/vouchers/clusterform/' + id]);
    }

    logEvent($event: PageEvent) {
        this.datasource.loadClusters($event.pageIndex + 1, $event.pageSize);
    }

    onGenerate() {
        this.router.navigate(['/vouchers/clusterform']);
    }

    onViewChild(id) {
        this.router.navigate(['/vouchers/batch/' + id]);
    }
}
