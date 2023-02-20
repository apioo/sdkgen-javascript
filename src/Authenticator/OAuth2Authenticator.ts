import {OAuth2Abstract as Credentials} from "../Credentials/OAuth2Abstract";
import {AuthenticatorInterface} from "../AuthenticatorInterface";
import {AccessToken} from "../AccessToken";
import {HttpBasic} from "../Credentials/HttpBasic";
import {ClientCredentials} from "../Credentials/ClientCredentials";
import {InternalAxiosRequestConfig, AxiosResponse} from "axios";
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

    async handle(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        const accessToken = await this.getAccessToken();

        config.headers = config.headers || {};
        config.headers['Authorization'] = 'Bearer ' + accessToken;

        return config;
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
        const httpClient = await this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));

        const response = await httpClient.post<AccessToken>(this.credentials.tokenUrl, {
            grant_type: 'authorization_code',
            code: code,
        }, {
            headers: {
                Accept: 'application/json'
            },
        });

        return this.parseTokenResponse(response);
    }

    public async fetchAccessTokenByClientCredentials(): Promise<AccessToken> {
        const httpClient = await this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));

        let data: {grant_type: string, scope?: string} = {
            grant_type: 'client_credentials'
        };

        if (this.scopes && this.scopes.length > 0) {
            data.scope = this.scopes.join(',');
        }

        const response = await httpClient.post<AccessToken>(this.credentials.tokenUrl, data, {
            headers: {
                Accept: 'application/json'
            },
        });

        return this.parseTokenResponse(response);
    }

    public async fetchAccessTokenByRefresh(refreshToken: string): Promise<AccessToken> {
        const httpClient = await this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));

        const response = await httpClient.post<AccessToken>(this.credentials.tokenUrl, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }, {
            headers: {
                Accept: 'application/json'
            },
        });

        return this.parseTokenResponse(response);
    }


    private async getAccessToken(automaticRefresh: boolean = true, expireThreshold: number = OAuth2Authenticator.EXPIRE_THRESHOLD): Promise<string> {
        const timestamp = Math.floor(Date.now() / 1000);

        let accessToken = this.tokenStore.get();
        if ((!accessToken || accessToken.expires_in < timestamp) && this.credentials instanceof ClientCredentials) {
            accessToken = await this.fetchAccessTokenByClientCredentials();
        }

        if (!accessToken) {
            throw new FoundNoAccessTokenException('Found no access token, please obtain an access token before making a request');
        }

        if (accessToken.expires_in > (timestamp + expireThreshold)) {
            return accessToken.access_token;
        }

        if (automaticRefresh && accessToken.refresh_token) {
            accessToken = await this.fetchAccessTokenByRefresh(accessToken.refresh_token);
        }

        return accessToken.access_token;
    }

    private async parseTokenResponse(response: AxiosResponse<AccessToken>): Promise<AccessToken> {
        if (response.status !== 200) {
            throw new InvalidAccessTokenException('Could not obtain access token, received a non successful status code: ' + response.status);
        }

        if (!response.data.access_token) {
            throw new InvalidAccessTokenException('Could not obtain access token');
        }

        this.tokenStore.persist(response.data);

        return response.data;
    }

    private newHttpClient(credentials: CredentialsInterface) {
        return new HttpClientFactory(AuthenticatorFactory.factory(credentials)).factory();
    }
}
