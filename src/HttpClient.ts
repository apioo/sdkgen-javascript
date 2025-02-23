/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
        let headers: Record<string, string> = {};

        for (const headerInterceptor of this.headerInterceptors) {
            headers = await headerInterceptor(headers);
        }

        if (request.headers) {
            for (const [name, value] of Object.entries(request.headers)) {
                headers[name] = value;
            }
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
            // the boundary needs to be set by the form data so we can not set the content type
            contentType = undefined;
            if (headers['Content-Type']) {
                delete headers['Content-Type'];
            }
            body = request.data;
        } else if (typeof request.data === 'string') {
            contentType = 'text/plain';
            body = request.data;
        } else {
            contentType = 'application/json';
            body = JSON.stringify(request.data);
        }

        if (!headers['Content-Type'] && contentType) {
            headers['Content-Type'] = contentType;
        }

        let url = request.url;
        if (request.params && Object.entries(request.params).length > 0) {
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
