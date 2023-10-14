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
import axios, {AxiosInstance} from "axios";
import {ClientAbstract} from "./ClientAbstract";

export class HttpClientFactory {
    private authenticator: AuthenticatorInterface;

    constructor(authenticator: AuthenticatorInterface) {
        this.authenticator = authenticator;
    }

    public factory(): AxiosInstance {
        let headers : Record<string, string> = {
            'User-Agent': ClientAbstract.USER_AGENT,
            'Accept': 'application/json',
        };

        const client = axios.create({
            headers: headers,
            responseType: 'json',
        });

        client.interceptors.request.use(async (config) => {
            return await this.authenticator.handle(config);
        });

        return client;
    }
}
