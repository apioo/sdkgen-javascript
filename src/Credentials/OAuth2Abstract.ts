import {CredentialsInterface} from "../CredentialsInterface";

export abstract class OAuth2Abstract implements CredentialsInterface {
    private readonly _clientId: string;
    private readonly _clientSecret: string;
    private readonly _tokenUrl: string;
    private readonly _authorizationUrl: string;

    constructor(clientId: string, clientSecret: string, tokenUrl: string, authorizationUrl: string) {
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._tokenUrl = tokenUrl;
        this._authorizationUrl = authorizationUrl;
    }

    get clientId(): string {
        return this._clientId;
    }

    get clientSecret(): string {
        return this._clientSecret;
    }

    get tokenUrl(): string {
        return this._tokenUrl;
    }

    get authorizationUrl(): string {
        return this._authorizationUrl;
    }
}