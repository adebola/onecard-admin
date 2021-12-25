import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Page} from './utility/page';
import {Batch, Cluster, Voucher} from '../model/voucher.model';

const BATCH_URL = environment.base_url + '/api/v1/batch';
const VOUCHER_URL = environment.base_url + '/api/v1/voucher';
const CLUSTER_URL = environment.base_url + '/api/v1/cluster';

@Injectable({ providedIn: 'root' })
export class VoucherService {

    constructor(private http: HttpClient) {}

    public getVoucherBatches(pageNumber: number = 1, pageSize: number = 20): Observable<Page<Batch>> {
        return this.http.get<Page<Batch>>(BATCH_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public searchVoucherBatch(pageNumber: number = 1, pageSize: number = 20, searchString: string): Observable<Page<Batch>> {
        return this.http.get<Page<Batch>>(BATCH_URL + '/search', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchString: searchString
            }
        });
    }

    public getVoucherBatch(id: String): Observable<Batch> {
        return this.http.get<Batch>(BATCH_URL + '/' + id);
    }

    public saveVoucherBatch(batch: Partial<Batch>): Observable<any> {
        return this.http.post(BATCH_URL, batch);
    }

    public updateVoucherBatch(id: String, batch: Partial<Batch>): Observable<any> {
        return this.http.put(BATCH_URL + '/' + id, batch);
    }

    public getVouchers (pageNumber: number = 1, pageSize: number = 20): Observable<Page<Voucher>> {
        return this.http.get<Page<Voucher>>(VOUCHER_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public getVouchersByBatchId(pageNumber: number = 1, pageSize: number = 20, id: string ): Observable<Page<Voucher>> {
        return this.http.get<Page<Voucher>>(VOUCHER_URL + '/' + id + '/batch', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public searchVoucher(pageNumber: number = 1, pageSize: number = 20, searchString: string): Observable<Page<Voucher>> {
        return this.http.get<Page<Voucher>>(VOUCHER_URL + '/search', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchString: searchString
            }
        });
    }

    public getVoucherById(id: string): Observable<Voucher> {
        return this.http.get<Voucher>(VOUCHER_URL + '/' + id);
    }

    public getCodeFile(id: string): Observable<any> {
        return this.http.get(BATCH_URL + '/' + id + '/download', {
            responseType: 'blob',
        });
    }

    public getClusters(pageNumber: number = 1, pageSize: number = 20): Observable<Page<Cluster>> {
        return this.http.get<Page<Cluster>>(CLUSTER_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public getValidClusters(): Observable<Cluster[]> {
        return this.http.get<Cluster[]>(CLUSTER_URL + '/valid');
    }

    public searchClusters(pageNumber: number = 1, pageSize: number = 20, searchString: string): Observable<Page<Cluster>> {
        return this.http.get<Page<Cluster>>(CLUSTER_URL + '/search', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchString: searchString
            }
        });
    }

    public getClusterById(id: string): Observable<Cluster> {
        return this.http.get<Cluster>(CLUSTER_URL + '/' + id);
    }

    public getBatchByClusterId(id: string, pageNumber: number = 1, pageSize: number = 20): Observable<Page<Batch>> {
        return this.http.get<Page<Batch>>(BATCH_URL + '/' + id + '/cluster', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public saveCluster(cluster: Partial<Cluster>): Observable<any> {
        return this.http.post(CLUSTER_URL, cluster);
    }

    public updateCluster(id: string, cluster: Partial<Cluster>): Observable<any> {
        return this.http.put(CLUSTER_URL + '/' + id, cluster);
    }

    public activateCluster(id: string): Observable<any> {
        return this.http.get(CLUSTER_URL + '/activate/' + id, );
    }

    public suspendCluster(id: string): Observable<any> {
        return this.http.get(CLUSTER_URL + '/suspend/' + id, );
    }

    public unsuspendCluster(id: string): Observable<any> {
        return this.http.get(CLUSTER_URL + '/unsuspend/' + id, );
    }

    public activateBatch(id: string): Observable<Batch> {
        return this.http.get<Batch>(BATCH_URL + '/' + id + '/activate/');
    }

    public suspendBatch(id: string): Observable<Batch> {
        return this.http.get<Batch>(BATCH_URL + '/' + id + '/suspend/');
    }

    public unsuspendBatch(id: string): Observable<Batch> {
        return this.http.get<Batch>(BATCH_URL + '/' + id + '/unsuspend/');
    }

    public suspendVoucher(id: string): Observable<Voucher> {
        return this.http.get<Voucher>(VOUCHER_URL + '/' + id + '/suspend');
    }

    public unsuspendVoucher(id: string): Observable<Voucher> {
        return this.http.get<Voucher>(VOUCHER_URL + '/' + id + '/unsuspend');
    }
}
