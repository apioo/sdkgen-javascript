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
import {LocalDate, LocalDateTime, LocalTime} from "@js-joda/core";
import {TestObject} from "./Generated/TestObject";
import {parse} from "ts-jest";

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
        expect(parser.url("/foo/:bar", {bar: LocalDate.of(2023, 2, 21)})).toBe("https://api.acme.com/foo/2023-02-21");
        expect(parser.url("/foo/:bar", {bar: LocalDateTime.of(2023, 2, 21, 19, 19, 0)})).toBe("https://api.acme.com/foo/2023-02-21T19:19:00Z");
        expect(parser.url("/foo/:bar", {bar: LocalTime.of(19, 19, 0)})).toBe("https://api.acme.com/foo/19:19:00");
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
            'date': LocalDate.of(2023, 2, 21),
            'datetime': LocalDateTime.of(2023, 2, 21, 19, 19, 0),
            'time': LocalTime.of(19, 19, 0),
            'args': test,
        };

        const result = parser.query(parameters, ['args']);

        expect(result['int']).toBe('1337');
        expect(result['float']).toBe('13.37');
        expect(result['true']).toBe('1');
        expect(result['false']).toBe('0');
        expect(result['string']).toBe('foo');
        expect(result['date']).toBe('2023-02-21');
        expect(result['datetime']).toBe('2023-02-21T19:19:00Z');
        expect(result['time']).toBe('19:19:00');
        expect(result['name']).toBe('foo');
    });
});
