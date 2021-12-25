import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {VoucherService} from '../../shared/service/voucher.service';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {VoucherDatasource} from './voucher.datasource';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-voucher-list',
    templateUrl: './voucher-list.component.html',
    styleUrls: ['./voucher-list.component.css']
})
export class VoucherListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('input') input: ElementRef;
    public datasource: VoucherDatasource;
    public displayedColumns = ['id', 'serialNumber', 'denomination', 'expiryDate', 'actions'];
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
                    this.datasource.loadVouchers(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.datasource = new VoucherDatasource(this.voucherService);

        if (this.id) {
            this.datasource.loadBatchVouchers(this.id);
        } else {
            this.datasource.loadVouchers();
        }
    }

    onView(id) {
        this.router.navigate(['/vouchers/singlevoucherform/' + id]);
    }

    logEvent($event: PageEvent) {
        if (this.id) {
            this.datasource.loadBatchVouchers(this.id, $event.pageIndex + 1, $event.pageSize);
        } else {
            this.datasource.loadVouchers($event.pageIndex + 1, $event.pageSize);
        }
    }
}
