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

export class ApiKey implements CredentialsInterface {
    private readonly _token: string;
    private readonly _name: string;
    private readonly _in: string;

    constructor(token: string, name: string, location: string) {
        this._token = token;
        this._name = name;
        this._in = location;
    }

    get token(): string {
        return this._token;
    }

    get name(): string {
        return this._name;
    }

    get in(): string {
        return this._in;
    }
}