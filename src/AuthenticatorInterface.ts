import {AxiosRequestConfig} from "axios";

export interface AuthenticatorInterface {

    handle(config: AxiosRequestConfig): Promise<AxiosRequestConfig>;

}
