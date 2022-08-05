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

@Injectable({ providedIn: 'root' })
export class AuthRechargeService {

    constructor(private http: HttpClient) {}

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

    public getBulkIndividualFailedRequests(id: string, pageNumber: number = 1, pageSize: number = 20): Observable<Page<IndividualRequests>> {
        return this.http.get<Page<IndividualRequests>>(BULK_AUTH_RECHARGE_URL + '/failed/' + id, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public getBulkIndividualFailedUnresolvedRequests(id: string, pageNumber: number = 1, pageSize: number = 20): Observable<Page<IndividualRequests>> {
        return this.http.get<Page<IndividualRequests>>(BULK_AUTH_RECHARGE_URL + '/failedunresolved/' + id, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public searchSingleRecharge(single: Partial<SearchSingleRecharge>): Observable<Page<SingleRecharge>> {
        return this.http.post<Page<SingleRecharge>>(SINGLE_AUTH_RECHARGE_URL + '/single/adminsearch', single);
    }

    public searchSingleFailedRecharge(single: Partial<SearchSingleFailedRecharge>,
                                      pageNumber: number, pageSize: number): Observable<Page<SingleRecharge>> {
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
}
