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
import {Client} from "./Generated/Client";
import {TestRequest} from "./Generated/TestRequest";
import {TestObject} from "./Generated/TestObject";
import {TestMapScalar} from "./Generated/TestMapScalar";
import {TestMapObject} from "./Generated/TestMapObject";

import fs from 'node:fs';

describe('integration', () => {
    test('client get all', async () => {
        const client = Client.build('my_token');

        const response = await client.product().getAll(8, 16, 'foobar');

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('GET');
        expect(response.args).toStrictEqual({startIndex: '8', count: '16', search: 'foobar'});
        expect(response.json).toBe(null);
    });

    test('client create', async () => {
        const client = Client.build('my_token');

        const payload = newPayload();
        const response = await client.product().create(payload);

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('POST');
        expect(response.args).toStrictEqual({});
        expect(response.json).toStrictEqual(payload);
    });

    test('client update', async () => {
        const client = Client.build('my_token');

        const payload = newPayload();
        const response = await client.product().update(1, payload);

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('PUT');
        expect(response.args).toStrictEqual({});
        expect(response.json).toStrictEqual(payload);
    });

    test('client patch', async () => {
        const client = Client.build('my_token');

        const payload = newPayload();
        const response = await client.product().patch(1, payload);

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('PATCH');
        expect(response.args).toStrictEqual({});
        expect(response.json).toStrictEqual(payload);
    });

    test('client delete', async () => {
        const client = Client.build('my_token');

        const response = await client.product().delete(1);

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('DELETE');
        expect(response.args).toStrictEqual({});
        expect(response.json).toBe(null);
    });

    test('client binary', async () => {
        const client = Client.build('my_token');

        const payload = Buffer.from('Zm9vYmFy', 'base64');

        const response = await client.product().binary(payload);

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('POST');
        expect(response.args).toStrictEqual({});
        expect(response.data).toBe('foobar');
    });

    test('client form', async () => {
        const client = Client.build('my_token');

        const payload = new URLSearchParams({foo: 'bar'});

        const response = await client.product().form(payload);

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('POST');
        expect(response.args).toStrictEqual({});
        expect(response.form).toStrictEqual({foo: 'bar'});
    });

    test('client json', async () => {
        const client = Client.build('my_token');

        const response = await client.product().json({foo: 'bar'});

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('POST');
        expect(response.args).toStrictEqual({});
        expect(response.json).toStrictEqual({foo: 'bar'});
    });

    test('client multipart', async () => {
        const client = Client.build('my_token');

        const payload = new FormData();
        payload.append('foo', new Blob([Buffer.from('Zm9vYmFy', 'base64')]));

        const response = await client.product().multipart(payload);

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('POST');
        expect(response.args).toStrictEqual({});
        expect(response.files).toStrictEqual({foo: 'foobar'});
    });

    test('client text', async () => {
        const client = Client.build('my_token');

        const response = await client.product().text('foobar');

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('POST');
        expect(response.args).toStrictEqual({});
        expect(response.data).toBe('foobar');
    });

    test('client xml', async () => {
        const client = Client.build('my_token');

        const response = await client.product().xml('<foo>bar</foo>');

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen Client v1.0');
        expect(response.method).toBe('POST');
        expect(response.args).toStrictEqual({});
        expect(response.data).toBe('<foo>bar</foo>');
    });
});

function newPayload(): TestRequest
{
    const objectFoo: TestObject = {
        id: 1,
        name: 'foo',
    };

    const objectBar: TestObject = {
        id: 2,
        name: 'bar',
    };

    const mapScalar: TestMapScalar = {};
    mapScalar['foo'] = 'bar';
    mapScalar['bar'] = 'foo';

    const mapObject: TestMapObject = {};
    mapObject['foo'] = objectFoo;
    mapObject['bar'] = objectBar;

    return {
        int: 1337,
        float: 13.37,
        string: 'foobar',
        bool: true,
        dateString: '2024-09-22',
        dateTimeString: '2024-09-22T10:09:00',
        timeString: '10:09:00',
        arrayScalar: ['foo', 'bar'],
        arrayObject: [objectFoo, objectBar],
        mapScalar: mapScalar,
        mapObject: mapObject,
        object: objectFoo,
    };
}
