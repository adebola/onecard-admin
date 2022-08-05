import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Page} from './utility/page';
import {Action, Provider, ProviderCategory, ServiceAction} from '../model/provider.model';
import {RechargeProvider} from '../model/recharge-provider.model';

const PROVIDER_URL = environment.base_url + '/api/v1/provider';
const PROVIDER_SERVICE_URL = environment.base_url + '/api/v1/provider/service';
const PROVIDER_CATEGORY_URL = environment.base_url + '/api/v1/provider/category';
const PROVIDER_RECHARGE_URL = environment.base_url + '/api/v1/provider/recharge';

@Injectable({ providedIn: 'root' })
export class ProviderService {
    private subject = new BehaviorSubject<ProviderCategory[]>(null);
    public categories$: Observable<ProviderCategory[]> = this.subject.asObservable();
    private actionSubject = new BehaviorSubject<Action[]>(null);
    public actions$: Observable<Action[]> = this.actionSubject.asObservable();

    constructor(private http: HttpClient) {}

    public getProviders(pageNumber: number = 1, pageSize: number = 20): Observable<Page<Provider>> {

        return this.http.get<Page<Provider>>(PROVIDER_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public searchProviders(pageNumber: number = 1, pageSize: number = 20, searchString: string): Observable<Page<Provider>> {

        return this.http.get<Page<Provider>>(PROVIDER_URL + '/search', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchString: searchString
            }
        });
    }

    public getProvider(id: String): Observable<Provider> {
        return this.http.get<Provider>(PROVIDER_URL + '/' + id);
    }

    public saveProvider(provider: Partial<Provider>): Observable<any> {
        return this.http.post(PROVIDER_URL, provider);
    }

    public updateProvider(id: String, provider: Partial<Provider>): Observable<any> {
        return this.http.put(PROVIDER_URL + '/' + id, provider);
    }

    public getProviderCategories(pageNumber: number = 1, pageSize: number = 20): Observable<Page<ProviderCategory>> {

        return this.http.get<Page<ProviderCategory>>(PROVIDER_CATEGORY_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public searchProviderCategories(pageNumber: number = 1, pageSize: number = 20,
                                    searchString: string): Observable<Page<ProviderCategory>> {

        return this.http.get<Page<ProviderCategory>>(PROVIDER_CATEGORY_URL + '/search', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchString: searchString
            }
        });
    }

    public getProviderCategory(id: string): Observable<ProviderCategory> {
        return this.http.get<ProviderCategory>(PROVIDER_CATEGORY_URL + '/' + id);
    }

    public saveProviderCategory(provider: Partial<ProviderCategory>): Observable<any> {
        return this.http.post(PROVIDER_CATEGORY_URL, provider);
    }

    public updateProviderCategory(id: String, provider: Partial<ProviderCategory>): Observable<any> {
        return this.http.put(PROVIDER_CATEGORY_URL + '/' + id, provider);
    }

    public loadCategories() {
        this.getProviderCategories().subscribe(o => this.subject.next(o.list));
    }

    public loadActions() {
        this.getActions().subscribe(a => this.actionSubject.next(a));
    }

    public getServiceActions(pageNumber: number = 1, pageSize: number = 20, code: string): Observable<Page<ServiceAction>> {
        return this.http.get<Page<ServiceAction>>(PROVIDER_SERVICE_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                code: code
            }
        });
    }

    public getServiceAction(id): Observable<ServiceAction> {
        return this.http.get<ServiceAction>(PROVIDER_SERVICE_URL + '/' + id);
    }

    public saveServiceAction(action: Partial<ServiceAction>): Observable<any> {
        return this.http.post(PROVIDER_SERVICE_URL, action);
    }

    public updateServiceAction(id: string, action: Partial<ServiceAction>): Observable<any> {
        return this.http.put(PROVIDER_SERVICE_URL + '/' + id, action);
    }

    public activateProvider(id: string): Observable<any> {
        return this.http.get(PROVIDER_URL + '/activate/' + id, );
    }

    public suspendProvider(id: string): Observable<any> {
        return this.http.get(PROVIDER_URL + '/suspend/' + id, );
    }

    public unsuspendProvider(id: string): Observable<any> {
        return this.http.get(PROVIDER_URL + '/unsuspend/' + id, );
    }

    public getActions(): Observable<Action[]> {
        return this.http.get<Action[]>(PROVIDER_SERVICE_URL + '/actions');
    }

    public getRechargeProvider(id: string): Observable<RechargeProvider> {
        return this.http.get<RechargeProvider>(PROVIDER_RECHARGE_URL + '/' + id);
    }

    public getServiceRechargeProviders(id: string): Observable<RechargeProvider[]> {
        return this.http.get<RechargeProvider[]>(PROVIDER_RECHARGE_URL + '/service/' + id);
    }

    public getAllRechargeProviders(pageNumber: number = 1, pageSize: number = 20): Observable<Page<RechargeProvider>> {
        return this.http.get<Page<RechargeProvider>>(PROVIDER_RECHARGE_URL);
    }

    public saveRechargeProvider(provider: Partial<RechargeProvider>): Observable<RechargeProvider> {
        return this.http.post<RechargeProvider>(PROVIDER_RECHARGE_URL, provider);
    }

    public updateRechargeProvider(id: string, provider: Partial<RechargeProvider>): Observable<RechargeProvider> {
        return this.http.put<RechargeProvider>(PROVIDER_RECHARGE_URL + '/' + id, provider);
    }

    public removeRechargeProviderFromService(rechargeId: number, serviceId: number): Observable<any> {
        return this.http.get(PROVIDER_SERVICE_URL + '/remove', {
            params: {
                rechargeId: rechargeId,
                serviceId: serviceId,
            }
        });
    }

    public addRechargeProviderToService(rechargeId: string, serviceId: string): Observable<any> {
        return this.http.get(PROVIDER_SERVICE_URL + '/add', {
            params: {
                rechargeId: rechargeId,
                serviceId: serviceId,
            }
        });
    }
}
