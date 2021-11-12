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
}
