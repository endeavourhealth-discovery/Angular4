import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {UserRole} from "./models/UserRole";
import {Http, URLSearchParams} from "@angular/http";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Injectable()
export class UserManagerService {


    public activeRole: ReplaySubject<UserRole> = new ReplaySubject<UserRole>(1);

    constructor(private http: Http) { }

    getUserRoles(userId: string): Observable<UserRole[]> {
        const vm = this;
        let params = new URLSearchParams();
        params.set('userId', userId);
        return vm.http.get('api/userManager/getRoles', {search: params})
            .map((response) => response.json());
    }

    changeDefaultRole(userId: string, defaultRole: string, userRoleId: string): Observable<string> {
        const vm = this;
        let params = new URLSearchParams();
        params.set('userId', userId);
        params.set('defaultRoleId', defaultRole);
        params.set('userRoleId', userRoleId);
        return vm.http.get('api/userManager/setDefaultRole', {search: params})
            .map((response) => response.text());
    }


    changeUserRole(role: UserRole) {
        this.activeRole.next(role);
    }
}