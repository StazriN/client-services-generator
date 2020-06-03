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
export class AxiosServiceGenerator {
    public static generate(applicationData: Models.Application): Models.GeneratedData {
        console.log('Generating services for axios library.');
        const generatedServiceBase: string = GeneralGenerators.ServiceBaseGenerator.generate(applicationData.api, this.AxiosTemplates);
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
            this.AxiosTemplates,
        );

        return new Models.GeneratedData({
            serviceBase: generatedServiceBase,
            models: generatedModels,
            enums: generatedEnums,
            requests: generatedRequests,
        });
    }

    /* Paths to Axios specific templates */
    private static AxiosTemplates: GeneralGenerators.IFrameworkTemplates = {
        serviceBase: path.join(__dirname, '../../templates/axios/serviceBase.hbs'),
        requestMethod: path.join(__dirname, '../../templates/axios/requestMethod.hbs'),
        requestClass: path.join(__dirname, '../../templates/axios/requestClass.hbs'),
    };
}
