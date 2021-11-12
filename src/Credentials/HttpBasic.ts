import {CredentialsInterface} from "../CredentialsInterface";

export class HttpBasic implements CredentialsInterface {
    private readonly _userName: string;
    private readonly _password: string;

    constructor(userName: string, password: string) {
        this._userName = userName;
        this._password = password;
    }

    get userName(): string {
        return this._userName;
    }

    get password(): string {
        return this._password;
    }
}