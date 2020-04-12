import { BasicTypes } from './models-namespace';

interface IEnum {
    type: BasicTypes;
    name: string;
    enumValues: Array<string | null>;
}

export class Enum implements IEnum {
    public readonly type: BasicTypes;
    public readonly name: string;
    public readonly enumValues: Array<string | null>;

    public constructor({ type, name, enumValues }: IEnum) {
        this.type = type;
        this.name = name;
        this.enumValues = enumValues;
    }
}
