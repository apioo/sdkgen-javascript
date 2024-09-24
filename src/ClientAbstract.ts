/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CredentialsInterface} from "./CredentialsInterface";
import {Parser} from "./Parser";
import {AuthenticatorFactory} from "./AuthenticatorFactory";
import {Anonymous} from "./Credentials/Anonymous";
import {HttpClientFactory} from "./HttpClientFactory";
import {AxiosInstance} from "axios";
import {AuthenticatorInterface} from "./AuthenticatorInterface";

export abstract class ClientAbstract {

    public static readonly USER_AGENT = 'SDKgen Client v2.0';

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
