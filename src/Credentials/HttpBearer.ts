import {CredentialsInterface} from "../CredentialsInterface";

export class HttpBearer implements CredentialsInterface {
    private readonly _token: string;

    constructor(token: string) {
        this._token = token;
    }

    get token(): string {
        return this._token;
    }
}