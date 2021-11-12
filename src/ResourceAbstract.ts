import {AxiosInstance} from "axios";

export abstract class ResourceAbstract {
    protected baseUrl: string;
    protected httpClient: AxiosInstance;

    constructor(baseUrl: string, httpClient: AxiosInstance) {
        this.baseUrl = baseUrl;
        this.httpClient = httpClient;
    }
}
