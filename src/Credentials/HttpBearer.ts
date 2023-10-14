/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CredentialsInterface} from "../CredentialsInterface";

export class HttpBearer implements CredentialsInterface {
    private readonly _token: string;

    constructor(token: string) {
        this._token = token;
    }

    get token(): string {
        return this._token;
    }
}