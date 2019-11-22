import {Injectable} from '@angular/core';
import {Http, Request, XHRBackend, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response, Headers, URLSearchParams} from '@angular/http';

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
    apis: any = {};
    activeUserProject: UserProject;

    constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions, private _keycloakService: KeycloakService,
                private menuProvider: AbstractMenuProvider, private userManagerNotificationService: UserManagerNotificationService) {
        super(_backend, _defaultOptions);
        if (this.menuProvider.useUserManagerForRoles()) {
            this.userManagerNotificationService.activeUserProject.subscribe(active => {
                this.activeUserProject = active;
            });
        }
    }

    processUrl(url: string): Observable<string> {
        let i = url.indexOf('{');
        if (i < 0)
            return Observable.of(url);

        let j = url.indexOf('}', i);
        let api = url.substring(i + 1, j);
        url = url.replace('{' + api + '}', '');

        let host: string = this.apis[api];
        if (host != null) {
            return Observable.of(host + url);
        }
        else {
            let params = new URLSearchParams();
            params.append('api', api);
            return super.get('api/config/api', {search: params})
                .map(result => {
                    this.apis[api] = result.text();
                    return result.text() + url;
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
                                'userProjectId': this.activeUserProject.id
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
                })
                .concatMap(opts => {
                    return this.processUrl(url)
                        .concatMap(newUrl => {
                            return super.request(newUrl, opts);
                        })
                });
        } else if (url instanceof Request) {
            return tokenObservable.map(token => {
                    url.headers.set('Authorization', 'Bearer ' + token);
                    if (this.activeUserProject != null) {
                        url.headers.append('userProjectId', this.activeUserProject.id);
                    }
                    return url;
                })
                .concatMap(request => {
                    return this.processUrl(request.url)
                        .concatMap(newUrl => {
                            request.url = newUrl;
                            return super.request(request);
                        })
                });
        }
    }
}

export function keycloakHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions, keycloakService: KeycloakService,
                                    menuProviderService: AbstractMenuProvider, userManagerNotificationService: UserManagerNotificationService) {
  return new KeycloakHttp(backend, defaultOptions, keycloakService, menuProviderService, userManagerNotificationService);
}
