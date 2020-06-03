/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { Models } from '../../models';
import { EnumParser } from './enumParser';
import { TypeHelpers } from './helpers/typeHelpers';

/*
 * Class for parsing user-defined models in schemas
 */
export class ModelParser {
    public static parse(openApiSchemas: any): Array<Models.Model> {
        const models: Array<Models.Model> = [];

        // Check if there are any user-defined models
        if (openApiSchemas !== undefined) {
            const modelsNames: Array<string> = Object.keys(openApiSchemas);

            modelsNames.forEach((modelName: string) => {
                if (openApiSchemas[modelName].enum !== undefined) {
                    return;
                }

                // Check for class inheritance
                if (openApiSchemas[modelName].allOf !== undefined) {
                    let allOfArray = openApiSchemas[modelName].allOf;
                    let superType = '';

                    allOfArray.forEach((element: any) => {
                        if (element.$ref !== undefined) {
                            superType = TypeHelpers.refObjectName(element.$ref);
                        }
                    });

                    allOfArray.forEach((element: any) => {
                        if (element.properties !== undefined) {
                            models.push(this.parseModel(element, modelName, superType));
                        }
                    });
                } else {
                    models.push(this.parseModel(openApiSchemas[modelName], modelName));
                }
            });
        }

        return models;
    }

    /* Method that parse specific model from schemas */
    private static parseModel(openApiSchema: any, name: string, superType: string = ''): Models.Model {
        // Array of required props names
        const requiredProps: Array<string> = openApiSchema.required !== undefined ? openApiSchema.required : [];
        // Array of all props names
        const propertiesNames: Array<string> = openApiSchema.properties !== undefined ? Object.keys(openApiSchema.properties) : [];
        const properties: Array<Models.Property> = [];

        propertiesNames.forEach((propName: string) => {
            let isRequired = requiredProps.includes(propName);
            properties.push(this.parseProp(openApiSchema.properties, propName, isRequired));
        });

        return new Models.Model({ name, properties, superType });
    }

    /* Method that parse specific prop of the model */
    private static parseProp(openApiProps: any, name: string, isRequired: boolean = false): Models.Property {
        // Check if prop type is the user-defined model
        if (openApiProps[name].$ref === undefined) {
            if (openApiProps[name].type?.toLowerCase() === 'array') {
                return this.parseArrayProp(openApiProps[name], name, isRequired);
            } else if (openApiProps[name].enum !== undefined) {
                return this.parseEnumProp(openApiProps, name, isRequired);
            }

            return new Models.Property({
                name: name,
                type: TypeHelpers.parseBasicType(openApiProps[name].type),
                isRequired: isRequired,
                format: openApiProps[name].format,
                example: openApiProps[name].example,
            });
        } else {
            return new Models.Property({
                name: name,
                type: TypeHelpers.refObjectName(openApiProps[name].$ref),
                isRequired: isRequired,
                isRefModel: true,
            });
        }
    }

    /* Method that parses prop if has enum type */
    private static parseEnumProp(openApiProps: any, name: string, isRequired: boolean): Models.Property {
        let enumModel: Models.Enum = EnumParser.parse(openApiProps)[0];

        return new Models.Property({
            name: name,
            type: enumModel.type,
            isRequired: isRequired,
            isEnum: true,
            enumValues: enumModel.enumValues,
            format: openApiProps[name].format,
            example: openApiProps[name].example,
        });
    }

    /* Method that parses prop if has array type */
    private static parseArrayProp(openApiProp: any, name: string, isRequired: boolean): Models.Property {
        let arrayItem = openApiProp.items;

        return new Models.Property({
            name: name,
            type: arrayItem.type === undefined ? TypeHelpers.refObjectName(arrayItem.$ref) : TypeHelpers.parseBasicType(arrayItem.type),
            isRequired: isRequired,
            isRefModel: arrayItem.type === undefined,
            isArray: true,
            format: openApiProp.format,
            example: openApiProp.example,
        });
    }
}
