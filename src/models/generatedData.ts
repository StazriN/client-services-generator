import { GeneratedObject } from "./models-namespace";

interface IGeneratedData {
    serviceBase: string;
    models: Array<GeneratedObject>;
    enums: Array<GeneratedObject>;
    requests: Array<GeneratedObject>
}

export class GeneratedData implements IGeneratedData {
    public readonly serviceBase: string;
    public readonly models: Array<GeneratedObject>;
    public readonly enums: Array<GeneratedObject>;
    public readonly requests: Array<GeneratedObject>

    public constructor({ serviceBase, models, enums, requests}: IGeneratedData) {
        this.serviceBase = serviceBase;
        this.models = models;
        this.enums = enums;
        this.requests = requests;
    }
}
