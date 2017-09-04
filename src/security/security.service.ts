import { Injectable } from '@angular/core';
import {User} from "./models/User";
import {KeycloakService} from "../keycloak/keycloak.service";
import {OrganisationGroup} from "./models/OrganisationGroup";
import {Access} from "./models/Access";

@Injectable()
export class SecurityService {
  currentUser:User;

  constructor(private keycloakService : KeycloakService) { }

  getCurrentUser() : User {
    if(!this.currentUser) {
      this.currentUser = this.parseUser();
    }
    return this.currentUser;
  }

  logout() {
    this.keycloakService.logout();
  }

  private getAuthz() {
    return KeycloakService.auth.authz;
  }

	hasPermission(client, role : string) : boolean {
		let clientAccess: Access = this.getCurrentUser().clientAccess[client];
		if (!clientAccess)
			return false;

		if (role == null || role == '')
			return true;


		if (clientAccess && clientAccess.roles)
			return clientAccess.roles.indexOf(role) > -1;

		return false;
	}


	private parseUser() : User {
    if(this.getAuthz().idTokenParsed && this.getAuthz().realmAccess) {
      var user = new User;
      user.forename = this.getAuthz().idTokenParsed.given_name;
      user.surname = this.getAuthz().idTokenParsed.family_name;
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
