import {CredentialsInterface} from "./CredentialsInterface";
import {TokenStoreInterface} from "./TokenStoreInterface";
import {AuthorizationCode} from "./Credentials/AuthorizationCode";
import {InvalidCredentialsException} from "./Exception/InvalidCredentialsException";
import {HttpBasic} from "./Credentials/HttpBasic";
import axios, {AxiosInstance} from "axios";
import {OAuth2Abstract} from "./Credentials/OAuth2Abstract";
import {ApiKey} from "./Credentials/ApiKey";
import {HttpBearer} from "./Credentials/HttpBearer";
import {AccessToken} from "./AccessToken";
import {FoundNoAccessTokenException} from "./Exception/FoundNoAccessTokenException";
import {ClientCredentials} from "./Credentials/ClientCredentials";

export abstract class ClientAbstract {

    private static readonly USER_AGENT = 'SDKgen Client v0.1';
    private static readonly EXPIRE_THRESHOLD = 60 * 10;

    protected baseUrl: string
    protected credentials: CredentialsInterface|null
    protected tokenStore: TokenStoreInterface|null
    protected scopes: Array<string>|null

    constructor(baseUrl: string, credentials: CredentialsInterface|null = null, tokenStore: TokenStoreInterface|null = null, scopes: Array<string>|null = []) {
        this.baseUrl = baseUrl;
        this.credentials = credentials;
        this.tokenStore = tokenStore;
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

        const credentials = this.credentials;
        const httpClient = await this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));
        const me = this;

        return new Promise(function(resolve, reject) {
            httpClient.post<AccessToken>(credentials.tokenUrl, {
                headers: {
                    'User-Agent': ClientAbstract.USER_AGENT,
                    'Accept': 'application/json'
                },
                data: {
                    grant_type: 'authorization_code',
                    code: code,
                }
            }).then((response) => {
                me.parseTokenResponse(response.data, resolve);
            }).catch(() => {
                reject()
            });
        });
    }

    public async fetchAccessTokenByClientCredentials(): Promise<AccessToken> {
        if (!(this.credentials instanceof ClientCredentials)) {
            throw new InvalidCredentialsException('The configured credentials do not support the OAuth2 client credentials flow');
        }

        const credentials = this.credentials;
        const httpClient = await this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));
        const me = this;

        return new Promise(function(resolve, reject) {
            let data: {grant_type: string, scope?: string} = {
                grant_type: 'client_credentials'
            };

            if (me.scopes && me.scopes.length > 0) {
                data.scope = me.scopes.join(',');
            }

            httpClient.post<AccessToken>(credentials.tokenUrl, {
                headers: {
                    'User-Agent': ClientAbstract.USER_AGENT,
                    'Accept': 'application/json'
                },
                data: data
            }).then((response) => {
                me.parseTokenResponse(response.data, resolve);
            }).catch(() => {
                reject()
            });
        });
    }

    public async fetchAccessTokenByRefresh(refreshToken: string): Promise<AccessToken> {
        if (!(this.credentials instanceof AuthorizationCode)) {
            throw new InvalidCredentialsException('The configured credentials do not support the OAuth2 flow');
        }

        const credentials = this.credentials;
        const httpClient = await this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));
        const me = this;

        return new Promise(function(resolve, reject) {
            httpClient.post<AccessToken>(credentials.tokenUrl, {
                headers: {
                    'User-Agent': ClientAbstract.USER_AGENT,
                    'Accept': 'application/json'
                },
                data: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                }
            }).then((response) => {
                me.parseTokenResponse(response.data, resolve);
            }).catch(() => {
                reject()
            });
        });
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
        if (!this.tokenStore) {
            throw new FoundNoAccessTokenException('No token store was configured');
        }

        const accessToken = this.tokenStore.get();
        if (!accessToken) {
            throw new FoundNoAccessTokenException('Found no access token, please obtain an access token before making a request');
        }

        if (accessToken.expiresIn > (Math.floor(Date.now() / 1000) + expireThreshold)) {
            return Promise.resolve(accessToken.accessToken);
        }

        if (automaticRefresh && accessToken.refreshToken) {
            const me = this;
            return new Promise(function(resolve, reject){
                me.fetchAccessTokenByRefresh(accessToken.refreshToken).then((accessToken) => {
                    resolve(accessToken.accessToken);
                }).catch(() => {
                    reject();
                });
            });
        } else {
            return Promise.resolve(accessToken.accessToken);
        }
    }

    private parseTokenResponse(token: AccessToken, resolve: Function): void {
        if (this.tokenStore) {
            this.tokenStore.persist(token);
        }

        resolve(token);
    }
}
