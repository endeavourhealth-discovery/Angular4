import { Injectable } from '@angular/core';
import {User} from "./models/User";
import {KeycloakService} from "../keycloak/keycloak.service";
import {OrganisationGroup} from "./models/OrganisationGroup";
import {Access} from "./models/Access";
import {UserManagerService} from "../user-manager/user-manager.service";
import {UserProfile} from "../user-manager/models/UserProfile";
import {ApplicationPolicyAttribute} from "../user-manager/models/ApplicationPolicyAttribute";
import {UserOrganisationProject} from "../user-manager/models/UserOrganisationProject";
import {UserProject} from "../user-manager/models/UserProject";
import {AbstractMenuProvider} from "../layout/menuProvider.service";

@Injectable()
export class SecurityService {
  currentUser:User;
  userProfile : UserProfile;
  activeUserProject: UserProject;



  constructor(private menuProvider:AbstractMenuProvider,
              private keycloakService : KeycloakService,
              private userManagerService: UserManagerService) {

      if (this.menuProvider.useUserManagerForRoles()) {
          this.userManagerService.activeUserProject.subscribe(active => {
              this.activeUserProject = active;
          });
      }
  }

  getCurrentUser() : User {
    if(!this.currentUser) {
      this.currentUser = this.parseUser();
    }
    return this.currentUser;
  }

  setCurrentUserProfile(userProfile: UserProfile) {
      this.userProfile = userProfile;
  }

  getCurrentUserProfile() : UserProfile {
      return this.userProfile;
  }

  logout() {
    this.keycloakService.logout();
  }

  private getAuthz() {
    return KeycloakService.auth.authz;
  }

	hasPermission(client, role : string) : boolean {

        if (this.menuProvider.useUserManagerForRoles()) {
            if (this.userProfile) {
                return this.hasPermissionUserManager(role);
            }
        }
		let clientAccess: Access = this.getCurrentUser().clientAccess[client];

		if (!clientAccess)
			return false;

		if (role == null || role == '')
			return true;

		if (clientAccess && clientAccess.roles)
			return clientAccess.roles.indexOf(role) > -1;

		return false;
	}

    hasPermissionUserManager(role : string) : boolean {

        const vm = this;
        let application = vm.menuProvider.getApplicationTitle();
        console.log(vm.activeUserProject);

        if (role == null || role == '')
            return true;

        let org : UserOrganisationProject = vm.userProfile.organisationProjects.find(x => x.organisation.uuid == vm.activeUserProject.organisationId);

        if (org == null) {
            return false;
        }

        let attributes: ApplicationPolicyAttribute[] = org.projects.find(y => y.uuid == vm.activeUserProject.projectId).applicationPolicyAttributes;

        if (attributes == null) {
            return false;
        }

        let appAttributes = attributes.filter(x => x.application == application);
        if (appAttributes == null) {
            return false;
        }

        return appAttributes.find(x => x.applicationAccessProfileName == role) != null;

    }


	private parseUser() : User {
    if(this.getAuthz().idTokenParsed && this.getAuthz().realmAccess) {
      var user = new User;
      user.forename = this.getAuthz().idTokenParsed.given_name;
      user.surname = this.getAuthz().idTokenParsed.family_name;
			user.organisation = this.getAuthz().idTokenParsed.organisationId;
      //user.title = this.getAuthz().idTokenParsed.title;              // TODO: custom attribute??
      user.uuid = this.getAuthz().idTokenParsed.sub;
      user.permissions = this.getAuthz().realmAccess.roles;
      user.clientAccess = this.getAuthz().resourceAccess;

      user.organisationGroups = [];

      if (this.getAuthz().idTokenParsed.orgGroups != null) {
        for (var orgGroup of this.getAuthz().idTokenParsed.orgGroups) {

          // Set default organisation
          if (!user.organisation && orgGroup.organisationId != '00000000-0000-0000-0000-000000000000')
            user.organisation = orgGroup.organisationId;

          let organisationGroup: OrganisationGroup = new OrganisationGroup();
          organisationGroup.id = orgGroup.groupId;
          organisationGroup.name = orgGroup.group;
          // TODO : OrganisationId <--> ServiceId
          organisationGroup.organisationId = orgGroup.organisationId;
          organisationGroup.roles = [];
          for (var role of orgGroup.roles) {
            organisationGroup.roles.push(role);
          }
          user.organisationGroups.push(organisationGroup);
        }
      }

      user.isSuperUser = false;                                   // TODO: design session needed on RBAC roles / ABAC attributes!
      for(var permission of user.permissions) {
        if(permission == 'eds_superuser') {
          user.isSuperUser = true;
          break;
        }
      }

      return user;
    }
    return null;
  }
}
