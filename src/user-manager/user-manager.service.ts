import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {UserProject} from "./models/UserProject";
import {Http, URLSearchParams} from "@angular/http";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {UserProfile} from "./models/UserProfile";

@Injectable()
export class UserManagerService {
    public activeUserProject: ReplaySubject<UserProject> = new ReplaySubject<UserProject>(1);
    public currentUserProject: UserProject;

    constructor(private http: Http) { }

    getUserProjects(userId: string): Observable<UserProject[]> {
        const vm = this;
        let params = new URLSearchParams();
        params.set('userId', userId);
        return vm.http.get('api/userManager/getProjects', {search: params})
            .map((response) => response.json());
    }

    getCurrentUserProject() : UserProject {
        return this.currentUserProject;
    }

    getUserProfile(userId: string): Observable<UserProfile> {
        const vm = this;
        let params = new URLSearchParams();
        params.set('userId', userId);
        return vm.http.get('api/userManager/getUserProfile', {search: params})
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


    changeUserProject(userProject: UserProject) {
        this.activeUserProject.next(userProject);
        this.currentUserProject = userProject;
    }
}