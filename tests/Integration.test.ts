
import {describe, expect, test} from '@jest/globals';
import Client from "./Generated/Client";
import {TestRequest} from "./Generated/TestRequest";
import {TestObject} from "./Generated/TestObject";
import {TestMapScalar} from "./Generated/TestMapScalar";
import {TestMapObject} from "./Generated/TestMapObject";

describe('integration', () => {
    test('client get all', async () => {
        const client = Client.build('my_token');

        const response = await client.getAll(8, 16, 'foobar');

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
        const response = await client.create(payload);

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
        const response = await client.update(1, payload);

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
        const response = await client.patch(1, payload);

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

        const response = await client.delete(1);

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
        arrayScalar: ['foo', 'bar'],
        arrayObject: [objectFoo, objectBar],
        mapScalar: mapScalar,
        mapObject: mapObject,
        object: objectFoo,
    };
}
