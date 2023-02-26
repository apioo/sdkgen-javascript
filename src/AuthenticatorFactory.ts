import {AuthenticatorInterface} from "./AuthenticatorInterface";
import {CredentialsInterface} from "./CredentialsInterface";
import {InvalidCredentialsException} from "./Exception/Authenticator/InvalidCredentialsException";
import {HttpBasic} from "./Credentials/HttpBasic";
import {HttpBearer} from "./Credentials/HttpBearer";
import {ApiKey} from "./Credentials/ApiKey";
import {OAuth2} from "./Credentials/OAuth2";
import {Anonymous} from "./Credentials/Anonymous";
import {HttpBasicAuthenticator} from "./Authenticator/HttpBasicAuthenticator";
import {HttpBearerAuthenticator} from "./Authenticator/HttpBearerAuthenticator";
import {ApiKeyAuthenticator} from "./Authenticator/ApiKeyAuthenticator";
import {OAuth2Authenticator} from "./Authenticator/OAuth2Authenticator";
import {AnonymousAuthenticator} from "./Authenticator/AnonymousAuthenticator";

export class AuthenticatorFactory {
    public static factory(credentials: CredentialsInterface): AuthenticatorInterface {
        if (credentials instanceof HttpBasic) {
            return new HttpBasicAuthenticator(credentials);
        } else if (credentials instanceof HttpBearer) {
            return new HttpBearerAuthenticator(credentials);
        } else if (credentials instanceof ApiKey) {
            return new ApiKeyAuthenticator(credentials);
        } else if (credentials instanceof OAuth2) {
            return new OAuth2Authenticator(credentials);
        } else if (credentials instanceof Anonymous) {
            return new AnonymousAuthenticator(credentials);
        } else {
            throw new InvalidCredentialsException('Could not find authenticator for credentials');
        }
    }
}
