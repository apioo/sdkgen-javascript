import {AccessToken} from "../AccessToken";
import {TokenStoreInterface} from "../TokenStoreInterface";

export class LocalStorageTokenStore implements TokenStoreInterface {
    private readonly key: string;

    constructor(key: string = 'sdkgen_access_token') {
        this.key = key;
    }

    get(): AccessToken|null {
        let value = localStorage.getItem(this.key);
        if (!value) {
            return null;
        }

        return JSON.parse(value)
    }

    persist(token: AccessToken): void {
        localStorage.setItem(this.key, JSON.stringify(token));
    }
}
