import {Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Page} from '../../shared/service/utility/page';
import {NotificationService} from '../../shared/service/notification.service';

// Account Number: 0244140270-01
// Meter Number:   45700863561
// Order ID:       8370
interface Transaction {
    id: number;
    accountId: string;
    serviceId: number;
    serviceName: string;
    requestId: string;
    txDate: string;
    txAmount: number;
}

interface Beneficiary {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
}


@Component({
    selector: 'app-test-form',
    templateUrl: './testform.component.html'
})
export class TestFormComponent {
    public selectedFile: File;
    busy = false;

    @ViewChild('uuid') inputElement: ElementRef;
    constructor(private http: HttpClient, private notificationService: NotificationService) {}

    recharge() {
        // this.http.post(environment.base_url + '/api/v1/auth-recharge', {
        //     'recipient': '45700863561',
        //     'serviceCost': 100,
        //     'serviceCode': 'EKEDP'
        // }).subscribe(response => console.log('RESPONSE', response));

        // this.http.get(environment.base_url + '/api/v1/account/balance').subscribe(response => console.log('RESPONSE', response));

        // this.http.post(environment.base_url + '/api/v1/auth-recharge/newbulk', {
        //     paymentMode: 'wallet',
        //     recipients: [
        //         {
        //             serviceCode: 'GLO-AIRTIME',
        //             serviceCost: 100,
        //             recipient: '08055572307'
        //         },
        //         {
        //             serviceCode: '9-AIRTIME',
        //             serviceCost: 120,
        //             recipient: '08188111333'
        //         }
        //     ]
        //
        // }).subscribe(response => console.log('RESPONSE', response));

        // this.http.post(environment.base_url + '/api/v1/auth-recharge', {
        //     recipient: '13036747',
        //     serviceCode: 'SPECTRANET-DATA',
        //     productId: 'SP1',
        //     paymentMode: 'wallet',
        // }).subscribe(response => console.log('RESPONSE', response));

        // this.http.post(environment.base_url + '/api/v1/auth-recharge', {
        //     recipient: '1911001220',
        //     serviceCode: 'SMILE-DATA',
        //     productId: '508',
        //     paymentMode: 'wallet',
        // }).subscribe(response => console.log('RESPONSE', response));

        this.http.post(environment.base_url + '/api/v1/auth-recharge', {
            recipient: '08055572307',
            serviceCode: 'GLO-DATA',
            productId: '18',
            paymentMode: 'wallet',
        }).subscribe(response => console.log('RESPONSE', response));

        // this.http.post(environment.base_url + '/api/v1/auth-recharge', {
        //     recipient: '44000316354',
        //     serviceCode: 'JED',
        //     serviceCost: 500,
        //     telephone: '08055572307'
        // }).subscribe(response => console.log('RESPONSE', response));
    }

    finalRecharge() {
        console.log('VALUE', this.inputElement.nativeElement.value);
        this.http.get(environment.base_url + '/api/v1/auth-recharge/bulk/' + this.inputElement.nativeElement.value)
            .subscribe(response => console.log('RESPONSE', response));
    }

    getTransactions() {
        // this.http.get<Page<Transaction>>(environment.base_url + '/api/v1/transaction')
        //     .subscribe(tran => console.log(tran));

        this.http.get<Beneficiary[]>(environment.base_url + '/api/v1/beneficiary').subscribe(x => console.log(x));
    }

    saveBeneficiary() {
        this.http.post(environment.base_url + '/api/v1/beneficiary', {
            firstName: 'first6',
            lastName: 'last6',
            email: 'email6@email.com',
            telephone: '08055572306'
        }).subscribe(() => console.log('Created Beneficiary'));
    }

    bulkRecharge() {
        console.log('BULK RECHARGE..............');
        this.http.post(environment.base_url + '/api/v1/auth-recharge/newbulk', {
            recipients: [
                {
                    serviceCode: 'GLO-AIRTIME',
                    serviceCost: 50,
                    recipient: '08055572307'
                },
                {
                    serviceCode: 'GLO-AIRTIME',
                    serviceCost: 50,
                    recipient: '09055572307'
                }
            ],
            paymentMode: 'wallet'
        }).subscribe(x => console.log('Return Value', x));
    }

    scheduledRecharge() {
        this.http.post(environment.base_url + '/api/v1/auth-recharge/newscheduled', {
            rechargeType: 'bulk',
            scheduledDate: '2022-03-08 13:30:00',
            paymentMode: 'wallet',
            recipients: [
                {
                    serviceCode : 'GLO-AIRTIME',
                    recipient: '08055572307',
                    serviceCost: 200
                },
                {
                    serviceCode : 'GLO-DATA',
                    recipient: '08055572307',
                    productId: '18',
                },
                {
                    serviceCode : 'MTN-AIRTIME',
                    recipient: '08033356709',
                    serviceCost: 250
                }]
        }).subscribe(x => console.log('RESULT', x));
    }

    initializeFundWallet() {
        this.http.post(environment.base_url + '/api/v1/account/fund', {
            amount: 1000,
            redirectUrl: 'http://localhost:8081/api/v1/pay'
        }).subscribe(result => console.log(result));
    }

    getAutoSchedule() {
        this.http.get(environment.base_url + '/api/v1/auth-recharge/auto/06898df5-f319-47cb-adb2-2d04844c1d2e')
            .subscribe(result => console.log('RESULT', result));
    }

    getAutoRecharges() {
        this.http.get(environment.base_url + '/api/v1/auth-recharge/getauto').subscribe(result => console.log(result));
    }

    autoSchedule() {
        this.http.post(environment.base_url + '/api/v1/auth-recharge/auto', {
            daysOfWeek: [1, 3, 5],
            title: 'test',
            startDate: '2022-27-08 13:30:00',
            recipients: [
                {
                    recipient: '08055572307',
                    serviceCode: 'GLO-AIRTIME',
                    serviceCost: 100
                },
                {
                    recipient: '08055572307',
                    serviceCode: 'GLO-DATA',
                    productId: '18'
                }
            ]
        }).subscribe(result => console.log(result));
    }

    fundWallet() {
        this.http.get(environment.base_url + '/api/v1/account/fund/' +  this.inputElement.nativeElement.value)
            .subscribe(message => console.log(message));
    }

    balance() {
        this.http.get(environment.base_url + '/api/v1/account/balance').subscribe(res => console.log(res));
    }

    downloadFile() {
        this.http.get(environment.base_url + '/api/v1/auth-recharge/templatefile').subscribe(a => console.log(a));
    }

    changeListener(event) {
        this.selectedFile = event.target.files[0];
        console.log(this.selectedFile.name);
    }

    private pushFile(file: File, url: string): Observable<HttpEvent<{}>> {
        const data: FormData = new FormData();
        const dateData = new Blob([JSON.stringify({scheduledDate: '2022-03-09 20:51:00'})], {type: 'application/json'});

        data.append('date', dateData);
        data.append('file', file);

        const newRequest = new HttpRequest('POST', url, data, {
            reportProgress: true,
            responseType: 'text'
        });

        return this.http.request(newRequest);
    }

    onSubmit() {
        if (!this.selectedFile) {
            return this.notificationService.error('Please select a CSV file to upload');
        }

        this.busy = true;
        this.pushFile(this.selectedFile, environment.base_url + '/api/v1/auth-recharge/bulk/file')
            .subscribe(x => console.log('X', x));
    }

    sendSms() {
        this.http.post(environment.base_url + '/api/v1/sms', {
            message: 'Madam u are not answering, I am a secret admirer',
            to: '08030921710'
        }).subscribe(a => console.log(a));
    }

    sendBulkSms() {
        this.http.post(environment.base_url + '/api/v1/sms/bulk', {
            messages: [
                {
                    message: 'Jesus Is Lord',
                    to: '08055572307'
                },
                {
                    message: 'Madam I Love U sooooo much please ma I cant come out, but please just once',
                    to: '08188111333'
                }
            ]
        }).subscribe(x => console.log(x));
    }
}
