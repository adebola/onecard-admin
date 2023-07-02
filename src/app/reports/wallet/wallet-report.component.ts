import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material/tabs';

@Component({
    selector: 'app-wallet-report',
    templateUrl: './wallet-report.component.html'
})
export class WalletReportComponent implements OnInit, OnDestroy, AfterViewInit {
    public busy = false;

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

    tabSelectedChange($event: MatTabChangeEvent) {
        console.log($event);
    }
}
