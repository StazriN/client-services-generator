/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { ModelParser } from './modelParser';
import { PathParser } from './pathParser';
import { Models } from '../../models';
import { RequestBodyParser } from './requestBodyParser';
import { EnumParser } from './enumParser';
import { ServerInfoParser } from './serverInfoParser';

/*
 * That class sequentially parse all parts of OpenAPI documentation
 */
export class OpenApiParser {
    public static parse(apiDoc: any): Models.Application {
        console.log('Parsing API documentation.');

        const serverUrls = ServerInfoParser.parseUrl(apiDoc.servers);
        const title = ServerInfoParser.parseTitle(apiDoc.info);
        const models = ModelParser.parse(apiDoc.components?.schemas);
        const enums = EnumParser.parse(apiDoc.components?.schemas);
        const requestBodies = RequestBodyParser.parseMultiple(apiDoc.components?.requestBodies);
        const paths = PathParser.parse(apiDoc.paths);

        return new Models.Application({ api: new Models.ApiData({ serverUrls, title, paths }), models, enums, requestBodies });
    }
}
