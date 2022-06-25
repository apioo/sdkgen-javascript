import {AccessToken} from "./AccessToken";

export interface TokenStoreInterface {
    get(): AccessToken|null;
    persist(token: AccessToken): void;
    remove(): void;
}
