import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Page} from './utility/page';
import {Account, Transaction} from '../model/account.model';

const ACCOUNT_URL = environment.base_url + '/api/v1/account';
const TRANSACTION_URL = environment.base_url + '/api/v1/transaction';

@Injectable({ providedIn: 'root' })
export class AccountService {

    constructor(private http: HttpClient) {}

    public findUserAccount(id: string): Observable<Account> {
        return this.http.get<Account>(ACCOUNT_URL + '/user/' + id);
    }

    public findUserTransactions(pageNumber: number = 1, pageSize: number = 20, id: string): Observable<Page<Transaction>> {
        return this.http.get<Page<Transaction>>(TRANSACTION_URL + '/user/' + id, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public findTransaction(id: string): Observable<Transaction> {
        return this.http.get<Transaction>(TRANSACTION_URL + '/id');
    }
}
