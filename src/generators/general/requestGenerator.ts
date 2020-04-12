import { Models } from '../../models';
import * as Handlebars from 'handlebars';
import { Dictionary } from '../../helpers/dictionary';
import { StringHelpers } from '../../helpers/stringHelpers';
import { IGeneralTemplates, IFrameworkTemplates } from './templates';
import { FileSystemHelpers } from '../../helpers/fileSystemHelpers';
import { ModelGenerator } from './modelGenerator';

/*
 * Class for generating all user-defined request in API documentation via Handlebars template library
 */
export class RequestGenerator {
    public static generate(
        apiData: Models.ApiData,
        requestBodies: Dictionary<string, Models.RequestObject>,
        generalTemplates: IGeneralTemplates,
        frameworkTemplates: IFrameworkTemplates,
    ): Array<Models.GeneratedObject> {
        const generatedRequests: Array<Models.GeneratedObject> = [];
        // Loading all used templates
        const importTemplate = Handlebars.compile(FileSystemHelpers.readFileSync(generalTemplates.requestImport));
        const methodTemplate = Handlebars.compile(FileSystemHelpers.readFileSync(frameworkTemplates.requestMethod));
        const classTemplate = Handlebars.compile(FileSystemHelpers.readFileSync(frameworkTemplates.requestClass));

        // The dictionary that will contain all requests
        const requests: Dictionary<string, { imports: Dictionary<string, string>; methods: Array<string> }> = Dictionary.empty();

        // Registering all used Handlebars custom helpers
        this.registerGetMethodParamsHelper(requestBodies);
        this.registerGetResponseTypeHelper();
        this.registerCheckForQueryHelper();
        this.registerGenerateRequiredParametersHelper();
        this.registerGenerateParametersCheckHelper();
        this.registerGenerateRequestPathHelper();

        apiData.paths.forEach((path: Models.Path) => {
            let pathCoreName: string = this.getRequestCoreName(path.name);

            // Setting default state for new request path
            if (requests[pathCoreName] === undefined) {
                requests[pathCoreName] = { imports: Dictionary.empty(), methods: [] };
            }

            path.methods.forEach((method: Models.Method) => {
                // Array for all imports used in request class
                let imports: Array<string> = this.getAllImports(method, requestBodies);

                imports.forEach((name: string) => {
                    requests[pathCoreName].imports[name] = StringHelpers.lowercaseFirstLetter(name);
                });

                requests[pathCoreName].methods.push(methodTemplate({ method: method, apiName: apiData.title, path: path }));
            });
        });

        // Generating all request classes with imports and request methods
        Dictionary.foreach(requests, (key, value) => {
            let requestClass: string = '';
            let imports: string = importTemplate({ apiName: apiData.title, imports: value.imports });

            requestClass = classTemplate({ name: `${StringHelpers.capitalizeFirstLetter(key)}Requests`, imports: imports, methods: value.methods });

            let generatedRequest: Models.GeneratedObject = new Models.GeneratedObject({ name: `${key}Requests`, value: requestClass });

            generatedRequests.push(generatedRequest);
        });

        return generatedRequests;
    }

    /* The method that defines and register Handlebars custom helper function for generating all parameters of request method */
    private static registerGetMethodParamsHelper(requestBodies: Dictionary<string, Models.RequestObject>) {
        Handlebars.registerHelper('getMethodParams', function(method: Models.Method) {
            let methodParams = '';

            let sortedParams: Array<Models.Parameter> = [];
            let optionalParams: Array<Models.Parameter> = [];

            // Check if method used request body
            if (method.requestBody !== undefined) {
                let requestBody = method.requestBody;
                if (requestBody.inRequestBodies) {
                    requestBody = requestBodies[method.requestBody.type[0]];
                }

                methodParams += `requestData: ${RequestGenerator.getRequestTypes(requestBody)}, `;
            }

            // Sorting parameters (at first required then optional)
            if (method.parameters !== undefined) {
                method.parameters.forEach((param: Models.Parameter) => {
                    if (param.isRequired) {
                        sortedParams.push(param);
                    } else {
                        optionalParams.push(param);
                    }
                });
            }

            sortedParams = sortedParams.concat(optionalParams);

            // Generating request method parameters structure
            if (method.parameters !== undefined) {
                sortedParams.forEach((param: Models.Parameter) => {
                    methodParams += RequestGenerator.getParamNameAndType(param);
                });
            }

            return methodParams.slice(0, -2);
        });
    }

    /* The method that defines and register Handlebars custom helper function for getting response type of request method */
    private static registerGetResponseTypeHelper() {
        Handlebars.registerHelper('getResponseType', function(response: Models.RequestObject) {
            return `${RequestGenerator.getRequestTypes(response)}`;
        });
    }

    /* The method that defines and register Handlebars custom helper function for generating control block if method contains query parameters  */
    private static registerCheckForQueryHelper() {
        Handlebars.registerHelper('checkForQuery', function(context: Models.Method, options) {
            let containsQuery: boolean = false;
            let requiredParameters: string = '';

            // Check if any parameter location is query
            context.parameters?.forEach((parameter: Models.Parameter) => {
                if (parameter.location === Models.ParameterLocation.query) {
                    containsQuery = true;

                    if (parameter.isRequired) {
                        requiredParameters += '`' + parameter.name + '=${' + parameter.name + '}`, ';
                    }
                }
            });

            //  If method contains query parameters generate control block
            if (containsQuery) {
                requiredParameters = requiredParameters.slice(0, -2);
                return options.fn({ method: context, requiredParameters: requiredParameters });
            }
        });
    }

    /* The method that defines and register Handlebars custom helper function for generating all required query parameters */
    private static registerGenerateRequiredParametersHelper() {
        Handlebars.registerHelper('generateRequiredParameters', function(context: Models.Method, options) {
            let result: string = '';

            context.parameters?.forEach((parameter: Models.Parameter) => {
                if (parameter.isRequired && parameter.location === Models.ParameterLocation.query) {
                    result += options.fn({ parameter: parameter.name });
                }
            });

            return result;
        });
    }

    /* The method that defines and register Handlebars custom helper function for generating check for optional query parameters */
    private static registerGenerateParametersCheckHelper() {
        Handlebars.registerHelper('generateParametersCheck', function(context: Models.Method, options) {
            let result: string = '';

            context.parameters?.forEach((parameter: Models.Parameter) => {
                if (!parameter.isRequired && parameter.location === Models.ParameterLocation.query) {
                    result += options.fn({ parameter: parameter.name });
                }
            });

            return result;
        });
    }

    /* The method that defines and register Handlebars custom helper function for generating request path with parameters */
    private static registerGenerateRequestPathHelper() {
        Handlebars.registerHelper('generateRequestPath', function(path: Models.Path, method: Models.Method) {
            let pathName: string = path.name;

            method.parameters?.forEach((parameter: Models.Parameter) => {
                if (parameter.location === Models.ParameterLocation.path) {
                    let index = pathName.indexOf(`{${parameter.name}}`);

                    if (index !== -1) {
                        pathName = pathName.slice(0, index) + '$' + pathName.slice(index);
                    }
                }
            });

            return pathName;
        });
    }

    /* Helper method for getting request body or response type */
    private static getRequestTypes(body: Models.RequestObject): string {
        let result: string = '';
        let types: string = '';
        let hasMultipleTypes: boolean = body.type.length > 1;

        // Generate multiple types structure if body has multiple types
        if (hasMultipleTypes) {
            body.type.forEach((type: string) => {
                types += `${type} | `;
            });

            types = types.slice(0, -3);
        } else {
            types += body.type[0];
        }

        if (body.isArray) {
            result += 'Array<';

            if (body.isEnum && body.enumValues !== undefined) {
                result += ModelGenerator.generateEnumValues(body.enumValues);
                if (hasMultipleTypes) result += ' | ' + types;
            } else {
                result += types;
            }

            result += '>';
        } else if (body.isEnum && body.enumValues !== undefined) {
            result += ModelGenerator.generateEnumValues(body.enumValues);
            if (hasMultipleTypes) result += ' | ' + types;
        } else {
            result += types;
        }

        return result;
    }

    /* Helper method for getting query parameter name and type */
    private static getParamNameAndType(param: Models.Parameter): string {
        let result: string = '';

        // Check if parameter is required
        result += `${param.name}${param.isRequired ? '' : '?'}: `;

        if (param.schema.isArray) {
            result += 'Array<';

            if (param.schema.isEnum && param.schema.enumValues !== undefined) {
                result += ModelGenerator.generateEnumValues(param.schema.enumValues);
            } else {
                result += param.schema.type;
            }

            result += '>';
        } else if (param.schema.isEnum && param.schema.enumValues !== undefined) {
            result += ModelGenerator.generateEnumValues(param.schema.enumValues);
        } else {
            result += param.schema.type;
        }

        result += ', ';
        return result;
    }

    /* Helper method for getting base name of request path */
    private static getRequestCoreName(input: string): string {
        let index = input.indexOf('/', 1);

        if (index === -1) {
            return input.substring(1);
        } else {
            return input.substring(1, index);
        }
    }

    /* Helper method for getting all imports used in request class */
    private static getAllImports(method: Models.Method, requestBodies: Dictionary<string, Models.RequestObject>): Array<string> {
        const imports: Array<string> = [];

        // Check if request body structure is defined in request bodies section
        if (method.requestBody?.inRequestBodies) {
            let requestBody = requestBodies[method.requestBody.type[0]];

            if (requestBody.isRefModel) {
                requestBody.type.forEach((type: string) => {
                    if (type !== 'any') {
                        imports.push(type);
                    }
                });
            }
        }

        // Check if request body type is user-defined model
        if (method.requestBody?.isRefModel) {
            method.requestBody.type.forEach((type: string) => {
                if (type !== 'any') {
                    imports.push(type);
                }
            });
        }

        // Check if response type is user-defined model
        if (method.response.isRefModel) {
            method.response.type.forEach((type: string) => {
                if (type !== 'any') {
                    imports.push(type);
                }
            });
        }

        return imports;
    }
}
