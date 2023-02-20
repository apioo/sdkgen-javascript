import {AuthenticatorInterface} from "./AuthenticatorInterface";
import {CredentialsInterface} from "./CredentialsInterface";
import {InvalidCredentialsException} from "./Exception/Authenticator/InvalidCredentialsException";
import {HttpBasic} from "./Credentials/HttpBasic";
import {HttpBasic as HttpBasicAuthenticator} from "./Authenticator/HttpBasic";
import {HttpBearer} from "./Credentials/HttpBearer";
import {HttpBearer as HttpBearerAuthenticator} from "./Authenticator/HttpBearer";
import {ApiKey} from "./Credentials/ApiKey";
import {ApiKey as ApiKeyAuthenticator} from "./Authenticator/ApiKey";
import {OAuth2Abstract} from "./Credentials/OAuth2Abstract";
import {OAuth2 as OAuth2Authenticator} from "./Authenticator/OAuth2";
import {Anonymous} from "./Credentials/Anonymous";
import {Anonymous as AnonymousAuthenticator} from "./Authenticator/Anonymous";

export class AuthenticatorFactory {
    public static factory(credentials: CredentialsInterface): AuthenticatorInterface {
        if (credentials instanceof HttpBasic) {
            return new HttpBasicAuthenticator(credentials);
        } else if (credentials instanceof HttpBearer) {
            return new HttpBearerAuthenticator(credentials);
        } else if (credentials instanceof ApiKey) {
            return new ApiKeyAuthenticator(credentials);
        } else if (credentials instanceof OAuth2Abstract) {
            return new OAuth2Authenticator(credentials);
        } else if (credentials instanceof Anonymous) {
            return new AnonymousAuthenticator(credentials);
        } else {
            throw new InvalidCredentialsException('Could not find authenticator for credentials');
        }
    }
}
