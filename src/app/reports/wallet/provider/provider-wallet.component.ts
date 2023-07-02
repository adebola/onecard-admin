import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserDatasource} from '../../../shared/datasource/user.datasource';
import {Observable} from 'rxjs';
import {RechargeProvider} from '../../../shared/model/recharge-provider.model';
import {ProviderService} from '../../../shared/service/provider.service';
import {Page} from '../../../shared/service/utility/page';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-provider-wallet',
    templateUrl: './provider-wallet.component.html'
})
export class ProviderWalletComponent implements OnInit, OnDestroy {

    @ViewChild('input') input: ElementRef;

    public busy: boolean;
    public providerForm: FormGroup;
    public selectedRowIndex: number;
    public datasource: UserDatasource;
    public services$: Observable<RechargeProvider[]>;

    constructor(@Inject(FormBuilder) private fb: FormBuilder,
                private providerService: ProviderService) {}

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.services$ = this.providerService.getAllRechargeProviders(1, 50)
            .pipe(map(r => r.list));
    }

    onSubmit(providerForm: FormGroup) {
    }
}
