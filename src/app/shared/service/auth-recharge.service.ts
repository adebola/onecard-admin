import {Observable} from 'rxjs';
import {Page} from './utility/page';
import {SingleRecharge} from '../model/single-recharge.model';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BulkRecharge, IndividualRequests} from '../model/bulk-recharge.model';
import {SearchSingleFailedRecharge, SearchSingleRecharge} from '../model/search-single-recharge.model';
import {SearchBulkFailedRecharge, SearchBulkRecharge} from '../model/search-bulk-recharge.model';
import {SearchIndividualBulk} from '../model/search-individual-bulk.model';
import {ResolveRechargeModel} from '../model/resolve-recharge.model';
import {RetryStatusModel} from '../model/retry-status.model';
import {MessageModel} from '../model/message.model';

const SINGLE_AUTH_RECHARGE_URL = environment.base_url + '/api/v1/auth-recharge';
const BULK_AUTH_RECHARGE_URL = environment.base_url + '/api/v1/auth-recharge/bulk';

@Injectable({providedIn: 'root'})
export class AuthRechargeService {

    constructor(private http: HttpClient) {
    }

    public getUserSingleRecharges(userId: string, pageNumber: number = 1, pageSize: number = 20): Observable<Page<SingleRecharge>> {
        return this.http.get<Page<SingleRecharge>>(SINGLE_AUTH_RECHARGE_URL + '/singlelist/' + userId, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public resolveSingleRecharge(id: string, model: Partial<ResolveRechargeModel>): Observable<ResolveRechargeModel> {
        return this.http.put<ResolveRechargeModel>(SINGLE_AUTH_RECHARGE_URL + '/resolve/' + id, model);
    }

    public resolveIndividualBulk(id: string, model: Partial<ResolveRechargeModel>): Observable<any> {
        return this.http.put<ResolveRechargeModel>(BULK_AUTH_RECHARGE_URL + '/individualresolve/' + id, model);
    }

    public resolveBulk(id: string, model: Partial<ResolveRechargeModel>): Observable<any> {
        return this.http.put<ResolveRechargeModel>(BULK_AUTH_RECHARGE_URL + '/bulkresolve/' + id, model);

    }

    public retrySingleRecharge(id: string, recipient: string): Observable<RetryStatusModel> {
        return this.http.get<RetryStatusModel>(SINGLE_AUTH_RECHARGE_URL + '/retry/' + id, {
            params: {
                recipient: recipient
            }
        });
    }

    public retryIndividualBulk(id: string, recipient: string): Observable<RetryStatusModel> {
        return this.http.get<RetryStatusModel>(BULK_AUTH_RECHARGE_URL + '/individualretry/' + id, {
            params: {
                recipient: recipient
            }
        });
    }

    public retryBulk(id: string): Observable<RetryStatusModel> {
        return this.http.get<RetryStatusModel>(BULK_AUTH_RECHARGE_URL + '/bulkretry/' + id);
    }

    public refundSingleRecharge(id: string): Observable<MessageModel> {
        return this.http.get<MessageModel>(SINGLE_AUTH_RECHARGE_URL + '/refund/' + id);
    }

    public refundIndividualBulk(id: string, bulkId: string): Observable<any> {
        return this.http.get(BULK_AUTH_RECHARGE_URL + '/individualrefund/' + id, {
            params: {
                bulkId: bulkId
            }
        });
    }

    public refundBulk(id: string): Observable<any> {
        return this.http.get(BULK_AUTH_RECHARGE_URL + '/bulkrefund/' + id);
    }

    public getSingleRecharge(id: string): Observable<SingleRecharge> {
        return this.http.get<SingleRecharge>(SINGLE_AUTH_RECHARGE_URL + '/single/' + id);
    }

    public getUserBulkRecharges(userId: string, pageNumber: number = 1, pageSize: number = 20): Observable<Page<BulkRecharge>> {
        return this.http.get<Page<BulkRecharge>>(BULK_AUTH_RECHARGE_URL + '/list/' + userId, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public getBulkIndividualRequests(bulkId: string, pageNumber: number = 1, pageSize: number = 20): Observable<Page<IndividualRequests>> {
        return this.http.get<Page<IndividualRequests>>(BULK_AUTH_RECHARGE_URL + '/individual/' + bulkId, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public getBulkIndividualFailedRequests(id: string,
                                           pageNumber: number = 1, pageSize: number = 20): Observable<Page<IndividualRequests>> {
        return this.http.get<Page<IndividualRequests>>(BULK_AUTH_RECHARGE_URL + '/failed/' + id, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public getBulkIndividualFailedUnresolvedRequests(id: string,
                                                     pageNumber: number = 1,
                                                     pageSize: number = 20): Observable<Page<IndividualRequests>> {
        return this.http.get<Page<IndividualRequests>>(BULK_AUTH_RECHARGE_URL + '/failedunresolved/' + id, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public searchSingleRecharge(single: Partial<SearchSingleRecharge>,
                                pageNumber: number,
                                pageSize: number): Observable<Page<SingleRecharge>> {

        return this.http.post<Page<SingleRecharge>>(SINGLE_AUTH_RECHARGE_URL + '/single/adminsearch', single, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public searchSingleFailedRecharge(single: Partial<SearchSingleFailedRecharge>,
                                      pageNumber: number,
                                      pageSize: number): Observable<Page<SingleRecharge>> {
        return this.http.post<Page<SingleRecharge>>(SINGLE_AUTH_RECHARGE_URL + '/single/adminfailedsearch', single, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public searchBulkFailedRecharge(bulk: Partial<SearchBulkFailedRecharge>,
                                    pageNumber: number, pageSize: number): Observable<Page<BulkRecharge>> {
        return this.http.post<Page<BulkRecharge>>(BULK_AUTH_RECHARGE_URL + '/adminfailedsearch', bulk, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public searchBulkRecharge(bulk: Partial<SearchBulkRecharge>): Observable<Page<BulkRecharge>> {
        return this.http.post<Page<BulkRecharge>>(BULK_AUTH_RECHARGE_URL + '/adminsearch', bulk);
    }

    public searchBulkIndividualRecharge(individual: Partial<SearchIndividualBulk>,
                                        pageNumber: number = 1, pageSize: number = 20): Observable<Page<IndividualRequests>> {
        return this.http.post<Page<IndividualRequests>>(BULK_AUTH_RECHARGE_URL + '/individual/search', individual, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public searchFailedBulkIndividualRecharge(individual: Partial<SearchIndividualBulk>,
                                              pageNumber: number = 1, pageSize: number = 20): Observable<Page<IndividualRequests>> {

        return this.http.post<Page<IndividualRequests>>(BULK_AUTH_RECHARGE_URL + '/individual/failed-search', individual, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public getSingleFailedRecharges(pageNumber: number, pageSize: number): Observable<Page<SingleRecharge>> {
        return this.http.get<Page<SingleRecharge>>(SINGLE_AUTH_RECHARGE_URL + '/single/failed', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public getSingleFailedUnresolvedRecharges(pageNumber: number, pageSize: number): Observable<Page<SingleRecharge>> {
        return this.http.get<Page<SingleRecharge>>(SINGLE_AUTH_RECHARGE_URL + '/single/failedunresolved', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public getBulkFailedRecharges(pageNumber: number, pageSize: number): Observable<Page<BulkRecharge>> {
        return this.http.get<Page<BulkRecharge>>(BULK_AUTH_RECHARGE_URL + '/failed', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public getBulkFailedUnresolvedRecharges(pageNumber: number, pageSize: number): Observable<Page<BulkRecharge>> {
        return this.http.get<Page<BulkRecharge>>(BULK_AUTH_RECHARGE_URL + '/failedunresolved', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public downloadSingleFailed(type: string): Observable<any> {
        return this.http.get(SINGLE_AUTH_RECHARGE_URL + '/single/downloadfailed', {
            params: {
                type: type
            },
            responseType: 'blob' as 'json'
        });
    }

    public downloadSingleFailedByUserId(id: string): Observable<any> {
        return this.http.get(SINGLE_AUTH_RECHARGE_URL + '/single/download/' + id, {
            responseType: 'blob' as 'json'
        });
    }

    public downloadBulkFailed(type: string): Observable<any> {
        return this.http.get(BULK_AUTH_RECHARGE_URL + '/download-failed', {
            params: {
                type: type
            },
            responseType: 'blob' as 'json'
        });
    }

    public downloadBulkIndividualFailed(id: string, type: string): Observable<any> {
        return this.http.get(BULK_AUTH_RECHARGE_URL + '/download-failed-individual', {
            params: {
                id: id,
                type: type
            },
            responseType: 'blob' as 'json'
        });
    }

    public downloadBulkByUserId(id: string): Observable<any> {
        return this.http.get(BULK_AUTH_RECHARGE_URL + '/download-user-bulk/' + id, {
            responseType: 'blob' as 'json'
        });
    }

    public downloadIndividualByBulkId(id: string): Observable<any> {
        return this.http.get(BULK_AUTH_RECHARGE_URL + '/download-user-individual/' + id, {
            responseType: 'blob' as 'json'
        });
    }

    public downloadCombined(id: string, startDate: Date, endDate: Date): Observable<any> {
        let month = startDate.getMonth()  + 1;
        let startMonth: string = String(month);
        let endMonth: string = null;

        if (month < 10) { startMonth = '0' + startMonth; }

        if (endDate != null) {
            month = endDate.getMonth() + 1;
            endMonth = String(month);

            if (month < 10) { endMonth = '0' + endMonth; }
        }

        const body = {
            id: id,
            startDate: startDate.getFullYear() + '-' + startMonth + '-' + startDate.getDate() + ' 00:00:00',
            endDate: endDate ? endDate.getFullYear() + '-' + endMonth + '-' + endDate.getDate() + ' 00:00:00' : null
        };

        return this.http.post(SINGLE_AUTH_RECHARGE_URL + '/combined/download', body, {
            responseType: 'blob' as 'json'
        });
    }
}
