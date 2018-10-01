import {Injectable} from '@angular/core';
import {Http, Request, XHRBackend, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response, Headers} from '@angular/http';

import {KeycloakService} from './keycloak.service';
import {Observable} from 'rxjs/Rx';
import {AbstractMenuProvider} from "../layout/menuProvider.service";
import {UserProject} from "../user-manager/models/UserProject";
import {UserManagerNotificationService} from "../user-manager/user-manager-notification.service";

/**
 * This provides a wrapper over the ng2 Http class that insures tokens are refreshed on each request.
 */
@Injectable()
export class KeycloakHttp extends Http {
    activeUserProject: UserProject;

  constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions, private _keycloakService: KeycloakService,
              private menuProvider:AbstractMenuProvider, private userManagerNotificationService: UserManagerNotificationService ) {
    super(_backend, _defaultOptions);
      if (this.menuProvider.useUserManagerForRoles()) {
          this.userManagerNotificationService.activeUserProject.subscribe(active => {
              this.activeUserProject = active;
          });
      }
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    const tokenPromise: Promise<string> = this._keycloakService.getToken();
    const tokenObservable: Observable<string> = Observable.fromPromise(tokenPromise);

    if (typeof url === 'string') {
      return tokenObservable.map(token => {
        var authOptions;
        if (this.activeUserProject != null) {
            authOptions = new RequestOptions({
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                    'projectId': this.activeUserProject.projectId
                })
            });
        } else {
            authOptions = new RequestOptions({
                headers: new Headers({
                    'Authorization': 'Bearer ' + token
                })
            });
        }

        return new RequestOptions().merge(options).merge(authOptions);
      }).concatMap(opts => super.request(url, opts));
    } else if (url instanceof Request) {
      return tokenObservable.map(token => {
        url.headers.set('Authorization', 'Bearer ' + token);
        if (this.activeUserProject != null) {
            url.headers.append('projectId', this.activeUserProject.projectId);
        }
        return url;
      }).concatMap(request => super.request(request));
    }
  }
}

export function keycloakHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions, keycloakService: KeycloakService,
                                    menuProviderService: AbstractMenuProvider, userManagerNotificationService: UserManagerNotificationService) {
  return new KeycloakHttp(backend, defaultOptions, keycloakService, menuProviderService, userManagerNotificationService);
}
