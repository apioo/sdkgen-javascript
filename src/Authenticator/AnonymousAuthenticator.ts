import {Anonymous as Credentials} from "../Credentials/Anonymous";
import {AuthenticatorInterface} from "../AuthenticatorInterface";
import {InternalAxiosRequestConfig} from "axios";

export class AnonymousAuthenticator implements AuthenticatorInterface {
    private credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async handle(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        return config;
    }
}
