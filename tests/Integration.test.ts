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
import {ApiKey, HttpBasic, HttpBearer} from "../src";

describe('integration', () => {
    test('client get all', async () => {
        const client = Client.build('my_token');

        const response = await client.product().getAll(8, 16, 'foobar');

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('GET');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({count: '16', search: 'foobar', startIndex: '8'}));
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
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('POST');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
        expect(JSON.stringify(response.json)).toBe(JSON.stringify(payload));
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
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('PUT');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
        expect(JSON.stringify(response.json)).toBe(JSON.stringify(payload));
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
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('PATCH');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
        expect(JSON.stringify(response.json)).toBe(JSON.stringify(payload));
    });

    test('client delete', async () => {
        const client = Client.build('my_token');

        const response = await client.product().delete(1);

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('DELETE');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
        expect(response.json).toBe(null);
    });

    test('client binary', async () => {
        const client = Client.build('my_token');

        const payload = newArrayBuffer();

        const response = await client.product().binary(payload);

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('POST');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
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
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('POST');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
        expect(JSON.stringify(response.form)).toStrictEqual(JSON.stringify({foo: 'bar'}));
    });

    test('client json', async () => {
        const client = Client.build('my_token');

        const response = await client.product().json({string: 'bar'});

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('POST');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
        expect(response.json?.string).toBe('bar');
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
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('POST');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
        expect(JSON.stringify(response.files)).toBe(JSON.stringify({foo: 'foobar'}));
    });

    test('client text', async () => {
        const client = Client.build('my_token');

        const response = await client.product().text('foobar');

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer my_token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('POST');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
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
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('POST');
        expect(JSON.stringify(response.args)).toBe(JSON.stringify({}));
        expect(response.data).toBe('<foo>bar</foo>');
    });

    test('client basic auth', async () => {
        const client = new Client('http://127.0.0.1:8081', new HttpBasic('test', 'test123'), '0.1.0');

        const response = await client.product().getAll(8, 16, 'foobar');

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Basic dGVzdDp0ZXN0MTIz');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('GET');
    });

    test('client api key', async () => {
        const client = new Client('http://127.0.0.1:8081', new ApiKey('token', 'X-Api-Key', 'header'), '0.1.0');

        const response = await client.product().getAll(8, 16, 'foobar');

        // @ts-ignore
        expect(response.headers['X-Api-Key']).toBe('token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('GET');
    });

    test('client basic bearer', async () => {
        const client = new Client('http://127.0.0.1:8081', new HttpBearer('token'), '0.1.0');

        const response = await client.product().getAll(8, 16, 'foobar');

        // @ts-ignore
        expect(response.headers['Authorization']).toBe('Bearer token');
        // @ts-ignore
        expect(response.headers['Accept']).toBe('application/json');
        // @ts-ignore
        expect(response.headers['User-Agent']).toBe('SDKgen/0.1.0');
        expect(response.method).toBe('GET');
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
    mapScalar['bar'] = 'foo';
    mapScalar['foo'] = 'bar';

    const mapObject: TestMapObject = {};
    mapObject['bar'] = objectBar;
    mapObject['foo'] = objectFoo;

    return {
        arrayObject: [objectFoo, objectBar],
        arrayScalar: ['foo', 'bar'],
        bool: true,
        dateString: '2024-09-22',
        dateTimeString: '2024-09-22T10:09:00',
        float: 13.37,
        int: 1337,
        mapObject: mapObject,
        mapScalar: mapScalar,
        object: objectFoo,
        string: 'foobar',
        timeString: '10:09:00',
    };
}

function newArrayBuffer() {
    const data = Buffer.from('Zm9vYmFy', 'base64');
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
}
