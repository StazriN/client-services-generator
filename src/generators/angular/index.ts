import { Models } from '../../models';
import { GeneralGenerators } from '../general';

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
        serviceBase: './src/templates/angular/serviceBase.hbs',
        requestClass: './src/templates/angular/requestClass.hbs',
        requestMethod: './src/templates/angular/requestMethod.hbs',
    };
}
