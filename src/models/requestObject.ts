/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

interface IRequestObject {
    type: Array<string>;
    isRefModel?: boolean;
    isRequired?: boolean;
    isArray?: boolean;
    isEnum?: boolean;
    enumValues?: Array<string | null>;
    description?: string;
    inRequestBodies?: boolean;
}

export class RequestObject {
    public readonly type: Array<string>;
    public readonly isRefModel?: boolean;
    public readonly isRequired?: boolean;
    public readonly isArray?: boolean;
    public readonly isEnum?: boolean;
    public readonly enumValues?: Array<string | null>;
    public readonly description?: string;
    public readonly inRequestBodies?: boolean;

    public constructor({
        type,
        isRefModel = false,
        isRequired = false,
        isArray = false,
        isEnum = false,
        enumValues = [],
        description = '',
        inRequestBodies = false,
    }: IRequestObject) {
        this.type = type;
        this.isRefModel = isRefModel;
        this.inRequestBodies = inRequestBodies;
        this.isArray = isArray;
        this.isEnum = isEnum;
        this.enumValues = enumValues;
        this.description = description;
        this.isRequired = isRequired;
    }
}
