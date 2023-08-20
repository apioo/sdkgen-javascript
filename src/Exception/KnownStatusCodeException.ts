import {ClientException} from "./ClientException";

export abstract class KnownStatusCodeException extends ClientException {

    abstract getPayload(): any;

}
