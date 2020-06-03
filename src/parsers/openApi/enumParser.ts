/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { Models } from '../../models';
import { TypeHelpers } from './helpers/typeHelpers';

/*
 * Class for parsing user-defined enums in schemas
 */
export class EnumParser {
    public static parse(openApiSchemas: any): Array<Models.Enum> {
        const enums: Array<Models.Enum> = [];

        if (openApiSchemas !== undefined) {
            const modelsNames: Array<string> = Object.keys(openApiSchemas);

            modelsNames.forEach((modelName: string) => {
                if (openApiSchemas[modelName].enum !== undefined) {
                    let enumType = openApiSchemas[modelName].type;
                    let enumValues: Array<string | null> = [];

                    openApiSchemas[modelName].enum.forEach((element: any) => {
                        if (element === null) {
                            // Checks if enum schema contains a nullable parameter that must be specified by OpenAPI guidelines
                            if (openApiSchemas[modelName]?.nullable) {
                                enumValues.push(null);
                            }
                        } else {
                            enumValues.push(element.toString());
                        }
                    });

                    enums.push(new Models.Enum({ type: TypeHelpers.parseBasicType(enumType), name: modelName, enumValues: enumValues }));
                }
            });
        }

        return enums;
    }
}
