/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { Schema } from './models-namespace';

interface IParameter {
    name: string;
    location: ParameterLocation;
    schema: Schema;
    isRequired?: boolean;
    description?: string;
}

export class Parameter implements IParameter {
    public readonly name: string;
    public readonly location: ParameterLocation;
    public readonly schema: Schema;
    public readonly isRequired?: boolean;
    public readonly description?: string;

    public constructor({ name, location, schema, isRequired = false, description = '' }: IParameter) {
        this.name = name;
        this.location = location;
        this.isRequired = isRequired;
        this.description = description;
        this.schema = schema;
    }
}

export enum ParameterLocation {
    query,
    path,
    header,
    cookie,
}
