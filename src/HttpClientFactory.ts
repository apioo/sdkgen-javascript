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

export class HttpClientFactory {
    private authenticator: AuthenticatorInterface;

    constructor(authenticator: AuthenticatorInterface) {
        this.authenticator = authenticator;
    }

    public factory(): HttpClient {
        const client = new HttpClient();

        client.addHeaderInterceptor(async (request: Record<string, string>): Promise<Record<string, string>> => {
            return this.authenticator.handle(request);
        });

        return client;
    }
}
