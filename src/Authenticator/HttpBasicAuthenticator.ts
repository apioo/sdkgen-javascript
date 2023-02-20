import {HttpBasic as Credentials} from "../Credentials/HttpBasic";
import {AuthenticatorInterface} from "../AuthenticatorInterface";
import {InternalAxiosRequestConfig} from "axios";

export class HttpBasicAuthenticator implements AuthenticatorInterface {
    private credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async handle(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        config.auth = {
            username: this.credentials.userName,
            password: this.credentials.password
        };

        return config;
    }
}
