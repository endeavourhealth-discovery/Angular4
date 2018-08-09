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
        console.log('service', userId);
        return vm.http.get('api/userManager/getRoles', {search: params})
            .map((response) => response.json());
    }


    changeUserRole(role: UserRole) {
        this.activeRole.next(role);
    }
}