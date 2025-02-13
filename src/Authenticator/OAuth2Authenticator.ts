/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {OAuth2 as Credentials} from "../Credentials/OAuth2";
import {AuthenticatorInterface} from "../AuthenticatorInterface";
import {AccessToken} from "../AccessToken";
import {HttpBasic} from "../Credentials/HttpBasic";
import {TokenStoreInterface} from "../TokenStoreInterface";
import {InvalidAccessTokenException} from "../Exception/Authenticator/InvalidAccessTokenException";
import {FoundNoAccessTokenException} from "../Exception/Authenticator/FoundNoAccessTokenException";
import {HttpClientFactory} from "../HttpClientFactory";
import {AuthenticatorFactory} from "../AuthenticatorFactory";
import {CredentialsInterface} from "../CredentialsInterface";

export class OAuth2Authenticator implements AuthenticatorInterface {
    private static readonly EXPIRE_THRESHOLD = 60 * 10;

    private credentials: Credentials;
    private tokenStore: TokenStoreInterface;
    private scopes: Array<string>|null;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
        this.tokenStore = credentials.tokenStore;
        this.scopes = credentials.scopes;
    }

    async handle(headers: Record<string, string>): Promise<Record<string, string>> {
        try {
            const accessToken = await this.getAccessToken();

            headers['Authorization'] = 'Bearer ' + accessToken;

            return headers;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public buildRedirectUrl(redirectUrl: string|null = null, scopes: Array<string>|null = [], state: string|null = null): string {
        let url = new URL(this.credentials.authorizationUrl);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', this.credentials.clientId);

        if (redirectUrl) {
            url.searchParams.set('redirect_uri', redirectUrl);
        }

        if (scopes && scopes.length > 0) {
            url.searchParams.set('scopes', scopes.join(','));
        } else if (this.scopes && this.scopes.length > 0) {
            url.searchParams.set('scopes', this.scopes.join(','));
        }

        if (state) {
            url.searchParams.set('state', state);
        }

        return url.toString();
    }

    public async fetchAccessTokenByCode(code: string): Promise<AccessToken> {
        const httpClient = this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));

        const response = await httpClient.request({
            url: this.credentials.tokenUrl,
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
            })
        });

        return this.parseTokenResponse(response.status, await response.json() as AccessToken);
    }

    public async fetchAccessTokenByClientCredentials(): Promise<AccessToken> {
        const httpClient = this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));

        let data: {grant_type: string, scope?: string} = {
            grant_type: 'client_credentials'
        };

        if (this.scopes && this.scopes.length > 0) {
            data.scope = this.scopes.join(',');
        }

        const response = await httpClient.request({
            url: this.credentials.tokenUrl,
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            data: new URLSearchParams(data)
        });

        return this.parseTokenResponse(response.status, await response.json() as AccessToken);
    }

    public async fetchAccessTokenByRefresh(refreshToken: string): Promise<AccessToken> {
        const httpClient = this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));

        const response = await httpClient.request({
            url: this.credentials.tokenUrl,
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            data: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            })
        });

        return this.parseTokenResponse(response.status, await response.json() as AccessToken);
    }


    private async getAccessToken(automaticRefresh: boolean = true, expireThreshold: number = OAuth2Authenticator.EXPIRE_THRESHOLD): Promise<string> {
        const timestamp = Math.floor(Date.now() / 1000);

        let accessToken = this.tokenStore.get();
        if (!accessToken || this.getExpiresInTimestamp(accessToken.expires_in) < timestamp) {
            accessToken = await this.fetchAccessTokenByClientCredentials();
        }

        if (!accessToken) {
            throw new FoundNoAccessTokenException('Found no access token, please obtain an access token before making a request');
        }

        if (this.getExpiresInTimestamp(accessToken.expires_in) > (timestamp + expireThreshold)) {
            return accessToken.access_token;
        }

        if (automaticRefresh && accessToken.refresh_token) {
            accessToken = await this.fetchAccessTokenByRefresh(accessToken.refresh_token);
        }

        return accessToken.access_token;
    }

    private getExpiresInTimestamp(expiresIn: number): number
    {
        const nowTimestamp = Math.floor(Date.now() / 1000);

        if (expiresIn < 529196400) {
            // in case the expires in is lower than 1986-10-09 we assume that the field represents the duration in seconds
            // otherwise it is probably a timestamp
            expiresIn = nowTimestamp + expiresIn;
        }

        return expiresIn;
    }

    private async parseTokenResponse(status: number, data: AccessToken): Promise<AccessToken> {
        if (status !== 200) {
            throw new InvalidAccessTokenException('Could not obtain access token, received a non successful status code: ' + status);
        }

        if (!data.access_token) {
            throw new InvalidAccessTokenException('Could not obtain access token');
        }

        this.tokenStore.persist(data);

        return data;
    }

    private newHttpClient(credentials: CredentialsInterface) {
        return new HttpClientFactory(AuthenticatorFactory.factory(credentials)).factory();
    }
}
