/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { Models } from '../../models';
import { StringHelpers } from '../../helpers/stringHelpers';
import * as Handlebars from 'handlebars';
import { Dictionary } from '../../helpers/dictionary';
import { IGeneralTemplates } from './templates';
import { FileSystemHelpers } from '../../helpers/fileSystemHelpers';

/*
 * Class for generating user-defined models via Handlebars template library
 */
export class ModelGenerator {
    public static generate(models: Array<Models.Model>, templates: IGeneralTemplates): Array<Models.GeneratedObject> {
        const generatedModels: Array<Models.GeneratedObject> = [];
        const template = Handlebars.compile(FileSystemHelpers.readFileSync(templates.model));

        // Registering all used Handlebars custom helpers
        this.registerGenerateModelImportsHelper(models);
        this.registerGenerateModelPropsHelper();
        this.registerGenerateModelConstructorHelper(models);

        models.forEach((model) => {
            generatedModels.push(new Models.GeneratedObject({ name: StringHelpers.lowercaseFirstLetter(model.name), value: template({ model }) }));
        });

        return generatedModels;
    }
    /* The method that defines and register Handlebars custom helper function for generating all Model imports */
    private static registerGenerateModelImportsHelper(models: Array<Models.Model>) {
        Handlebars.registerHelper('generateModelImports', function(context: Models.Model, options) {
            let importDictionary: Dictionary<string, { path: string; isPropType: boolean }> = Dictionary.empty();
            let imports: string = '';

            // Check if Model is derived class and imports his parent class and all required props
            if (!StringHelpers.isNullOrUndefinedOrEmpty(context.superType) && context.superType !== undefined) {
                importDictionary[context.superType] = { path: StringHelpers.lowercaseFirstLetter(context.superType), isPropType: false };

                let superTypeProps = ModelGenerator.getSuperTypeProps(models, context.superType);

                superTypeProps.forEach((prop: Models.Property) => {
                    if (prop.isRefModel) {
                        importDictionary[prop.type] = { path: StringHelpers.lowercaseFirstLetter(prop.type), isPropType: true };
                    }
                });
            }

            // Add all used Models in that specific Model
            context.properties.forEach((prop: Models.Property) => {
                if (prop.isRefModel) {
                    importDictionary[prop.type] = { path: StringHelpers.lowercaseFirstLetter(prop.type), isPropType: true };
                }
            });

            // Generates all imports
            Dictionary.foreach(importDictionary, (name, detail) => {
                imports += options.fn({ name: name, path: detail.path });
            });

            if (!StringHelpers.isNullOrUndefinedOrEmpty(imports)) {
                imports += '\n';
            }

            return imports;
        });
    }

    /* The method that defines and register Handlebars custom helper function for generating all Model props */
    private static registerGenerateModelPropsHelper() {
        Handlebars.registerHelper('generateModelProps', function(context: Array<Models.Property>, options) {
            let result = '';
            let sortedProps: Array<Models.Property> = [];
            let optionalProps: Array<Models.Property> = [];

            // Sorting props (at first required than optional)
            context.forEach((property: Models.Property) => {
                if (property.isRequired) {
                    sortedProps.push(property);
                } else {
                    optionalProps.push(property);
                }
            });

            sortedProps = sortedProps.concat(optionalProps);

            // Generating structure of Model props
            sortedProps.forEach((property: Models.Property) => {
                let type = ModelGenerator.getPropertyType(property);
                let name = property.name;

                if (!property.isRequired) {
                    name += '?';
                }

                result += options.fn({ name, type });
            });

            return result;
        });
    }

    /* The method that defines and register Handlebars custom helper function for generating constructor of Model */
    private static registerGenerateModelConstructorHelper(models: Array<Models.Model>) {
        Handlebars.registerHelper('generateModelConstructor', function(context: Models.Model, options) {
            let constructorParams: string = '';
            let constructorAssigns: Array<string> = [];
            let superConstructor: string = '';
            let superTypeProps: Array<Models.Property> = [];

            let optionalParams: string = '';
            let optionalAssigns: Array<string> = [];

            // Check if Model is derived class and get a reference to the parent class
            if (!StringHelpers.isNullOrUndefinedOrEmpty(context.superType) && context.superType !== undefined) {
                superTypeProps = ModelGenerator.getSuperTypeProps(models, context.superType);

                // Getting all props of parent class
                superTypeProps.forEach((prop: Models.Property) => {
                    superConstructor += `${prop.name}, `;
                });

                superConstructor = superConstructor.slice(0, -2);
            }

            // Generating all props of parent class
            superTypeProps.forEach((superProp: Models.Property) => {
                if (superProp.isRequired) {
                    constructorParams += `${superProp.name}: ${ModelGenerator.getPropertyType(superProp)}, `;
                } else {
                    optionalParams += `${superProp.name}?: ${ModelGenerator.getPropertyType(superProp)}, `;
                }
            });

            // Generating all props of specific Model
            context.properties.forEach((prop: Models.Property) => {
                if (prop.isRequired) {
                    constructorAssigns.push(prop.name);
                    constructorParams += `${prop.name}: ${ModelGenerator.getPropertyType(prop)}, `;
                } else {
                    optionalAssigns.push(prop.name);
                    optionalParams += `${prop.name}?: ${ModelGenerator.getPropertyType(prop)}, `;
                }
            });

            // Sort props (at first required then optional)
            constructorAssigns = constructorAssigns.concat(optionalAssigns);
            constructorParams += optionalParams;
            constructorParams = constructorParams.slice(0, -2);

            return options.fn({ constructorParams: constructorParams, constructorAssigns: constructorAssigns, superConstructor: superConstructor });
        });
    }

    /* Helper method for getting type of specific prop */
    public static getPropertyType(property: Models.Property): string {
        let type = '';

        if (property.isArray) {
            type = 'Array<';

            if (property.isEnum && property.enumValues !== undefined) {
                type += ModelGenerator.generateEnumValues(property.enumValues);
            } else {
                type += property.type;
            }

            type += '>';
        } else if (property.isEnum && property.enumValues !== undefined) {
            type = ModelGenerator.generateEnumValues(property.enumValues);
        } else {
            type = `${property.type}`;
        }

        return type;
    }

    /* Helper method for generating enum values structure */
    public static generateEnumValues(values: Array<string | null> | undefined): string {
        let result = '';

        if (values !== undefined) {
            values.forEach((value: string | null) => {
                if (value === null) {
                    result += 'null | ';
                } else {
                    result += `'${value}' | `;
                }
            });
        }

        return result.slice(0, -3);
    }

    /* Method for getting parent class props from all Models */
    private static getSuperTypeProps(models: Array<Models.Model>, superTypeName: string): Array<Models.Property> {
        let superTypeProps: Array<Models.Property> = [];

        models.forEach((model: Models.Model) => {
            if (model.name === superTypeName) {
                superTypeProps = model.properties;
            }
        });

        return superTypeProps;
    }
}
