/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class Parser {
    private readonly baseUrl: string;

    public constructor(baseUrl: string) {
        this.baseUrl = this.normalizeBaseUrl(baseUrl);
    }

    public url(path: string, parameters: Record<string, any>): string {
        return this.baseUrl + '/' + this.substituteParameters(path, parameters)
    }

    public query(parameters: Record<string, any>, structNames?: Array<string>): Record<string, string> {
        let result: Record<string, string> = {};
        for (const [name, value] of Object.entries(parameters)) {
            if (value === null || value === undefined) {
                continue;
            }

            if (structNames && structNames.includes(name)) {
                if (typeof value === 'object') {
                    result = {...result, ...this.query(value)};
                }
            } else {
                result[name] = this.toString(value);
            }
        }

        return result;
    }

    private substituteParameters(path: string, parameters: Record<string, any>): string {
        const parts = path.split('/');
        let result = [];

        for (let part of parts) {
            if (part === null || part === undefined || part === "") {
                continue;
            }

            let name: string|null = null;
            if (part.startsWith(':')) {
                name = part.substring(1);
            } else if (part.startsWith('$')) {
                const pos = part.indexOf('<');
                name = pos !== -1 ? part.substring(1, pos) : part.substring(1);
            } else if (part.startsWith('{') && part.endsWith('}')) {
                name = part.substring(1, part.length - 1);
            }

            if (name !== null && parameters.hasOwnProperty(name)) {
                part = this.toString(parameters[name]);
            }

            result.push(part);
        }

        return result.join('/');
    }

    private toString(value: any): string {
        if (typeof value === 'string') {
            return value;
        } else if (typeof value === 'number') {
            if (Number.isInteger(value)) {
                return '' + value;
            } else {
                return '' + value;
            }
        } else if (typeof value === 'boolean') {
            return value ? '1' : '0';
        } else if (value instanceof Date) {
            return value.toISOString();
        } else {
            return '';
        }
    }

    private normalizeBaseUrl(baseUrl: string): string {
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        return baseUrl;
    }
}
