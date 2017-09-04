import {Injectable} from "@angular/core";
import {
	ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, Routes,
	UrlSegment
} from "@angular/router";
import {AbstractMenuProvider} from "./menuProvider.service";
import {SecurityService} from "../security/security.service";
import {StopComponent} from "./stop.component";

@Injectable()
export class MenuAuth implements CanActivate {

	constructor(
		private router : Router,
		private menuProvider : AbstractMenuProvider,
		private security : SecurityService) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

		let client : string = this.menuProvider.getClientId();

		let url : string = route.url[0].path;

		let menuOptions = this.menuProvider.getMenuOptions();

		let requiredRole = null;
		for (let menuOption of menuOptions) {
			if (menuOption.state === url)
				requiredRole = menuOption.role;
		}

		let canActivate = this.security.hasPermission(client, requiredRole);

		if (!canActivate)
			this.router.navigate(['/stop']);

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