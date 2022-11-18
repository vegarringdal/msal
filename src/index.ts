import {
    Configuration,
    PublicClientApplication,
    EventType,
    EventMessage,
    AuthenticationResult
} from "@azure/msal-browser";

let msalConfig: Configuration;
let msalInstance: PublicClientApplication;
let scopes: string[] = [];

let force = true;

// helper so we dont go crazy on getting token
export function forceReload() {
    const oldValue = force;
    force = false;
    return oldValue;
}

export const url = `${window.location.protocol}//${window.location.host}`;
export const azure_config = "azure_config.json";

function init() {
    return new Promise(async (resolve) => {
        if (!msalConfig) {
            let response = await fetch(`${url}/${azure_config}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: null
            });

            // if error show this
            if (!response.ok || !response.body) {
                return false;
            }

            const json = await response.json();
            scopes = json.AZURE_SCOPES;

            msalConfig = {
                auth: {
                    clientId: json.AZURE_CLIENT_ID,
                    authority: `https://login.microsoftonline.com/${json.AZURE_TENDANT_ID}/`,
                    redirectUri: "/",
                    postLogoutRedirectUri: "/"
                }
            };

            msalInstance = new PublicClientApplication(msalConfig);

            msalInstance.addEventCallback((event: EventMessage) => {
                if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
                    const payload = event.payload as AuthenticationResult;
                    const account = payload.account;
                    msalInstance.setActiveAccount(account);
                    resolve(msalInstance);
                }

                return null;
            });

            msalInstance
                .handleRedirectPromise()
                .then(() => {
                    // Check if user signed in
                    const account = msalInstance.getActiveAccount();
                    if (!account) {
                        // redirect anonymous user to login page
                        msalInstance.loginRedirect();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                msalInstance.setActiveAccount(accounts[0]);
                resolve(msalInstance);
            }
        } else {
            resolve(msalInstance);
        }
    });
}

export async function getAzureAuth(force = forceReload()) {
    const ok = await init();

    if (!ok) {
        return null;
    }

    const response = await msalInstance
        .acquireTokenSilent({
            scopes: scopes,
            forceRefresh: force
        })
        .then(function (accessTokenResponse) {
            // Acquire token silent success
            return accessTokenResponse;
        });

    return response;
}

export async function getAccessToken(force: boolean = forceReload()) {
    const response = await getAzureAuth(force);
    return response?.accessToken;
}