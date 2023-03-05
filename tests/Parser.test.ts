
import {describe, expect, test} from '@jest/globals';
import {Parser} from '../src/Parser';
import {LocalDate, LocalDateTime, LocalTime} from "@js-joda/core";

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
});
