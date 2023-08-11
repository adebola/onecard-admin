import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {KycSettings} from '../model/kyc.model';
import {environment} from '../../../environments/environment';

const KYC_URL = environment.base_url + '/api/v1/kyc';


@Injectable({ providedIn: 'root' })
export class KycService {
    constructor(private http: HttpClient) {}

    public getKycSettings(): Observable<KycSettings> {
       return this.http.get<KycSettings>(KYC_URL + '/settings');
    }

    public updateKycSettings(settings: Partial<KycSettings>): Observable<any> {
        return this.http.put(KYC_URL + '/change', settings);
    }
}
