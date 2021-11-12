import {CredentialsInterface} from "./CredentialsInterface";
import {TokenStoreInterface} from "./TokenStoreInterface";
import {AuthorizationCode} from "./Credentials/AuthorizationCode";
import {InvalidCredentialsException} from "./Exception/InvalidCredentialsException";
import {HttpBasic} from "./Credentials/HttpBasic";
import axios from "axios";
import {OAuth2Abstract} from "./Credentials/OAuth2Abstract";
import {ApiKey} from "./Credentials/ApiKey";
import {HttpBearer} from "./Credentials/HttpBearer";
import {AccessToken} from "./AccessToken";
import {FoundNoAccessTokenException} from "./Exception/FoundNoAccessTokenException";

export abstract class ClientAbstract {

    private static readonly USER_AGENT = 'SDKgen Client v0.1';
    private static readonly EXPIRE_THRESHOLD = 60 * 10;

    protected credentials: CredentialsInterface|null = null
    protected baseUrl: string
    protected tokenStore: TokenStoreInterface

    constructor(baseUrl: string, tokenStore: TokenStoreInterface) {
        this.baseUrl = baseUrl;
        this.tokenStore = tokenStore;
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

        if (scopes) {
            url.searchParams.set('scopes', scopes.join(','));
        }

        if (state) {
            url.searchParams.set('state', state);
        }

        return url.toString();
    }

    public fetchAccessTokenByCode(code: string): Promise<AccessToken> {
        if (!(this.credentials instanceof AuthorizationCode)) {
            throw new InvalidCredentialsException('The configured credentials do not support the OAuth2 authorization code flow');
        }

        const credentials = this.credentials;
        const httpClient = this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));
        const tokenStore = this.tokenStore;

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
                if (tokenStore) {
                    tokenStore.persist(response.data);
                }

                resolve(response.data);
            }).catch(() => {
                reject()
            });
        });
    }

    public fetchAccessTokenByRefresh(refreshToken: string): Promise<AccessToken> {
        if (!(this.credentials instanceof AuthorizationCode)) {
            throw new InvalidCredentialsException('The configured credentials do not support the OAuth2 flow');
        }

        const credentials = this.credentials;
        const httpClient = this.newHttpClient(new HttpBasic(this.credentials.clientId, this.credentials.clientSecret));
        const tokenStore = this.tokenStore;

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
                if (tokenStore) {
                    tokenStore.persist(response.data);
                }

                resolve(response.data);
            }).catch(() => {
                reject()
            });
        });
    }

    private getAccessToken(automaticRefresh: boolean = true, expireThreshold: number = ClientAbstract.EXPIRE_THRESHOLD): Promise<string> {
        const accessToken = this.tokenStore.get();
        if (!accessToken) {
            throw new FoundNoAccessTokenException('Found no access token, please obtain an access token before making an request');
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

    private newHttpClient(credentials: CredentialsInterface) {
        let headers : Record<string, string> = {};
        if (credentials instanceof HttpBasic) {
            headers['Authorization'] = 'Basic ' + btoa(credentials.userName + ':' + credentials.password);
        } else if (credentials instanceof HttpBearer) {
            headers['Authorization'] = 'Bearer ' + credentials.token;
        } else if (credentials instanceof ApiKey) {
            headers[credentials.name] = credentials.token;
        } else if (credentials instanceof OAuth2Abstract) {
            headers['Authorization'] = 'Bearer ' + this.getAccessToken();
        }

        return axios.create({
            headers: headers
        });
    }

}