import { Models } from '../../models';
import * as Handlebars from 'handlebars';
import { IFrameworkTemplates } from './templates';
import { FileSystemHelpers } from '../../helpers/fileSystemHelpers';

/*
 * Class for generating service base via Handlebars template library
 */
export class ServiceBaseGenerator {
    public static generate(apiData: Models.ApiData, templates: IFrameworkTemplates): string {
        let serviceBase: string = '';
        const template = Handlebars.compile(FileSystemHelpers.readFileSync(templates.serviceBase));

        serviceBase = template({ apiData });

        return serviceBase;
    }
}
