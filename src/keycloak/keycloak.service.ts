import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

declare var Keycloak: any;
declare var jQuery, $:any;

@Injectable()
export class KeycloakService {
    static auth: any = {};

    static init(): Promise<any> {

        return KeycloakService.getConfig();
    }

    private static getConfig(): Promise<any> {
        var defer = jQuery.Deferred();
        jQuery.getJSON("public/wellknown/authconfig", (data: any, textStatus: string, jqXHR: any) => {
            defer.resolve(data);
        });

        return new Promise((resolve, reject) => {
            jQuery.when(defer.promise()).then(
                function (data) {
                    KeycloakService.initKeycloak(resolve, reject, data);
                });
        });
    }

    private static initKeycloak(resolve, reject, config) {
        const keycloakAuth: any = Keycloak({
            realm: config.realm,
            url: config.authServerUrl,
            clientId: config.authClientId,
        });

        KeycloakService.auth.loggedIn = false;

        keycloakAuth.init({onLoad: 'login-required', checkLoginIframe: false})
            .success(() => {
                KeycloakService.auth.loggedIn = true;
                KeycloakService.auth.authz = keycloakAuth;
                KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl
                    + '/realms/' + config.realm + '/protocol/openid-connect/logout?redirect_uri='
                    + document.baseURI;
                resolve();
            })
            .error(() => {
                reject();
            });
    }

    public getAuthz() {
        return KeycloakService.auth;
    }

    logout() {
        console.log('*** LOGOUT');
        KeycloakService.auth.loggedIn = false;
        KeycloakService.auth.authz = null;

        window.location.href = KeycloakService.auth.logoutUrl;
    }

    getToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (KeycloakService.auth.authz.token) {
                KeycloakService.auth.authz
                    .updateToken(5)
                    .success(() => {
                        resolve(<string>KeycloakService.auth.authz.token);
                    })
                    .error(() => {
                        window.location.href = KeycloakService.auth.authz.createLoginUrl();
                        reject('Failed to refresh token');
                    });
            } else {
                window.location.href = KeycloakService.auth.authz.createLoginUrl();
                reject('Not logged in');
            }
        });
    }
}
