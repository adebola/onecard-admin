import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Page} from './utility/page';
import {Audit} from '../model/audit.model';

const AUDIT_URL = environment.base_url + '/api/v1/audit';
const REPORT_URL = environment.base_url + '/api/v1/reports';

@Injectable({ providedIn: 'root' })
export class AuditService {
    constructor(private http: HttpClient) {}

    public findAll(pageNumber: number, pageSize: number): Observable<Page<Audit>> {
        return this.http.get<Page<Audit>>(AUDIT_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public findById(id: string): Observable<Audit> {
        return this.http.get<Audit>(AUDIT_URL + '/' + id);
    }

    public runAuditReport(startDate: Date, endDate: Date): Observable<any> {
        const body = {
            start: startDate ? startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1 )).slice(-2) + '-' +
                ('0' + startDate.getDate()).slice(-2) + ' ' + ('0' + startDate.getHours()).slice(-2) + ':' +
                ('0' + startDate.getMinutes()).slice(-2) + ':' + ('0' + startDate.getSeconds()).slice(-2) : null,

            end: endDate ? endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1 )).slice(-2) + '-' +
                ('0' + endDate.getDate()).slice(-2) + ' ' + ('0' + endDate.getHours()).slice(-2) + ':' +
                ('0' + endDate.getMinutes()).slice(-2) + ':' + ('0' + endDate.getSeconds()).slice(-2) : null
        };

        return this.http.post(REPORT_URL + '/audit', body, {
            responseType: 'blob' as 'json'
        });
    }
}
