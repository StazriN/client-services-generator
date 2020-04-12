import { Method } from './models-namespace';

interface IPath {
    name: string;
    methods: Array<Method>;
}

export class Path implements IPath {
    public readonly name: string;
    public readonly methods: Array<Method>;

    public constructor({ name, methods }: IPath) {
        this.name = name;
        this.methods = methods;
    }
}
