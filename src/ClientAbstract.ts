import {CredentialsInterface} from "./CredentialsInterface";
import {TokenStoreInterface} from "./TokenStoreInterface";
import {AuthorizationCode} from "./Credentials/AuthorizationCode";
import {InvalidCredentialsException} from "./Exception/InvalidCredentialsException";
import {HttpBasic} from "./Credentials/HttpBasic";
import axios, {AxiosInstance, AxiosResponse} from "axios";
import {OAuth2Abstract} from "./Credentials/OAuth2Abstract";
import {ApiKey} from "./Credentials/ApiKey";
import {HttpBearer} from "./Credentials/HttpBearer";
import {AccessToken} from "./AccessToken";
import {FoundNoAccessTokenException} from "./Exception/FoundNoAccessTokenException";
import {ClientCredentials} from "./Credentials/ClientCredentials";
import {MemoryTokenStore} from "./TokenStore/MemoryTokenStore";
import {InvalidAccessTokenException} from "./Exception/InvalidAccessTokenException";

export abstract class ClientAbstract {

    private static readonly USER_AGENT = 'SDKgen Client v0.2';
    private static readonly EXPIRE_THRESHOLD = 60 * 10;

    protected baseUrl: string
    protected credentials: CredentialsInterface|null
    protected tokenStore: TokenStoreInterface
    protected scopes: Array<string>|null

    constructor(baseUrl: string, credentials: CredentialsInterface|null = null, tokenStore: TokenStoreInterface|null = null, scopes: Array<string>|null = []) {
        this.baseUrl = baseUrl;
        this.credentials = credentials;
        this.tokenStore = tokenStore || new MemoryTokenStore();
        this.scopes = scopes;
    }

    public buildRedirectUrl(redirectUrl: string|null = null, scopes: Array<string>|null = [], state: string|null = null): string {
        if (!(this.credentials instanceof AuthorizationCode)) {
            throw new InvalidCredentialsException('The configured credentials do not support the OAuth2 authorization code flow');
        }

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
        if (!(this.credentials instanceof AuthorizationCode)) {
            throw new InvalidCredentialsException('The configured credentials do not support the OAuth2 authorization code flow');
        }

        const httpClient = await this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));

        const response = await httpClient.post<AccessToken>(this.credentials.tokenUrl, {
            headers: {
                'User-Agent': ClientAbstract.USER_AGENT,
                'Accept': 'application/json'
            },
            data: {
                grant_type: 'authorization_code',
                code: code,
            }
        });

        return this.parseTokenResponse(response);
    }

    public async fetchAccessTokenByClientCredentials(): Promise<AccessToken> {
        if (!(this.credentials instanceof ClientCredentials)) {
            throw new InvalidCredentialsException('The configured credentials do not support the OAuth2 client credentials flow');
        }

        const httpClient = await this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));

        let data: {grant_type: string, scope?: string} = {
            grant_type: 'client_credentials'
        };

        if (this.scopes && this.scopes.length > 0) {
            data.scope = this.scopes.join(',');
        }

        const response = await httpClient.post<AccessToken>(this.credentials.tokenUrl, {
            headers: {
                'User-Agent': ClientAbstract.USER_AGENT,
                'Accept': 'application/json'
            },
            data: data
        });

        return this.parseTokenResponse(response);
    }

    public async fetchAccessTokenByRefresh(refreshToken: string): Promise<AccessToken> {
        if (!(this.credentials instanceof AuthorizationCode)) {
            throw new InvalidCredentialsException('The configured credentials do not support the OAuth2 flow');
        }

        const httpClient = await this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));

        const response = await httpClient.post<AccessToken>(this.credentials.tokenUrl, {
            headers: {
                'User-Agent': ClientAbstract.USER_AGENT,
                'Accept': 'application/json'
            },
            data: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }
        });

        return this.parseTokenResponse(response);
    }

    protected async newHttpClient(credentials: CredentialsInterface|null = null): Promise<AxiosInstance> {
        if (credentials === null) {
            credentials = this.credentials;
        }

        let headers : Record<string, string> = {
            Accept: 'application/json'
        };
        if (credentials instanceof HttpBasic) {
            headers['Authorization'] = 'Basic ' + btoa(credentials.userName + ':' + credentials.password);
        } else if (credentials instanceof HttpBearer) {
            headers['Authorization'] = 'Bearer ' + credentials.token;
        } else if (credentials instanceof ApiKey) {
            headers[credentials.name] = credentials.token;
        } else if (credentials instanceof OAuth2Abstract) {
            const accessToken = await this.getAccessToken();
            headers['Authorization'] = 'Bearer ' + accessToken;
        }

        return axios.create({
            headers: headers,
            responseType: 'json',
        });
    }

    private async getAccessToken(automaticRefresh: boolean = true, expireThreshold: number = ClientAbstract.EXPIRE_THRESHOLD): Promise<string> {
        const timestamp = Math.floor(Date.now() / 1000);

        let accessToken = this.tokenStore.get();
        if ((!accessToken || accessToken.expiresIn < timestamp) && this.credentials instanceof ClientCredentials) {
            accessToken = await this.fetchAccessTokenByClientCredentials();
        }

        if (!accessToken) {
            throw new FoundNoAccessTokenException('Found no access token, please obtain an access token before making a request');
        }

        if (accessToken.expiresIn > (timestamp + expireThreshold)) {
            return accessToken.accessToken;
        }

        if (automaticRefresh && accessToken.refreshToken) {
            accessToken = await this.fetchAccessTokenByRefresh(accessToken.refreshToken);
        }

        return accessToken.accessToken;
    }

    private async parseTokenResponse(response: AxiosResponse<AccessToken>): Promise<AccessToken> {
        if (response.status !== 200) {
            throw new InvalidAccessTokenException('Could not obtain access token, received a non successful status code: ' + response.status);
        }

        if (!response.data.accessToken) {
            throw new InvalidAccessTokenException('Could not obtain access token');
        }

        this.tokenStore.persist(response.data);

        return response.data;
    }
}
