/**
 * Client automatically generated by SDKgen please do not edit this file manually
 * {@link https://sdkgen.app}
 */

import axios, {AxiosRequestConfig} from "axios";

import {ProductTag} from "./ProductTag";
import {ClientAbstract} from "../../src/ClientAbstract";
import {HttpBearer} from "../../src/Credentials/HttpBearer";

export class Client extends ClientAbstract {
    public product(): ProductTag
    {
        return new ProductTag(
            this.httpClient,
            this.parser
        );
    }



    public static build(token: string): Client
    {
        return new Client('http://127.0.0.1:8081', new HttpBearer(token));
    }
}
