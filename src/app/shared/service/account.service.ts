import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Page} from './utility/page';
import {Account, Transaction} from '../model/account.model';
import {WalletFund} from '../model/wallet-fund.model';
import {NewBalanceModel} from '../model/new-balance.model';
import {AdjustResponse} from '../model/adjust.model';
import {exhaustMap} from 'rxjs/operators';

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

    public updateBalance(id: string, balance: number, narrative: string): Observable<NewBalanceModel> {
        return this.http.put<NewBalanceModel>(ACCOUNT_URL + '/balance/' + id, {
            balance: balance,
            narrative: narrative
        });
    }

    public adjustBalance(id: string, amount: number, narrative: string): Observable<AdjustResponse> {
        return this.http.post<AdjustResponse>(ACCOUNT_URL + '/adjust', {accountId: id, amount, narrative});
    }

    findWalletFundings(userId: string, pageNumber: number, pageSize: number): Observable<Page<WalletFund>> {
        return this.http.get<Page<WalletFund>>(ACCOUNT_URL + '/wallet/' + userId, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }
}
