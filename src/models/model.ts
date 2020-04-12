import { Property } from './models-namespace';

interface IModel {
    name: string;
    properties: Array<Property>;
    superType?: string;
}

export class Model implements IModel {
    public readonly name: string;
    public readonly properties: Array<Property>;
    public readonly superType?: string;

    public constructor({ name, properties, superType = '' }: IModel) {
        this.name = name;
        this.properties = properties;
        this.superType = superType;
    }
}
