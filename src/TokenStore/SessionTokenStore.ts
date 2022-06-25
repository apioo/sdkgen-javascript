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
