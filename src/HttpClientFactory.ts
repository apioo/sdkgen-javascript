/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthenticatorInterface} from "./AuthenticatorInterface";
import {HttpClient} from "./HttpClient";
import {ClientAbstract} from "./ClientAbstract";

export class HttpClientFactory {
    constructor(private authenticator: AuthenticatorInterface, private version: string|null = null) {
    }

    public factory(): HttpClient {
        const client = new HttpClient();

        client.addHeaderInterceptor(async (headers: Record<string, string>): Promise<Record<string, string>> => {
            if (this.version) {
                headers['User-Agent'] = ClientAbstract.USER_AGENT + '/' + this.version;
            } else {
                headers['User-Agent'] = ClientAbstract.USER_AGENT;
            }
            headers['Accept'] = 'application/json';

            return headers;
        });

        client.addHeaderInterceptor(async (headers: Record<string, string>): Promise<Record<string, string>> => {
            return this.authenticator.handle(headers);
        });

        return client;
    }
}
