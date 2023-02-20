import {ApiKey as Credentials} from "../Credentials/ApiKey";
import {AuthenticatorInterface} from "../AuthenticatorInterface";
import {AxiosRequestConfig} from "axios";

export class ApiKeyAuthenticator implements AuthenticatorInterface {
    private credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async handle(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        config.headers = config.headers || {};
        config.headers[this.credentials.name] = this.credentials.token;

        return config;
    }
}
