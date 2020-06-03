/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { FileSystemHelpers } from '../helpers/fileSystemHelpers';
import { Models } from '../models';
import * as promptly from 'promptly';

/*
 * Class for creating a directory structure and generating output files
 */
export class OutputFilesResolver {
    private static defaultPath: string = '';

    public static async generateOutput(path: string, genResult: Models.GeneratedData): Promise<boolean> {
        console.log('Generating output files.');
        this.setDefaultPath(path);
        const baseDirCreated = await this.createBaseDir();

        if (!baseDirCreated) return false;

        FileSystemHelpers.createFile(`${this.defaultPath}serviceBase.ts`, genResult.serviceBase);
        await this.createModelsAndEnums(genResult.models, genResult.enums);
        await this.createRequests(genResult.requests);

        return true;
    }

    private static setDefaultPath(path: string) {
        this.defaultPath = FileSystemHelpers.getFullPath(`${path}\\services`).concat('\\');
    }

    /* Method for the creating 'service' folder for generated files */
    private static async createBaseDir(): Promise<boolean> {
        // If the output directory already exists application delete it and creates new
        if (FileSystemHelpers.dirExists(this.defaultPath)) {
            if (!(await this.ConfirmDelete())) return false;
            FileSystemHelpers.deleteDir(this.defaultPath);
        }

        FileSystemHelpers.createDir(this.defaultPath);
        return true;
    }

    /* Method for the user confirmation of delete existing folder */
    private static async ConfirmDelete(): Promise<boolean> {
        console.log();
        const answer = await promptly.confirm(
            "The 'services' folder already exists. \nAre you sure you want to delete content of the 'services' folder and generate a new one? [Y/n]:",
        );
        console.log();

        return answer;
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
