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

export class HttpBasic implements CredentialsInterface {
    private readonly _userName: string;
    private readonly _password: string;

    constructor(userName: string, password: string) {
        this._userName = userName;
        this._password = password;
    }

    get userName(): string {
        return this._userName;
    }

    get password(): string {
        return this._password;
    }
}