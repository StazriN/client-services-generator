/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { Models } from '../../models';
import { GeneralGenerators } from '../general';
import * as path from 'path';

/*
 * Class for generating all parts of services (models, service base, requests)
 */
export class AngularServiceGenerator {
    public static generate(applicationData: Models.Application): Models.GeneratedData {
        console.log('Generating services for Angular framework.');
        const generatedServiceBase: string = GeneralGenerators.ServiceBaseGenerator.generate(applicationData.api, this.AngularTemplates);
        const generatedModels: Array<Models.GeneratedObject> = GeneralGenerators.ModelGenerator.generate(
            applicationData.models,
            GeneralGenerators.GeneralTemplates,
        );
        const generatedEnums: Array<Models.GeneratedObject> = GeneralGenerators.EnumGenerator.generate(
            applicationData.enums,
            GeneralGenerators.GeneralTemplates,
        );
        const generatedRequests: Array<Models.GeneratedObject> = GeneralGenerators.RequestGenerator.generate(
            applicationData.api,
            applicationData.requestBodies,
            GeneralGenerators.GeneralTemplates,
            this.AngularTemplates,
        );

        return new Models.GeneratedData({
            serviceBase: generatedServiceBase,
            models: generatedModels,
            enums: generatedEnums,
            requests: generatedRequests,
        });
    }

    /* Paths to Angular specific templates */
    private static AngularTemplates: GeneralGenerators.IFrameworkTemplates = {
        serviceBase: path.join(__dirname, '../../templates/angular/serviceBase.hbs'),
        requestClass: path.join(__dirname, '../../templates/angular/requestClass.hbs'),
        requestMethod: path.join(__dirname, '../../templates/angular/requestMethod.hbs'),
    };
}
