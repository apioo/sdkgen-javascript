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
import {TokenStoreInterface} from "../TokenStoreInterface";
import {MemoryTokenStore} from "../TokenStore/MemoryTokenStore";

export class OAuth2 implements CredentialsInterface {
    private readonly _clientId: string;
    private readonly _clientSecret: string;
    private readonly _tokenUrl: string;
    private readonly _authorizationUrl: string;
    private readonly _tokenStore: TokenStoreInterface;
    private readonly _scopes: Array<string>|null;

    constructor(clientId: string, clientSecret: string, tokenUrl: string, authorizationUrl: string, tokenStore: TokenStoreInterface|null = null, scopes: Array<string>|null = []) {
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._tokenUrl = tokenUrl;
        this._authorizationUrl = authorizationUrl;
        this._tokenStore = tokenStore || new MemoryTokenStore();
        this._scopes = scopes;
    }

    get clientId(): string {
        return this._clientId;
    }

    get clientSecret(): string {
        return this._clientSecret;
    }

    get tokenUrl(): string {
        return this._tokenUrl;
    }

    get authorizationUrl(): string {
        return this._authorizationUrl;
    }

    get tokenStore(): TokenStoreInterface {
        return this._tokenStore;
    }

    get scopes(): Array<string> | null {
        return this._scopes;
    }
}