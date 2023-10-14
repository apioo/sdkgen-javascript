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

export class MemoryTokenStore implements TokenStoreInterface {
    private token: AccessToken|null = null;

    get(): AccessToken|null {
        return this.token;
    }

    persist(token: AccessToken): void {
        this.token = token;
    }

    remove(): void {
        this.token = null;
    }
}
