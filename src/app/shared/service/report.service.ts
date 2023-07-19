import {Page} from './utility/page';
import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RechargeReportRequest, Report, TransactionReportRequest, WalletRechargeReport} from '../model/report.model';

const REPORT_URL = environment.base_url + '/api/v1/reports';

@Injectable({ providedIn: 'root' })
export class ReportService {
    constructor(private http: HttpClient) {}

    public findAll(pageNumber: number, pageSize: number): Observable<Page<Report>> {
        return this.http.get<Page<Report>>(REPORT_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public search(pageNumber: number, pageSize: number, searchString: string): Observable<Page<Report>> {
        return this.http.get<Page<Report>>(REPORT_URL + '/search', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchString: searchString
            }
        });
    }

    public runReport(id: number): Observable<any> {
        return this.http.get(REPORT_URL + '/run/' + id, {
            responseType: 'blob' as 'json'
        });
    }

    public findById(id: string): Observable<Report> {
        return this.http.get<Report>(REPORT_URL + '/' + id);
    }

    public runRechargeReport(request: Partial<RechargeReportRequest>): Observable<any> {
        return this.http.post(REPORT_URL + '/recharge', request, {
            responseType: 'blob' as 'json'
        });
    }

    public runWalletReport(request: Partial<WalletRechargeReport>): Observable<any> {
        return this.http.post(REPORT_URL + '/wallet', request, {
            responseType: 'blob' as 'json'
        });
    }

    public runProviderBalanceReport(): Observable<any> {
        return this.http.get(REPORT_URL + '/provider-balances', {
            responseType: 'blob' as 'json'
        });
    }

    public runTransactionReport(request: TransactionReportRequest): Observable<any> {
        return this.http.post(REPORT_URL + '/transaction', request, {
            responseType: 'blob' as 'json'
        });
    }
}
