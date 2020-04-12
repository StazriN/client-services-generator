interface IGeneratedObject {
    name: string;
    value: string;
}

export class GeneratedObject implements IGeneratedObject {
    public readonly name: string;
    public readonly value: string;

    public constructor({ name, value }: IGeneratedObject) {
        this.name = name;
        this.value = value;
    }
}
