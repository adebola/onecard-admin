import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ProviderDatasource} from './provider.datasource';
import {Router} from '@angular/router';
import {ProviderService} from '../../shared/service/provider.service';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

@Component({
    selector: 'app-provider-list',
    templateUrl: './provider-list.component.html',
    styleUrls: ['./provider-list.component.css']
})
export class ProviderListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public datasource: ProviderDatasource;
    public displayedColumns = ['id', 'name', 'category', 'code', 'actions'];

    constructor( private router: Router,
                 private providerService: ProviderService) {}

    onNewProvider() {
        this.router.navigate(['/providers/providerform']);
    }

    onView(id) {
        this.router.navigate(['/providers/providerform/', id]);
    }

    logEvent($event: PageEvent) {
        this.datasource.loadProviders($event.pageIndex + 1, $event.pageSize);
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.datasource = new ProviderDatasource(this.providerService);
        this.datasource.loadProviders();
    }

    ngAfterViewInit(): void {
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.datasource.loadProviders(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }
}
