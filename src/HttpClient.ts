/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ClientAbstract} from "./ClientAbstract";
import {HttpRequest} from "./HttpClient/HttpRequest";
import {ClientException} from "./Exception/ClientException";

export class HttpClient {

    private headerInterceptors: Array<(headers: Record<string, string>) => Promise<Record<string, string>>> = [];

    public constructor() {
    }

    public addHeaderInterceptor(interceptor: (request: Record<string, string>) => Promise<Record<string, string>>): void {
        this.headerInterceptors.push(interceptor)
    }

    public async request(request: HttpRequest): Promise<Response> {
        let headers = request.headers || {};
        headers['User-Agent'] = ClientAbstract.USER_AGENT;
        headers['Accept'] = 'application/json';

        for (const headerInterceptor of this.headerInterceptors) {
            headers = await headerInterceptor(headers);
        }

        let contentType;
        let body;
        if (request.data instanceof ArrayBuffer) {
            contentType = 'application/octet-stream';
            body = request.data;
        } else if (request.data instanceof URLSearchParams) {
            contentType = 'application/x-www-form-urlencoded';
            body = request.data;
        } else if (request.data instanceof FormData) {
            contentType = 'multipart/form-data';
            body = request.data;
        } else if (typeof request.data === 'string') {
            contentType = 'text/plain';
            body = request.data;
        } else {
            contentType = 'application/json';
            body = JSON.stringify(request.data);
        }

        if (!headers['Content-Type']) {
            headers['Content-Type'] = contentType;
        }

        let url = request.url;
        if (request.params) {
            url += '?' + new URLSearchParams(request.params).toString();
        }

        try {
            return await fetch(url, {
                headers: headers,
                method: request.method,
                body: body,
            });
        } catch (error) {
            throw new ClientException('An unknown error occurred: ' + String(error));
        }
    }
}
