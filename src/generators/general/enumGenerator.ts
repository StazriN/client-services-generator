/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { Models } from '../../models';
import * as Handlebars from 'handlebars';
import { IGeneralTemplates } from './templates';
import { FileSystemHelpers } from '../../helpers/fileSystemHelpers';
import { StringHelpers } from '../../helpers/stringHelpers';

/*
 * Class for generating user-defined enums via Handlebars template library
 */
export class EnumGenerator {
    public static generate(enums: Array<Models.Enum>, templates: IGeneralTemplates): Array<Models.GeneratedObject> {
        const generatedEnums: Array<Models.GeneratedObject> = [];
        const template = Handlebars.compile(FileSystemHelpers.readFileSync(templates.enum));

        this.registerGenerateEnumValuesHelper();

        enums.forEach((element: Models.Enum) => {
            generatedEnums.push(
                new Models.GeneratedObject({ name: StringHelpers.lowercaseFirstLetter(element.name), value: template({ enum: element }) }),
            );
        });

        return generatedEnums;
    }

    /* The method that defines and register Handlebars custom helper function */
    private static registerGenerateEnumValuesHelper(): void {
        Handlebars.registerHelper('generateEnumValues', function(context: Models.Enum, options) {
            let result: string = '';

            context.enumValues.forEach((value: string | null) => {
                if (value !== null) {
                    result += options.fn({ value });
                }
            });

            return result;
        });
    }
}
