import { Component, OnInit } from '@angular/core';
import {AbstractMenuProvider} from "./menuProvider.service";
import {MenuOption} from "./models/MenuOption";
import {SecurityService} from "../security/security.service";
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UserManagerService} from "../user-manager";

@Component({
  selector: 'sidebar',
  template: `<section id="content" class="content">
  <nav class="sidebar">
    <ul>
      <li *ngFor="let menuItem of menuOptions">
        <div *ngIf="hasPermission(menuItem.role)" class="menuItem" routerLink="{{menuItem.state}}" style="cursor:pointer" [class.selection]="state == menuItem.state">
          <span class="fa fa-2x {{menuItem.icon}}"></span>
          <span class="nav-text">
						{{menuItem.caption}}
					</span>
        </div>
      </li>
    </ul>
    <ul class="logout">
      <li>
        <div (click)="logout()" class="menuItem">
          <i class="fa fa-2x fa-power-off"></i>
          <span style="cursor:pointer" class="nav-text">
						Sign out
				</span>
        </div>
      </li>
    </ul>
  </nav>

  <router-outlet></router-outlet>
</section>`
})
export class SidebarComponent implements OnInit {
  menuOptions:MenuOption[];
  state: string;

  constructor(private menuProvider:AbstractMenuProvider,
							private securityService:SecurityService,
							private router: Router,
							private activatedRoute: ActivatedRoute,
			  				private userManagerService: UserManagerService) {

    router.events
			.filter((e) => e instanceof NavigationEnd)
			.subscribe((e) => 	this.navEnd(e));

      if (this.menuProvider.useUserManagerForRoles()) {
          this.userManagerService.activeUserProject.subscribe(active => {
              this.menuOptions = menuProvider.getMenuOptions();
          });
      } else {
          this.menuOptions = menuProvider.getMenuOptions();
	  }
  }

  navEnd(e: any) {
  	if (this.menuProvider.useUserManagerForRoles() && !this.securityService.userProfile) {
  		return;
	}
  	let newState = e.urlAfterRedirects.substring(1);
  	for (let m of this.menuOptions) {
  		if (m.state == newState)
  			this.state = newState;
		}
	}

  ngOnInit() {
  }

	hasPermission(role : string) : boolean {
		return this.securityService.hasPermission(this.menuProvider.getClientId(), role);
	}

	logout() {
    this.securityService.logout();
  }
}
