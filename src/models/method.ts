import { Parameter, RequestObject } from './models-namespace';

interface IMethod {
    type: MethodType;
    name: string;
    description?: string;
    parameters?: Array<Parameter>;
    requestBody?: RequestObject;
    response: RequestObject;
}

export class Method implements IMethod {
    public readonly type: MethodType;
    public readonly name: string;
    public readonly description?: string;
    public readonly parameters?: Array<Parameter>;
    public readonly requestBody?: RequestObject;
    public readonly response: RequestObject;

    public constructor({ type, name, description = '', parameters, requestBody, response }: IMethod) {
        this.type = type;
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.requestBody = requestBody;
        this.response = response;
    }
}

export enum MethodType {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
}
