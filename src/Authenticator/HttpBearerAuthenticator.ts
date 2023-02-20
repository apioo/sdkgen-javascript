import {HttpBearer as Credentials} from "../Credentials/HttpBearer";
import {AuthenticatorInterface} from "../AuthenticatorInterface";
import {AxiosRequestConfig} from "axios";

export class HttpBearerAuthenticator implements AuthenticatorInterface {
    private credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async handle(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        config.headers = config.headers || {};
        config.headers['Authorization'] = 'Bearer ' + this.credentials.token;

        return config;
    }
}
