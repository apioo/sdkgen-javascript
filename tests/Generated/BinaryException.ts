/**
 * BinaryException automatically generated by SDKgen please do not edit this file manually
 * {@link https://sdkgen.app}
 */

import {KnownStatusCodeException} from "../../src"


export class BinaryException extends KnownStatusCodeException {

    public constructor(private payload: ArrayBuffer) {
        super('The server returned an error');
    }

    public getPayload(): ArrayBuffer {
        return this.payload;
    }

}
