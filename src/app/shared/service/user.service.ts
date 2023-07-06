import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Page} from './utility/page';
import {User} from '../model/user.model';
import {Role} from '../model/role.model';
import {Organization} from '../model/organization.model';
import {SearchUserModel} from '../model/search-user.model';
import {SimpleUser} from '../model/simple-user.model';

const USER_URL = environment.base_url + '/api/v1/user';
const ROLE_URL = environment.base_url + '/api/v1/role';
const ORGANIZATION_URL = environment.base_url + '/api/v1/organization';
const REPORT_URL = environment.base_url + '/api/v1/reports';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) {}

    // User Functions
    public findUsersNonPaged(): Observable<SimpleUser[]> {
        return this.http.get<SimpleUser[]>(USER_URL + '/nopage');
    }

    public findUsers(pageNumber: number = 1, pageSize: number = 20): Observable<Page<User>> {
        return this.http.get<Page<User>>(USER_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public findAdminUsers(pageNumber: number = 1, pageSize: number = 20): Observable<Page<User>> {
        return this.http.get<Page<User>>(USER_URL + '/admin', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public findOrdinaryUsers(pageNumber: number = 1, pageSize: number = 20): Observable<Page<User>> {
        return this.http.get<Page<User>>(USER_URL + '/ordinary', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public findUserById(id: string): Observable<User> {
        return this.http.get<User>(USER_URL + '/' + id);
    }

    public findSelf(): Observable<User> {
        return this.http.get<User>(USER_URL + '/self');
    }

    public searchUsers(pageNumber: number, pageSize: number, search: Partial<SearchUserModel>): Observable<Page<User>> {
        return this.http.post<Page<User>>(USER_URL + '/search', search, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    public updateUser(id: string, user: Partial<User>): Observable<any> {
        return this.http.put(USER_URL + '/' + id, user);
    }

    public updateSelf(user: Partial<User>): Observable<any> {
        return this.http.put(USER_URL + '/self', user);
    }

    public toggleUserActivation(id: string): Observable<any> {
        return this.http.put(USER_URL + '/activate/' + id, {});
    }

    // Role Functions

    public findUserRoles(id: string): Observable<Role[]> {
        return this.http.get<Role[]>(ROLE_URL + '/user/' + id);
    }

    public findAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(ROLE_URL);
    }

    public findCompanyRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(ROLE_URL + '/companyroles');
    }

    public addRole(id: string, roleList: string[]): Observable<any > {
        return this.http.put(ROLE_URL + '/add/' + id, {
            roleList: roleList
        });
    }

    public removeRole(id: string, roleList: string[]): Observable<any > {
        return this.http.put(ROLE_URL + '/remove/' + id, {
            roleList: roleList
        });
    }

    public findAllOrganizations(pageNumber: number, pageSize: number): Observable<Page<Organization>> {
        return this.http.get<Page<Organization>>(ORGANIZATION_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    findOrganizationById(id: string): Observable<Organization> {
        return this.http.get<Organization>(ORGANIZATION_URL + '/' + id);
    }

    saveOrganization(organization: Partial<Organization>): Observable<any> {
        return this.http.post(ORGANIZATION_URL, organization);
    }

    updateOrganization(id: string, organization: Partial<Organization>): Observable<any> {
        return this.http.put(ORGANIZATION_URL + '/' + id, organization);
    }

    searchOrganizations(searchString: string): Observable<Page<Organization>> {
        return this.http.get<Page<Organization>>(ORGANIZATION_URL + '/search', {
            params: {
                pageNumber: 1,
                pageSize: 20,
                searchString: searchString
            }
        });
    }

    removeOrganization(id: string): Observable<any> {
        return this.http.delete(ORGANIZATION_URL + '/' + id);
    }

    findUserByOrganizationId(id: string, pageNumber: number, pageSize: number): Observable<Page<User>> {
        return this.http.get<Page<User>>(ORGANIZATION_URL + '/users/' + id, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    findUserForOrganization(pageNumber: number, pageSize: number): Observable<Page<User>> {
        return this.http.get<Page<User>>(ORGANIZATION_URL + '/' + 'addable', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        });
    }

    public addUserToOrganization(userId: string, organizationIds: string[]): Observable<any> {
        return this.http.post(ORGANIZATION_URL + '/adduser/' + userId, {
            users: organizationIds
        });
    }

    public removeUserFromOrganization(userId: string, organizationIds: string[]): Observable<any> {
        return this.http.post(ORGANIZATION_URL + '/removeuser/' + userId, {
            users: organizationIds
        });
    }

    public runUserReport(): Observable<any> {
        return this.http.get(REPORT_URL + '/users', {
            responseType: 'blob' as 'json'
        });
    }
}
