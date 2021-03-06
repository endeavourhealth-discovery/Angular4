import { Component, OnInit } from '@angular/core';
import {AbstractMenuProvider} from "./menuProvider.service";
import {MenuOption} from "./models/MenuOption";
import {SecurityService} from "../security/security.service";
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

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
</section>`,
  styles: [`
      .sidebar .fa {
          position: relative;
          display: table-cell;
          width: 60px;
          height: 36px;
          text-align: center;
          vertical-align: middle;
          font-size: 20px;
      }

      .sidebar:hover,
      nav.sidebar.expanded {
          width: 250px;
          overflow: visible;
      }

      .sidebar {
          background: #fbfbfb;
          border-right: 1px solid #e5e5e5;
          position: fixed;
          top: 0;
          bottom: 0;
          height: 100%;
          left: 0;
          width: 60px;
          padding-top: 53px;
          overflow: hidden;
          -webkit-transition: width .05s linear;
          transition: width .05s linear;
          -webkit-transform: translateZ(0) scale(1, 1);
          z-index: 1000;
      }

      .sidebar > ul {
          margin: 7px 0;
      }

      .sidebar li {
          position: relative;
          display: block;
          width: 250px;
      }

      .sidebar li > .menuItem {
          position: relative;
          display: table;
          border-collapse: collapse;
          border-spacing: 0;
          color: #999;
          font-family: arial;
          font-size: 14px;
          text-decoration: none;
          -webkit-transform: translateZ(0) scale(1, 1);
          -webkit-transition: all .1s linear;
          transition: all .1s linear;
      }

      .sidebar li.active > .menuItem {
          color: #FFFFFF;
      }

      .sidebar .nav-icon {
          position: relative;
          display: table-cell;
          width: 60px;
          height: 36px;
          text-align: center;
          vertical-align: middle;
          font-size: 18px;
      }

      .sidebar .nav-text {
          position: relative;
          display: table-cell;
          vertical-align: middle;
          width: 190px;
          font-family: 'Titillium Web', sans-serif;
      }

      .sidebar > ul.logout {
          position: absolute;
          left: 0;
          bottom: 0;
      }

      .no-touch .scrollable.hover {
          overflow-y: hidden;
      }

      .no-touch .scrollable.hover:hover {
          overflow-y: auto;
          overflow: visible;
      }

      .menuItem:hover,
      .menuItem:focus {
          text-decoration: none;
      }

      nav {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          user-select: none;
      }

      nav ul,
      nav li {
          outline: 0;
          margin: 0;
          padding: 0;
      }

      .sidebar li:hover > .menuItem,
      nav.sidebar li.active > .menuItem,
      .dropdown-menu > li > .menuItem:hover,
      .dropdown-menu > li > .menuItem:focus,
      .dropdown-menu > .active > .menuItem,
      .dropdown-menu > .active > .menuItem:hover,
      .dropdown-menu > .active > .menuItem:focus,
      .no-touch .dashboard-page nav.dashboard-menu ul li:hover .menuItem,
      .dashboard-page nav.dashboard-menu ul li.active .menuItem {
          background-color: #729ec2;
					color: #ffffff;
      }
	`]
})
export class SidebarComponent implements OnInit {
  menuOptions:MenuOption[];
  state: string;

  constructor(private menuProvider:AbstractMenuProvider,
							private securityService:SecurityService,
							private router: Router,
							private activatedRoute: ActivatedRoute) {
    this.menuOptions = menuProvider.getMenuOptions();
    router.events
			.filter((e) => e instanceof NavigationEnd)
			.subscribe((e) => 	this.navEnd(e));
  }

  navEnd(e: any) {
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
