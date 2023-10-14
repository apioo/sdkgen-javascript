/*
 * SDKgen is a powerful code generator to automatically build client SDKs for your REST API.
 * For the current version and information visit <https://sdkgen.app>
 *
 * Copyright (c) Christoph Kappestein <christoph.kappestein@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosInstance} from "axios";
import {Parser} from "./Parser";

export abstract class TagAbstract {
    protected httpClient: AxiosInstance
    protected parser: Parser

    constructor(httpClient: AxiosInstance, parser: Parser) {
        this.httpClient = httpClient;
        this.parser = parser;
    }
}
