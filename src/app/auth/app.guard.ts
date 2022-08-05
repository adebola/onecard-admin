import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import {NotificationService} from '../shared/service/notification.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {

    constructor( protected readonly router: Router,
                 protected readonly keycloak: KeycloakService,
                 protected readonly notificationService: NotificationService) {
        super(router, keycloak);
    }

    public async isAccessAllowed( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        // Force the user to log in if currently unauthenticated.
        if (!this.authenticated) {
            await this.keycloak.login({
                redirectUri: window.location.origin + state.url
            });
        }

        if (this.keycloak.getUserRoles().filter(role => role.startsWith('Onecard')).length > 0) {
            return true;
        }

        this.notificationService.error('You do not have Permissions to Log on to this platform');
        await this.keycloak.logout();
        return false;
    }
}
