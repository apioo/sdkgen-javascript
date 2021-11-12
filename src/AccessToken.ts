
export class AccessToken {
    private readonly _accessToken: string;
    private readonly _tokenType: string;
    private readonly _expiresIn: number
    private readonly _refreshToken: string;
    private readonly _scope: string;

    constructor(accessToken: string, tokenType: string, expiresIn: number, refreshToken: string, scope: string) {
        this._accessToken = accessToken;
        this._tokenType = tokenType;
        this._expiresIn = expiresIn;
        this._refreshToken = refreshToken;
        this._scope = scope;
    }

    get accessToken(): string {
        return this._accessToken;
    }

    get tokenType(): string {
        return this._tokenType;
    }

    get expiresIn(): number {
        return this._expiresIn;
    }

    get refreshToken(): string {
        return this._refreshToken;
    }

    get scope(): string {
        return this._scope;
    }
}