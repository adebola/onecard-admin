import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';


const UPLOAD_URL = environment.base_url + '/api/v1/user/image';
@Injectable({
    providedIn: 'root'
})
export class UploadService {
    constructor(private https: HttpClient) {}

    pushFileToAWSStorage(file: File): Observable<HttpEvent<{}>> {
        return this.pushFile(file, UPLOAD_URL);
    }

    private pushFile(file: File, url: string): Observable<HttpEvent<{}>> {
        const data: FormData = new FormData();
        data.append('file', file);

        const newRequest = new HttpRequest('POST', url, data, {
            reportProgress: true,
            responseType: 'text'
        });

        return this.https.request(newRequest);
    }
}
