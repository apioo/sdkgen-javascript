/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ApiKey as Credentials} from "../Credentials/ApiKey";
import {AuthenticatorInterface} from "../AuthenticatorInterface";
import {InternalAxiosRequestConfig} from "axios";

export class ApiKeyAuthenticator implements AuthenticatorInterface {
    private credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async handle(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        config.headers = config.headers || {};
        config.headers[this.credentials.name] = this.credentials.token;

        return config;
    }
}
