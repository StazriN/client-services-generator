import { FileSystemHelpers } from '../helpers/fileSystemHelpers';
import { Models } from '../models';

/*
 * Class for creating a directory structure and generating output files
 */
export class OutputFilesResolver {
    private static defaultPath: string = '';

    public static async generateOutput(path: string, genResult: Models.GeneratedData) {
        console.log('Generating output files.');
        this.setDefaultPath(path);
        await this.createBaseDir();
        FileSystemHelpers.createFile(`${this.defaultPath}serviceBase.ts`, genResult.serviceBase);
        await this.createModelsAndEnums(genResult.models, genResult.enums);
        await this.createRequests(genResult.requests);
    }

    private static setDefaultPath(path: string) {
        this.defaultPath = FileSystemHelpers.getFullPath(`${path}\\services`).concat('\\');
    }

    private static async createBaseDir() {
        // If the output directory already exists application delete it and creates new
        if (FileSystemHelpers.dirExists(this.defaultPath)) {
            FileSystemHelpers.deleteDir(this.defaultPath);
        }

        FileSystemHelpers.createDir(this.defaultPath);
    }

    /* Method for the creating models and enums defined in the API documentation */
    private static async createModelsAndEnums(models: Array<Models.GeneratedObject>, enums: Array<Models.GeneratedObject>) {
        const modelsPath: string = `${this.defaultPath}models\\`;

        FileSystemHelpers.createDir(modelsPath);

        models.forEach((model: Models.GeneratedObject) => {
            FileSystemHelpers.createFile(`${modelsPath}${model.name}.ts`, model.value);
        });

        enums.forEach((enumModel: Models.GeneratedObject) => {
            FileSystemHelpers.createFile(`${modelsPath}${enumModel.name}.ts`, enumModel.value);
        });
    }

    /* Method for the creating all requests defined in the API documentation */
    private static async createRequests(requests: Array<Models.GeneratedObject>) {
        const requestsPath: string = `${this.defaultPath}requests\\`;

        FileSystemHelpers.createDir(requestsPath);

        requests.forEach((request: Models.GeneratedObject) => {
            FileSystemHelpers.createFile(`${requestsPath}${request.name}.ts`, request.value);
        });
    }
}
