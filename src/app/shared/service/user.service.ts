import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Page} from './utility/page';
import {User} from '../model/user.model';

const USER_URL = environment.base_url + '/api/v1/user';
const ROLE_URL = environment.base_url + '/api/v1/role';



export interface Role {
    id: string;
    name: string;
    description: string;
}


export interface RoleList {
    rolelist: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) {}

    public findUsers(): Observable<Page<User>> {
        return this.http.get<Page<User>>(USER_URL);
    }

    public findUserById(id: string): Observable<User> {
        return this.http.get<User>(USER_URL + '/' + id);
    }

    public searchUsers(searchString: string): Observable<Page<User>> {
        return this.http.get<Page<User>>(USER_URL + '/search', {
            params: {
                searchString: searchString
            }
        });
    }

    public updateUser(id: string, user: Partial<User>): Observable<any> {
        return this.http.put(USER_URL + '/' + id, user);
    }

    public findUserRoles(id: string): Observable<Role[]> {
        return this.http.get<Role[]>(ROLE_URL + '/user/' + id);
    }

    public findAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(ROLE_URL);
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

    public findRoleById(id: string): Observable<Role> {
        return this.http.get<Role>(ROLE_URL + '/' + id);
    }

    public findRoleByName(name: string): Observable<Role> {
        return this.http.get<Role>(ROLE_URL + '/name/' + name);
    }
}
