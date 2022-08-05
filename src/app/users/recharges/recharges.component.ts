import {Component, Input} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material/tabs';

@Component({
    selector: 'app-recharges-component',
    templateUrl: './recharges.component.html',
    styleUrls: ['./recharges.component.css']
})
export class RechargesComponent {
    @Input() userId: string;
    @Input() display: boolean;

    tabSelectedChange($event: MatTabChangeEvent) {
        console.log($event);
    }
}
