import {InternalAxiosRequestConfig} from "axios";

export interface AuthenticatorInterface {

    handle(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig>;

}
