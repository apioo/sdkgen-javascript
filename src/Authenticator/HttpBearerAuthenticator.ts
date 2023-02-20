import {HttpBearer as Credentials} from "../Credentials/HttpBearer";
import {AuthenticatorInterface} from "../AuthenticatorInterface";
import {InternalAxiosRequestConfig} from "axios";

export class HttpBearerAuthenticator implements AuthenticatorInterface {
    private credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async handle(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        config.headers = config.headers || {};
        config.headers['Authorization'] = 'Bearer ' + this.credentials.token;

        return config;
    }
}
