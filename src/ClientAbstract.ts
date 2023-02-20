import {CredentialsInterface} from "./CredentialsInterface";
import {Parser} from "./Parser";
import {AuthenticatorFactory} from "./AuthenticatorFactory";
import {Anonymous} from "./Credentials/Anonymous";
import {AuthenticatorInterface} from "./AuthenticatorInterface";
import {HttpClientFactory} from "./HttpClientFactory";
import {AxiosInstance} from "axios";

export abstract class ClientAbstract {

    public static readonly USER_AGENT = 'SDKgen Client v0.2';

    protected baseUrl: string
    protected authenticator: AuthenticatorInterface
    protected client: AxiosInstance
    protected parser: Parser

    constructor(baseUrl: string, credentials: CredentialsInterface|null = null) {
        this.baseUrl = baseUrl;
        this.authenticator = AuthenticatorFactory.factory(credentials || new Anonymous());
        this.client = (new HttpClientFactory(this.authenticator)).factory();
        this.parser = new Parser(baseUrl);
    }

}
