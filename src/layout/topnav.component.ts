import { Component, OnInit } from '@angular/core';
import {AbstractMenuProvider} from "./menuProvider.service";
import {SecurityService} from "../security/security.service";
import {User} from "../security/models/User";
import {UserProject} from "../user-manager/models/UserProject";
import {UserManagerService} from "../user-manager/user-manager.service";
import {LoggerService} from "../logger/logger.service";
import {UserProfile} from "../user-manager/models/UserProfile";
import {UserOrganisationProject} from "../user-manager/models/UserOrganisationProject";
import {ApplicationPolicyAttribute} from "../user-manager/models/ApplicationPolicyAttribute";
import {UserManagerNotificationService} from "../user-manager/user-manager-notification.service";

@Component({
	selector: 'topnav',
	template: `
		<div class="title-bar">
      <span class="navbar-header" style="width: 50%">
        <img class="logo-image">
        <span class="title-text">{{getApplicationTitle()}}</span>
      </span>
			<div class="pull-right" style="padding: 10px;color:gray">

				<div class="d-inline-block">
					<div class="dropdown">
						Signed in :
						<button class="btn dropdown-toggle btn-info btn-sm" id="roleDropdown" data-toggle="dropdown">{{currentUser.title}}
							{{currentUser.forename}} {{currentUser.surname}}
						</button>
						<div class="dropdown-menu dropdown-menu-right" aria-labelledby="roleDropdown">
							<div *ngFor="let project of userProjects">
								<div class="dropdown-item">
									<div class="row align-items-center">
										<div [ngClass]="{'active': project == selectedProject}"
												 class="col-md-10 role-menu-description hoverable" (click)="changeProject(project)">
											<p class="mb-0"><b>{{project.projectName}}</b></p>
											<p class="mb-0 text-uppercase">
												<small>{{project.organisationName}}</small>
											</p>
										</div>
										<div *ngIf="project.default" class="col-md-2">
											<i class="fa fa-star" (click)="setAsDefaultProject(project)"></i>
										</div>
										<div *ngIf="!project.default" class="col-md-2">
											<i class="fa fa-star-o" (click)="setAsDefaultProject(project)"></i>
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
			</div>
		</div>`
})
export class TopnavComponent implements OnInit {
	currentUser:User;
	userProjects: UserProject[] = [];
	selectedProject: UserProject;
	roleDetails = false;
	userProfile : UserProfile;

	constructor(private securityService:SecurityService, private menuProvider : AbstractMenuProvider,
							private userManagerService: UserManagerService,
							private userManagerNotificationService: UserManagerNotificationService,
							protected logger : LoggerService) {
		let vm = this;

		vm.currentUser = this.securityService.getCurrentUser();
		if (this.menuProvider.useUserManagerForRoles()) {
			vm.roleDetails = true;
            vm.getUserProfile();
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
		url = url + "/user-manager/#/userView";
		window.open(url, '_blank');
	}

	logout() {
		this.securityService.logout();
	};

    getUserProfile(setdefault: boolean = true) {
        const vm = this;
        vm.userManagerService.getUserProfile(vm.currentUser.uuid)
            .subscribe(
                (result) => {
                    vm.userProfile = result;
                    console.log(result);
                    vm.securityService.setCurrentUserProfile(result);
                    vm.userManagerNotificationService.setUserRegion(vm.userProfile.region);
                    vm.getUserProjects();
                }
            );
    }

	getUserProjects(setDefault: boolean = true) {
		const vm = this;
		vm.userManagerService.getUserProjects(vm.currentUser.uuid)
			.subscribe(
				(result) => {
					vm.userProjects = result;
					console.log(result);
					if (setDefault) {
						vm.findDefaultProject();
					} else  {
						vm.setCurrentlyActiveRole();
					}
				}
			);
	}

	findDefaultProject() {
		const vm = this;
		let fallbackRole : UserProject = null;
		for (let role of vm.userProjects) {
			fallbackRole = role;
			if (role.default) {
				vm.changeProject(role);
				return;
			}
		}
		if (fallbackRole != null) {
			vm.changeProject(fallbackRole);
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

	changeProject(userProject: UserProject) {
		const vm = this;
		vm.selectedProject = userProject;
		let org : UserOrganisationProject = vm.userProfile.organisationProjects.find(x => x.organisation.uuid == userProject.organisationId);

		let attributes: ApplicationPolicyAttribute[] = org.projects.find(y => y.uuid == userProject.projectId).applicationPolicyAttributes;
		let appAttributes = attributes.filter(x => x.application == this.menuProvider.getApplicationTitle());
		userProject.applicationPolicyAttributes = appAttributes;
		vm.userManagerNotificationService.changeUserProject(userProject);
	}

	setAsDefaultProject(role: UserProject) {
		const vm = this;
		vm.userManagerService.changeDefaultProject(vm.currentUser.uuid, role.id, vm.selectedProject.id)
			.subscribe(
				(result) => {
					vm.logger.success('Default project changed', null, 'Change default project');
					vm.getUserProfile(false);
				},
				(error) => {
					vm.logger.error('Error changing default project', error, 'Error');
				}
			);
	}
}
