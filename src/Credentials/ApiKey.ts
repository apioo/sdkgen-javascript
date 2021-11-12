import {CredentialsInterface} from "../CredentialsInterface";

export class ApiKey implements CredentialsInterface {
    private readonly _token: string;
    private readonly _name: string;
    private readonly _in: string;

    constructor(token: string, name: string, location: string) {
        this._token = token;
        this._name = name;
        this._in = location;
    }

    get token(): string {
        return this._token;
    }

    get name(): string {
        return this._name;
    }

    get in(): string {
        return this._in;
    }
}