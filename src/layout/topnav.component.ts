import { Component, OnInit } from '@angular/core';
import {AbstractMenuProvider} from "./menuProvider.service";
import {SecurityService} from "../security/security.service";
import {User} from "../security/models/User";

@Component({
  selector: 'topnav',
  template: `  <div class="title-bar">
      <span class="navbar-header" style="width: 50%">
        <img class="logo-image">
        <span class="title-text">{{getApplicationTitle()}}</span>
      </span>
		<div class="pull-right" style="padding: 10px;color:gray">

			<div ngbDropdown class="d-inline-block">
				Logged in :
				<button class="btn btn-info btn-sm" id="userDropdown" ngbDropdownToggle>{{currentUser.title}} {{currentUser.forename}} {{currentUser.surname}}</button>
				<div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
					<button class="dropdown-item"(click)="navigateUserAccount()"><i class="fa fa-user-circle-o"></i> User account</button>
					<button class="dropdown-item"(click)="logout()"><i class="fa fa-power-off"></i> Logout</button>
				</div>
			</div>
		</div>
	</div>`,
  styles: [`
			.title-text {
      font-size: 18px;
      line-height: 50px;
      color: gray;
      margin-left:10px;
      vertical-align: middle;
  }

  .loggedin-text {
      color: gray;
      line-height: 50px;
      vertical-align: middle;
      margin-right: 10px;
  }

  .nhs-logo {
      height: 50px;
      width: 60px;
      line-height: 50px;
      vertical-align: middle;
      text-align: center;
      font-size: 20px;
      color: #fff;
      float: left;
      font-style: italic;
      font-weight: bold;
      background: #337ab7 linear-gradient(to bottom, #337ab7 0%, #2e6da4 100%) repeat-x;
  }`]
})
export class TopnavComponent implements OnInit {
  currentUser:User;

  constructor(private securityService:SecurityService, private menuProvider : AbstractMenuProvider) {
    let vm = this;

    vm.currentUser = this.securityService.getCurrentUser();
  }

  ngOnInit(): void {
  }

  getApplicationTitle() : string {
    return this.menuProvider.getApplicationTitle();
  }

  navigateUserAccount() {
    var url = window.location.protocol + "//" + window.location.host;
    url = url + "/user-manager/#/app/users/userManagerUserView";
    window.location.href = url;
  }

  logout() {
    this.securityService.logout();
  };
}
