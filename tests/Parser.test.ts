/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {describe, expect, test} from '@jest/globals';
import {Parser} from '../src/Parser';
import {TestObject} from "./Generated/TestObject";

describe('parser', () => {
    test('url parsing', () => {
        const parser = new Parser("https://api.acme.com/");

        expect(parser.url("/foo/bar", {})).toBe("https://api.acme.com/foo/bar");
        expect(parser.url("/foo/:bar", {bar: "foo"})).toBe("https://api.acme.com/foo/foo");
        expect(parser.url("/foo/$bar<[0-9]+>", {bar: "foo"})).toBe("https://api.acme.com/foo/foo");
        expect(parser.url("/foo/$bar", {bar: "foo"})).toBe("https://api.acme.com/foo/foo");
        expect(parser.url("/foo/{bar}", {bar: "foo"})).toBe("https://api.acme.com/foo/foo");
        expect(parser.url("/foo/:bar/bar", {bar: "foo"})).toBe("https://api.acme.com/foo/foo/bar");
        expect(parser.url("/foo/$bar<[0-9]+>/bar", {bar: "foo"})).toBe("https://api.acme.com/foo/foo/bar");
        expect(parser.url("/foo/$bar/bar", {bar: "foo"})).toBe("https://api.acme.com/foo/foo/bar");
        expect(parser.url("/foo/{bar}/bar", {bar: "foo"})).toBe("https://api.acme.com/foo/foo/bar");

        expect(parser.url("/foo/:bar", {bar: null})).toBe("https://api.acme.com/foo/");
        expect(parser.url("/foo/:bar", {bar: 1337})).toBe("https://api.acme.com/foo/1337");
        expect(parser.url("/foo/:bar", {bar: 13.37})).toBe("https://api.acme.com/foo/13.37");
        expect(parser.url("/foo/:bar", {bar: true})).toBe("https://api.acme.com/foo/1");
        expect(parser.url("/foo/:bar", {bar: false})).toBe("https://api.acme.com/foo/0");
        expect(parser.url("/foo/:bar", {bar: "foo"})).toBe("https://api.acme.com/foo/foo");
    });

    test('query parsing', () => {
        const parser = new Parser("https://api.acme.com/");

        const test: TestObject = {
            name: "foo"
        };

        const parameters = {
            'null': null,
            'int': 1337,
            'float': 13.37,
            'true': true,
            'false': false,
            'string': 'foo',
            'args': test,
        };

        const result = parser.query(parameters, ['args']);

        expect(result['int']).toBe('1337');
        expect(result['float']).toBe('13.37');
        expect(result['true']).toBe('1');
        expect(result['false']).toBe('0');
        expect(result['string']).toBe('foo');
        expect(result['name']).toBe('foo');
    });
});
