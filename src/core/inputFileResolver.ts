/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { FileSystemHelpers } from '../helpers/fileSystemHelpers';
import { Models } from '../models';
import * as YAML from 'js-yaml';
import * as wadl2openapi from '@itentialopensource/api-spec-converter';

export enum BasicExtensions {
    json,
    yaml,
    wadl,
    xml,
    unknown,
}

/*
 * Class for resolving input file type and for parsing to raw objects.
 * There re 4 options: JSON and YAML for OpenAPI / WADL and XML for WADL
 */
export class InputFileResolver {
    public static async getRawApiData(path: string): Promise<Models.IRawApiData> {
        const extensionType = this.getBasicExtensionType(path);
        let rawApiData = undefined;

        try {
            rawApiData = await this.convertToObject(path, extensionType);
        } catch (error) {
            return Promise.reject('API documentation file is invalid or corrupted.');
        }

        if (rawApiData === undefined) return Promise.reject('API documentation file is invalid or corrupted.');

        if (rawApiData.openapi && rawApiData.openapi.startsWith('3')) {
            console.log('Found OpenAPI 3.');
            return Promise.resolve({ apiType: Models.ApiType.openApi, data: rawApiData });
        } else {
            console.log('Found WADL.');
            return Promise.resolve({ apiType: Models.ApiType.wadl, data: rawApiData.spec });
        }
    }

    /* Method for resolving input file extension */
    private static getBasicExtensionType(path: string): BasicExtensions {
        const extension = FileSystemHelpers.getFileExtension(path);

        switch (extension.toLowerCase()) {
            case 'json':
                return BasicExtensions.json;
            case 'yaml':
                return BasicExtensions.yaml;
            case 'wadl':
                return BasicExtensions.wadl;
            case 'xml':
                return BasicExtensions.xml;
            default:
                return BasicExtensions.unknown;
        }
    }

    /* Method for conversion from JSON / YAML / WADL to object */
    private static convertToObject(path: string, type: BasicExtensions): any {
        const rawData = FileSystemHelpers.readFileSync(path);

        switch (type) {
            case BasicExtensions.json:
                return JSON.parse(rawData);
            case BasicExtensions.yaml:
                return YAML.safeLoad(rawData, { json: true });
            case BasicExtensions.wadl:
            case BasicExtensions.xml:
                return wadl2openapi.convert({
                    from: 'wadl',
                    to: 'openapi_3',
                    source: path,
                });
            default:
                break;
        }
    }
}
