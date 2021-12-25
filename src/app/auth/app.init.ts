import { KeycloakService } from 'keycloak-angular';
import {environment} from '../../environments/environment';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
    return () =>
        keycloak.init({
            config: {
                url: environment.oauth_url,
                realm: 'onecard',
                clientId: 'public-client',
            },
            initOptions: {
                checkLoginIframe: true,
                checkLoginIframeInterval: 25,
                pkceMethod: 'S256'
            },
            loadUserProfileAtStartUp: true,
        });
}
