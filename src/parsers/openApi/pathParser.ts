import { Models } from '../../models';
import { StringHelpers } from '../../helpers/stringHelpers';
import { RequestBodyParser } from './requestBodyParser';
import { TypeHelpers } from './helpers/typeHelpers';

/*
 * Class for parsing all paths (requests) in API documentation
 */
export class PathParser {
    public static parse(openApiPaths: any): Array<Models.Path> {
        const paths: Array<Models.Path> = [];

        if (openApiPaths !== undefined) {
            const pathsNames: Array<string> = Object.keys(openApiPaths);

            pathsNames.forEach((pathName) => {
                paths.push(new Models.Path({ name: pathName, methods: this.parsePathMethods(openApiPaths[pathName]) }));
            });
        }

        return paths;
    }

    /* Parsing all methods (GET, POST, PUT, PATCH, DELETE) for specific path */
    private static parsePathMethods(openApiPath: any): Array<Models.Method> {
        const methods: Array<Models.Method> = [];
        const methodsNames: Array<string> = Object.keys(openApiPath);

        methodsNames.forEach((methodName) => {
            let methodType = this.getMethodType(methodName);
            let methodId: string = openApiPath[methodName].operationId;
            let methodParameters: Array<Models.Parameter> | undefined = undefined;
            let methodRequestBody: Models.RequestObject | undefined = undefined;
            let methodResponse: Models.RequestObject;

            // If method has undefined type or name (id) is ignored
            if (methodType === undefined || StringHelpers.isNullOrUndefinedOrEmpty(methodId)) {
                return;
            }

            // Check if method has any parameters
            if (openApiPath[methodName].parameters !== undefined) {
                methodParameters = this.parseMethodParameters(openApiPath[methodName].parameters);
            }

            // Check if method has request body
            if (openApiPath[methodName].requestBody !== undefined) {
                methodRequestBody = RequestBodyParser.parse(openApiPath[methodName].requestBody);
            }

            methodResponse = this.parseResponses(openApiPath[methodName].responses);

            methods.push(
                new Models.Method({
                    type: methodType,
                    name: methodId,
                    description: openApiPath[methodName].description,
                    parameters: methodParameters,
                    requestBody: methodRequestBody,
                    response: methodResponse,
                }),
            );
        });

        return methods;
    }

    /* Helper method for parsing method type */
    private static getMethodType(type: string): Models.MethodType | undefined {
        switch (type) {
            case 'get':
                return Models.MethodType.GET;
            case 'post':
                return Models.MethodType.POST;
            case 'put':
                return Models.MethodType.PUT;
            case 'patch':
                return Models.MethodType.PATCH;
            case 'delete':
                return Models.MethodType.DELETE;
            default:
                return undefined;
        }
    }

    /* Method for parsing method parameters */
    private static parseMethodParameters(openApiMethodParameters: Array<any>): Array<Models.Parameter> {
        const methodParameters: Array<Models.Parameter> = [];

        openApiMethodParameters.forEach((parameter: any) => {
            let parameterName: string = parameter.name;
            let parameterLocation = this.getParameterLocation(parameter.in);

            // If parameter has undefined name or location is ignored
            if (StringHelpers.isNullOrUndefinedOrEmpty(parameterName) || parameterLocation === undefined) {
                return;
            }

            let parameterSchema: Models.Schema = this.getParameterSchema(parameter.schema);

            methodParameters.push(
                new Models.Parameter({
                    name: parameterName,
                    location: parameterLocation,
                    schema: parameterSchema,
                    isRequired: parameter.required,
                    description: parameter.description,
                }),
            );
        });

        return methodParameters;
    }

    /* Helper method for parsing parameter location */
    private static getParameterLocation(location: string): Models.ParameterLocation | undefined {
        switch (location) {
            case 'query':
                return Models.ParameterLocation.query;
            case 'path':
                return Models.ParameterLocation.path;
            case 'header':
                return Models.ParameterLocation.header;
            case 'cookie':
                return Models.ParameterLocation.cookie;
            default:
                return undefined;
        }
    }

    /* Method for parsing parameter structure */
    private static getParameterSchema(openApiParameterSchema: any): Models.Schema {
        let schemaType: Models.BasicTypes = TypeHelpers.parseBasicType(openApiParameterSchema.type);
        let isArray: boolean = schemaType === Models.BasicTypes.array;
        let isEnum: boolean = false;
        let enumValues: Array<string | null> = [];
        let subSchema: Models.Schema = { type: Models.BasicTypes.any };

        // If paramter type is array getting type of his elements
        if (isArray) {
            subSchema = this.getParameterSchema(openApiParameterSchema.items);

            return new Models.Schema({
                type: subSchema.type,
                format: subSchema.format,
                isArray: isArray,
                isEnum: subSchema.isEnum,
                enumValues: subSchema.enumValues,
            });
        }

        if (openApiParameterSchema.enum !== undefined) {
            isEnum = true;

            openApiParameterSchema.enum.forEach((element: any) => {
                if (element === null) {
                    if (openApiParameterSchema?.nullable) {
                        enumValues.push(null);
                    }
                } else {
                    enumValues.push(element.toString());
                }
            });
        }

        return new Models.Schema({
            type: schemaType,
            format: openApiParameterSchema.format,
            isArray: isArray,
            isEnum: isEnum,
            enumValues: enumValues,
        });
    }

    /* Method for parsing structure of method response */
    private static parseResponses(openApiResponses: any): Models.RequestObject {
        // Default response type is void
        const voidResponseType = new Models.RequestObject({ type: ['void'] });

        // If method responses are undefined return void type
        if (openApiResponses === undefined) {
            return voidResponseType;
        }

        // Check if method contains correct response
        if (openApiResponses['200'] === undefined || !this.checkCorrectContentType(openApiResponses['200'])) {
            if (openApiResponses['201'] === undefined || !this.checkCorrectContentType(openApiResponses['201'])) {
                if (openApiResponses.default === undefined || !this.checkCorrectContentType(openApiResponses.default)) {
                    return voidResponseType;
                }
                return RequestBodyParser.parse(openApiResponses.default);
            }
            return RequestBodyParser.parse(openApiResponses['201']);
        }
        return RequestBodyParser.parse(openApiResponses['200']);
    }

    /* Helper method for checking if response type has correct content */
    private static checkCorrectContentType(openApiResponse: any): boolean {
        if (openApiResponse.content === undefined || openApiResponse.content['application/json'] === undefined) {
            return false;
        }

        return true;
    }
}
