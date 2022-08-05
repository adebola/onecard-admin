import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from './utility/page';
import {Audit} from '../model/audit.model';
import {Contact} from '../model/contact.model';
import {assertArrayOfStrings} from '@angular/compiler/src/assertions';


const CONTACT_URL = environment.base_url + '/api/v1/contact';

@Injectable({ providedIn: 'root' })
export class ContactService {
    constructor(private http: HttpClient) {}

    public findAll(pageNumber: number, pageSize: number): Observable<Page<Contact>> {
        return this.http.get<Page<Contact>>(CONTACT_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public findById(id: string): Observable<Contact> {
        return this.http.get<Contact>(CONTACT_URL + '/' + id);
    }

    public search(pageNumber: number, pageSize: number, search: string): Observable<Page<Contact>> {
        return this.http.get<Page<Contact>>(CONTACT_URL + '/search', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchString: search
            }
        });
    }
}
