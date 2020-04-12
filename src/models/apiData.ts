import { Path } from './models-namespace';

interface IApiData {
    serverUrls: Array<string>;
    title: string;
    paths: Array<Path>;
}

export class ApiData implements IApiData {
    public readonly serverUrls: Array<string>;
    public readonly title: string;
    public readonly paths: Array<Path>;

    public constructor({ serverUrls, title, paths }: IApiData) {
        this.serverUrls = serverUrls;
        this.title = title;
        this.paths = paths;
    }
}

export interface IRawApiData {
    apiType: ApiType;
    data: any;
}

export enum ApiType {
    openApi,
    wadl,
}
