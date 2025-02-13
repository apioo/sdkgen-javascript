/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpBasic as Credentials} from "../Credentials/HttpBasic";
import {AuthenticatorInterface} from "../AuthenticatorInterface";

export class HttpBasicAuthenticator implements AuthenticatorInterface {
    private credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async handle(headers: Record<string, string>): Promise<Record<string, string>> {
        headers['Authorization'] = 'Basic ' + btoa(this.credentials.userName + ':' + this.credentials.password);

        return headers;
    }
}
