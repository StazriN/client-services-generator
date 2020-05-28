import * as path from 'path';

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
    model: path.join(__dirname, '../../templates/general/model.hbs'),
    enum: path.join(__dirname, '../../templates/general/enum.hbs'),
    requestImport: path.join(__dirname, '../../templates/general/requestImport.hbs'),
};
