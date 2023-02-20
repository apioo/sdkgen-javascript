import {AxiosInstance} from "axios";
import {Parser} from "./Parser";

export abstract class TagAbstract {
    protected httpClient: AxiosInstance
    protected parser: Parser

    constructor(httpClient: AxiosInstance, parser: Parser) {
        this.httpClient = httpClient;
        this.parser = parser;
    }
}
