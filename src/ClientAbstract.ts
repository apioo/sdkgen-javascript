import {CredentialsInterface} from "./CredentialsInterface";
import {Parser} from "./Parser";
import {AuthenticatorFactory} from "./AuthenticatorFactory";
import {Anonymous} from "./Credentials/Anonymous";
import {HttpClientFactory} from "./HttpClientFactory";
import {AxiosInstance} from "axios";
import {AuthenticatorInterface} from "./AuthenticatorInterface";

export abstract class ClientAbstract {

    public static readonly USER_AGENT = 'SDKgen Client v1.0';

    protected authenticator: AuthenticatorInterface
    protected httpClient: AxiosInstance
    protected parser: Parser

    constructor(baseUrl: string, credentials: CredentialsInterface|null = null) {
        this.authenticator = AuthenticatorFactory.factory(credentials || new Anonymous());
        this.httpClient = (new HttpClientFactory(this.authenticator)).factory();
        this.parser = new Parser(baseUrl);
    }

    public getAuthenticator(): AuthenticatorInterface {
        return this.authenticator;
    }
}
