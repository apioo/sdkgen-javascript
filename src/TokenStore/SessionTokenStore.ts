/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AccessToken} from "../AccessToken";
import {TokenStoreInterface} from "../TokenStoreInterface";

export class SessionTokenStore implements TokenStoreInterface {
    private readonly key: string;

    constructor(key: string = 'sdkgen_access_token') {
        this.key = key;
    }

    get(): AccessToken|null {
        let value = sessionStorage.getItem(this.key);
        if (!value) {
            return null;
        }

        return JSON.parse(value)
    }

    persist(token: AccessToken): void {
        sessionStorage.setItem(this.key, JSON.stringify(token));
    }

    remove(): void {
        sessionStorage.removeItem(this.key);
    }
}
