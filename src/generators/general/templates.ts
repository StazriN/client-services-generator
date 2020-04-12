/*
 * That file contains list of general templates used by Handlebars library
 * and contains definitions for template structures used in application.
 */
export interface IGeneralTemplates {
    model: string;
    enum: string;
    requestImport: string;
}

export interface IFrameworkTemplates {
    serviceBase: string;
    requestClass: string;
    requestMethod: string;
}

export const GeneralTemplates: IGeneralTemplates = {
    model: './src/templates/general/model.hbs',
    enum: './src/templates/general/enum.hbs',
    requestImport: './src/templates/general/requestImport.hbs',
};
