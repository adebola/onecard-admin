import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {BatchDatasource} from './batch.datasource';
import {VoucherService} from '../../shared/service/voucher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

@Component({
    selector: 'app-voucher-batchlist',
    templateUrl: './voucher-batchlist.component.html',
    styleUrls: ['./voucher-batchlist.component.css']
})
export class VoucherBatchlistComponent implements OnInit, OnDestroy, AfterViewInit {
    private id: string = null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('input') input: ElementRef;
    public datasource: BatchDatasource;
    public displayedColumns = ['id', 'createdAt', 'createdBy', 'denomination', 'count', 'actions'];

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private voucherService: VoucherService) {}

    onGenerate() {
        this.router.navigate(['/vouchers/voucherform']);
    }

    ngAfterViewInit(): void {
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.datasource.loadVoucherBatches(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.datasource = new BatchDatasource(this.voucherService);

        if (this.id) {
            this.datasource.loadClusterBatches(this.id);
        } else {
            this.datasource.loadVoucherBatches();
        }
    }

    onView(id: string) {
        this.router.navigate(['/vouchers/voucherform/' + id]);
    }

    logEvent($event: PageEvent) {
        this.datasource.loadVoucherBatches($event.pageIndex + 1, $event.pageSize);
    }

    onViewTable(id) {
        // LoadVouchers in VoucherBatch
        this.router.navigate(['/vouchers/voucher/', id]);
    }
}
