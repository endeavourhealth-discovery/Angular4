import { Component, OnInit } from '@angular/core';
import {AbstractMenuProvider} from "./menuProvider.service";
import {SecurityService} from "../security/security.service";
import {User} from "../security/models/User";
import {UserProject} from "../user-manager/models/UserProject";
import {UserManagerService} from "../user-manager/user-manager.service";
import {LoggerService} from "../logger/logger.service";

@Component({
  selector: 'topnav',
  template: `
      <div class="title-bar">
      <span class="navbar-header" style="width: 50%">
        <img class="logo-image">
        <span class="title-text">{{getApplicationTitle()}}</span>
      </span>
          <div class="pull-right" style="padding: 10px;color:gray">

              <div ngbDropdown class="d-inline-block">
                  Signed in :
                  <button class="btn btn-info btn-sm" id="roleDropdown" ngbDropdownToggle>{{currentUser.title}}
                      {{currentUser.forename}} {{currentUser.surname}}
                  </button>
                  <div class="dropdown-menu dropdown-menu-right" aria-labelledby="roleDropdown">
                      <div *ngFor="let project of userProjects">
                          <div class="dropdown-item">
                              <div class="row align-items-center">
                                  <div [ngClass]="{'active': project == selectedProject}"
                                       class="col-md-10 role-menu-description hoverable" (click)="changeRole(role)">
                                      <p class="mb-0"><b>{{project.projectName}}</b></p>
                                      <p class="mb-0 text-uppercase">
                                          <small>{{project.organisationName}}</small>
                                      </p>
                                  </div>
                                  <div *ngIf="project.default" class="col-md-2">
                                      <i class="fa fa-star" (click)="setAsDefaultRole(role)"></i>
                                  </div>
                                  <div *ngIf="!project.default" class="col-md-2">
                                      <i class="fa fa-star-o" (click)="setAsDefaultRole(role)"></i>
                                  </div>
                              </div>
                          </div>
                          <div class="dropdown-divider"></div>
                      </div>
                      <div class="dropdown-item">
                          <div class="pull-right">
                              <button type="button" class="btn btn-success" (click)="navigateUserAccount()">User
                                  account
                              </button>
                              <button type="button" class="btn btn-danger" (click)="logout()">Sign out</button>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      </div>`,
  styles: [`
      .title-bar {
          position: fixed;
          background: #fbfbfb;
          z-index:1001;
          width: 100%;
      }
      .title-text {
          font-size: 28px;
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

      .logo-image {
          height: 50px;
          width: 50px;
          margin: 5px;
      }
	`]
})
export class TopnavComponent implements OnInit {
  currentUser:User;
  userProjects: UserProject[] = [];
  selectedProject: UserProject;
  roleDetails = false;

  constructor(private securityService:SecurityService, private menuProvider : AbstractMenuProvider,
              private userManagerService: UserManagerService,
              protected logger : LoggerService) {
    let vm = this;

    vm.currentUser = this.securityService.getCurrentUser();
    if (this.menuProvider.useUserManagerForRoles()) {
      vm.roleDetails = true;
      vm.getUserRoles();
    } else {
      vm.roleDetails = false;
    }
  }

  ngOnInit(): void {
  }

  getApplicationTitle() : string {
    return this.menuProvider.getApplicationTitle();
  }

  navigateUserAccount() {
    var url = window.location.protocol + "//" + window.location.host;
    url = url + "/new-user-manager/#/userView";
    window.open(url, '_blank');
  }

  logout() {
    this.securityService.logout();
  };

  getUserRoles(setdefault: boolean = true) {
    const vm = this;
      vm.userManagerService.getUserProjects(vm.currentUser.uuid)
          .subscribe(
              (result) => {
                  vm.userProjects = result;
                  if (setdefault) {
                      vm.findDefaultRole();
                  } else  {
                      vm.setCurrentlyActiveRole();
                  }
              }
          );
  }

  findDefaultRole() {
    const vm = this;
    let fallbackRole : UserProject = null;
    for (let role of vm.userProjects) {
      fallbackRole = role;
      if (role.default) {
        vm.changeRole(role);
        return;
      }
    }
    if (fallbackRole != null) {
        vm.changeRole(fallbackRole);
    }
  }

  setCurrentlyActiveRole() {
      const vm = this;
      for (let role of vm.userProjects) {
          if (role.id === vm.selectedProject.id) {
              vm.selectedProject = role;
          }
      }
  }

  changeRole(role: UserProject) {
    const vm = this;
    vm.selectedProject = role;
    vm.userManagerService.changeUserRole(role);
  }

  setAsDefaultRole(role: UserProject) {
      const vm = this;
      vm.userManagerService.changeDefaultProject(vm.currentUser.uuid, role.id, vm.selectedProject.id)
          .subscribe(
              (result) => {
                vm.logger.success('Default project changed', null, 'Change default project');
                vm.getUserRoles(false);
              },
              (error) => {
                  vm.logger.error('Error changing default project', error, 'Error');
              }
          );
  }
}
