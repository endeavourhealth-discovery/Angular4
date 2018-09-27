import {Injectable} from "@angular/core";
import {
	ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, Routes,
	UrlSegment
} from "@angular/router";
import {AbstractMenuProvider} from "./menuProvider.service";
import {SecurityService} from "../security/security.service";
import {StopComponent} from "./stop.component";
import {UserProject} from "../user-manager/models/UserProject";
import {UserManagerService} from "../user-manager";

@Injectable()
export class MenuAuth implements CanActivate {
    currentUserProject: UserProject;
    previousRoute: string = '';

	constructor(
		private router : Router,
		private menuProvider : AbstractMenuProvider,
		private security : SecurityService,
        private userManagerService: UserManagerService) {

	    if (this.menuProvider.useUserManagerForRoles()) {
            this.userManagerService.activeUserProject.subscribe(active => {
                this.currentUserProject = active;
                this.checkAccess();
            });
        }
	}

    checkAccess() {
		const vm = this;

		let url = vm.router.routerState.snapshot.url;

		if (url.slice(1) == 'stop' && vm.previousRoute != '') {
			// we got redirected to the stop page but now the role has changed so try the original request again
			url = vm.previousRoute;
		}

        let menuOptions = this.menuProvider.getMenuOptions();
        let requiredRole = null;

        for (let menuOption of menuOptions) {
            if (menuOption.state === url.slice(1))
                requiredRole = menuOption.role;
        }

        if (!vm.security.hasPermissionUserManager(requiredRole)) {
        	vm.previousRoute = vm.router.routerState.snapshot.url;
            this.router.navigate(['/stop']);
		} else {
        	// user changed role and now has access so navigate back to previous page
			this.router.navigate([url]);
		}

    }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		const vm = this;
		let client : string = this.menuProvider.getClientId();

		let url : string = route.url[0].path;

		let menuOptions = this.menuProvider.getMenuOptions();

		let userManager = this.menuProvider.useUserManagerForRoles();

		let requiredRole = null;
		for (let menuOption of menuOptions) {
			if (menuOption.state === url)
				requiredRole = menuOption.role;
		}
        let canActivate = false;
        if (userManager && this.security.userProfile) {
        	canActivate = this.security.hasPermissionUserManager(requiredRole);

		} else {
            canActivate = this.security.hasPermission(client, requiredRole);
        }

		if (!canActivate) {
            vm.previousRoute = state.url;
            this.router.navigate(['/stop']);
        }

		return canActivate;
	}

	secureRoutes(appRoutes : Routes) : Routes {
		for (let appRoute of appRoutes) {
			appRoute.canActivate = [MenuAuth];
		}

		appRoutes.push({path: 'stop', component : StopComponent });

		return appRoutes;
	}
}