/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { StringHelpers } from '../../helpers/stringHelpers';

/*
 * Class for parsing basic parts of OpenAPI (base URLs and name of API)
 */
export class ServerInfoParser {
    public static parseUrl(openApiServers: Array<any>): Array<string> {
        const servers: Array<string> = [];

        openApiServers.forEach((element: any) => {
            servers.push(element.url);
        });

        return servers;
    }

    public static parseTitle(openApiInfo: any): string {
        let title: string = 'api';

        if (!StringHelpers.isNullOrUndefinedOrEmpty(openApiInfo.title)) {
            title = StringHelpers.removeAllWhiteSpaces(openApiInfo.title);
        }

        return title;
    }
}
