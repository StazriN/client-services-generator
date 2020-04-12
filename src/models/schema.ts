import { BasicTypes } from './models-namespace';

interface ISchema {
    type: BasicTypes;
    format?: string;
    isArray?: boolean;
    isEnum?: boolean;
    enumValues?: Array<string | null>;
}

export class Schema implements ISchema {
    public readonly type: BasicTypes;
    public readonly format?: string;
    public readonly isArray?: boolean;
    public readonly isEnum?: boolean;
    public readonly enumValues?: Array<string | null>;

    public constructor({ type, format = '', isArray = false, isEnum = false, enumValues = [] }: ISchema) {
        this.type = type;
        this.format = format;
        this.isArray = isArray;
        this.isEnum = isEnum;
        this.enumValues = enumValues;
    }
}
