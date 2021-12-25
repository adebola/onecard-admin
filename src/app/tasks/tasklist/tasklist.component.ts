import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

class Beneficiary {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
}
@Component({
    selector: 'app-task-list',
    templateUrl: './tasklist.component.html',
})
export class TaskListComponent implements OnInit, OnDestroy {

    constructor(private http: HttpClient) {}

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

    addBeneficiaries() {
        const beneficiaries: Beneficiary[] = [];
        beneficiaries.push({id: null, firstName: 'Test6', lastName: 'test6', email: 'email6@email.com', telephone: '08055572344'});
        beneficiaries.push({id: null, firstName: 'Test7', lastName: 'test7', email: 'email7@email.com', telephone: '08055572355'});

        this.http.post(environment.base_url + '/api/v1/beneficiary/list', beneficiaries)
            .subscribe(() => console.log('BENEFICIARIES SAVED'));
    }




    addBeneficiary() {
        const b = new Beneficiary();
        b.firstName = 'TEST3';
        b.lastName = 'TEST3';
        b.email = 'newemail@email.com';
        b.telephone = '08055572311';

        this.http.post<Beneficiary>(environment.base_url + '/api/v1/beneficiary', b)
            .subscribe(x => console.log('NEW BENEFICIARY', x));
    }

    removeBeneficiary() {

    }

    updateBeneficiary() {
        const b = new Beneficiary();

        b.firstName = 'TEST2';
        b.lastName = 'TEST2';
        b.email = 'email@email.com';
        b.telephone = '08055572307';

        this.http.put(environment.base_url + '/api/v1/beneficiary/2', b)
            .subscribe(() => console.log('Update Complete'));
    }

    getBeneficiary() {
        this.http.get<Beneficiary>(environment.base_url + '/api/v1/beneficiary/2')
            .subscribe(b => console.log('BENEFICIARY', b));
    }

    getBeneficiaries() {
        this.http.get<Beneficiary[]>(environment.base_url + '/api/v1/beneficiary')
            .subscribe(b => console.log('BENEFICIARIES', b));
    }
}

