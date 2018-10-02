import {Injectable} from "@angular/core";
import {UserProject} from "./models/UserProject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Region} from "./models/Region";

@Injectable()
export class UserManagerNotificationService {
    public activeUserProject: ReplaySubject<UserProject> = new ReplaySubject<UserProject>(1);
    public currentUserProject: UserProject;
    public userRegion: Region;

    constructor() { }

    changeUserProject(userProject: UserProject) {
        this.activeUserProject.next(userProject);
        this.currentUserProject = userProject;
    }

    getCurrentUserProject() : UserProject {
        return this.currentUserProject;
    }

    setUserRegion(userRegion : Region) {
        this.userRegion = userRegion
    }

    getCurrentUserRegion() : Region {
        return this.userRegion;
    }
}