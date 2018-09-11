import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {UserProject} from "./models/UserProject";
import {Http, URLSearchParams} from "@angular/http";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Injectable()
export class UserManagerService {


    public activeRole: ReplaySubject<UserProject> = new ReplaySubject<UserProject>(1);

    constructor(private http: Http) { }

    getUserProjects(userId: string): Observable<UserProject[]> {
        const vm = this;
        let params = new URLSearchParams();
        params.set('userId', userId);
        return vm.http.get('api/userManager/getProjects', {search: params})
            .map((response) => response.json());
    }

    changeDefaultProject(userId: string, defaultProject: string, userProjectId: string): Observable<string> {
        const vm = this;
        let params = new URLSearchParams();
        params.set('userId', userId);
        params.set('defaultProjectId', defaultProject);
        params.set('userProjectId', userProjectId);
        return vm.http.get('api/userManager/setDefaultProject', {search: params})
            .map((response) => response.text());
    }


    changeUserRole(role: UserProject) {
        this.activeRole.next(role);
    }
}