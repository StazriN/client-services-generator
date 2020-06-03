/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { ApiData, Model, RequestObject, Enum } from './models-namespace';
import { Dictionary } from '../helpers/dictionary';

interface IApplication {
    api: ApiData;
    models: Array<Model>;
    enums: Array<Enum>;
    requestBodies: Dictionary<string, RequestObject>;
}

export class Application implements IApplication {
    public readonly api: ApiData;
    public readonly models: Array<Model>;
    public readonly enums: Array<Enum>;
    public readonly requestBodies: Dictionary<string, RequestObject>;

    public constructor({ api, models, enums, requestBodies }: IApplication) {
        this.api = api;
        this.models = models;
        this.enums = enums;
        this.requestBodies = requestBodies;
    }
}
