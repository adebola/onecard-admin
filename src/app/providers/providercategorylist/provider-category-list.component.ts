import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProviderCategoryDatasource} from './provider-category.datasource';
import {Router} from '@angular/router';
import {ProviderService} from '../../shared/service/provider.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

@Component({
    selector: 'app-provider-category-list',
    templateUrl: './provider-category-list.component.html',
})
export class ProviderCategoryListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public datasource: ProviderCategoryDatasource;
    public displayedColumns = ['id', 'name', 'actions'];

    constructor( private router: Router,
                 private providerService: ProviderService) {}

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.datasource = new ProviderCategoryDatasource(this.providerService);
        this.datasource.loadProviderCategories();
    }

    ngAfterViewInit(): void {
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.datasource.loadProviderCategories(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    onNewCategory() {
        this.router.navigate(['/providers/categoryform']);
    }

    onView(id) {
        this.router.navigate(['/providers/categoryform', id]);
    }

    logEvent($event: PageEvent) {
        this.datasource.loadProviderCategories($event.pageIndex + 1, $event.pageSize);
    }
}
