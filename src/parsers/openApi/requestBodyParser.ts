/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { Dictionary } from '../../helpers/dictionary';
import { Models } from '../../models';
import { TypeHelpers } from './helpers/typeHelpers';
import { EnumParser } from './enumParser';

/*
 * Class for parsing all requestBodies in API documentation
 */
export class RequestBodyParser {
    /* Method for parsing specified request body or response (has very similar structure) */
    public static parse(openApiRequestBody: any): Models.RequestObject {
        // Default type is set as 'any'
        var defaultRequestObject = new Models.RequestObject({
            type: ['any'],
            description: openApiRequestBody.description,
            isRequired: openApiRequestBody.required,
        });

        // Check if whole request body is not user-defined model
        if (openApiRequestBody.$ref === undefined) {
            // If no contains json structure
            if (openApiRequestBody.content['application/json'] === undefined) {
                return defaultRequestObject;
            }

            // Check if request body type is array
            if (openApiRequestBody.content['application/json'].schema.type?.toLowerCase() === 'array') {
                return this.parseArray(openApiRequestBody);
                // Check if request body type is one of basic types
            } else if (openApiRequestBody.content['application/json'].schema.type !== undefined) {
                return new Models.RequestObject({
                    type: [TypeHelpers.parseBasicType(openApiRequestBody.content['application/json'].schema.type)],
                    description: openApiRequestBody.description,
                    isRequired: openApiRequestBody.required,
                });
                // Check if request body type is user-defined model
            } else if (openApiRequestBody.content['application/json'].schema.$ref !== undefined) {
                let refModel = TypeHelpers.refObjectName(openApiRequestBody.content['application/json'].schema.$ref);

                return new Models.RequestObject({
                    type: [refModel],
                    isRefModel: true,
                    description: openApiRequestBody.description,
                    isRequired: openApiRequestBody.required,
                });
                // Check if request body has multiple types
            } else if (openApiRequestBody.content['application/json'].schema.oneOf !== undefined) {
                let types: Array<string> = [];

                openApiRequestBody.content['application/json'].schema.oneOf.forEach((element: any) => {
                    types.push(TypeHelpers.refObjectName(element.$ref));
                });

                return new Models.RequestObject({
                    type: types,
                    isRefModel: true,
                    description: openApiRequestBody.description,
                    isRequired: openApiRequestBody.required,
                });
                // Check if request body has multiple types with 'any' type
            } else if (openApiRequestBody.content['application/json'].schema.anyOf !== undefined) {
                let types: Array<string> = [];

                openApiRequestBody.content['application/json'].schema.anyOf.forEach((element: any) => {
                    types.push(TypeHelpers.refObjectName(element.$ref));
                });

                types.push('any');

                return new Models.RequestObject({
                    type: types,
                    isRefModel: true,
                    description: openApiRequestBody.description,
                    isRequired: openApiRequestBody.required,
                });
            } else {
                return defaultRequestObject;
            }
            // If whole request body is user-defined model get this type
        } else {
            let refPath = openApiRequestBody.$ref;

            return new Models.RequestObject({
                type: [TypeHelpers.refObjectName(refPath)],
                isRefModel: !TypeHelpers.refContainsRequestBodies(refPath),
                description: openApiRequestBody.description,
                isRequired: openApiRequestBody.required,
                inRequestBodies: TypeHelpers.refContainsRequestBodies(refPath),
            });
        }
    }

    /* Method for parsing array of request bodies  */
    public static parseMultiple(openApiRequestBodies: any): Dictionary<string, Models.RequestObject> {
        const requestBodies: Dictionary<string, Models.RequestObject> = Dictionary.empty();

        if (openApiRequestBodies !== undefined) {
            const requestBodiesNames: Array<string> = Object.keys(openApiRequestBodies);

            requestBodiesNames.forEach((requestBodyName: string) => {
                requestBodies[requestBodyName] = this.parse(openApiRequestBodies[requestBodyName]);
            });
        }

        return requestBodies;
    }

    /* Helper method for parsing request body if type is array */
    private static parseArray(openApiRequestBody: any): Models.RequestObject {
        const items = openApiRequestBody.content['application/json'].schema.items;

        // Check if array type is user-defined model
        if (items.$ref !== undefined) {
            let refModel = TypeHelpers.refObjectName(items.$ref);

            return new Models.RequestObject({
                type: [refModel],
                isRefModel: true,
                isArray: true,
                description: openApiRequestBody.description,
                isRequired: openApiRequestBody.required,
            });
            // Check if array type is user-defined enum
        } else if (items.enum !== undefined) {
            let enumModel: Models.Enum = EnumParser.parse(openApiRequestBody.content['application/json'].schema)[0];

            return new Models.RequestObject({
                type: [enumModel.type],
                isArray: true,
                isEnum: true,
                enumValues: enumModel.enumValues,
                description: openApiRequestBody.description,
                isRequired: openApiRequestBody.required,
            });
            // If array type is one of basic types
        } else {
            return new Models.RequestObject({
                type: [TypeHelpers.parseBasicType(items.type)],
                isArray: true,
                description: openApiRequestBody.description,
                isRequired: openApiRequestBody.required,
            });
        }
    }
}
