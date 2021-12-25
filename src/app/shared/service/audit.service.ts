import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Page} from './utility/page';
import {Audit} from '../model/audit.model';

const AUDIT_URL = environment.base_url + '/api/v1/audit';

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
}
