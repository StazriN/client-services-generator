import { BasicTypes } from './models-namespace';

interface IProperty {
    name: string;
    type: BasicTypes | string;
    isRequired?: boolean;
    isRefModel?: boolean;
    isArray?: boolean;
    isEnum?: boolean;
    enumValues?: Array<string | null>;
    format?: string;
    example?: string;
}

export class Property implements IProperty {
    public readonly name: string;
    public readonly type: BasicTypes | string;
    public readonly isRequired?: boolean;
    public readonly isRefModel?: boolean;
    public readonly isArray?: boolean;
    public readonly isEnum?: boolean;
    public readonly enumValues?: Array<string | null>;
    public readonly format?: string;
    public readonly example?: string;

    public constructor({
        name,
        type,
        isRequired = false,
        isRefModel = false,
        isArray = false,
        isEnum = false,
        enumValues = [],
        format = '',
        example = '',
    }: IProperty) {
        this.name = name;
        this.type = type;
        this.isRequired = isRequired;
        this.isRefModel = isRefModel;
        this.isArray = isArray;
        this.isEnum = isEnum;
        this.enumValues = enumValues;
        this.format = format;
        this.example = example;
    }
}
