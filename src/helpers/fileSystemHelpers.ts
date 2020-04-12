import * as fs from 'fs-extra';
import * as path from 'path';

/*
 * Helper class for operations with the file system
 */
export class FileSystemHelpers {
    public static basePath: string = process.cwd();

    public static getFullPath(relativePath: string): string {
        return path.resolve(this.basePath, relativePath);
    }

    public static createDir(relativePath: string) {
        fs.mkdirSync(this.getFullPath(relativePath), { recursive: true });
    }

    public static createFile(relativePath: string, content: string) {
        fs.writeFileSync(this.getFullPath(relativePath), content, { encoding: 'utf8' });
    }

    public static deleteDir(relativePath: string) {
        fs.removeSync(this.getFullPath(relativePath));
    }

    public static fileExists(relativePath: string): boolean {
        return fs.existsSync(this.getFullPath(relativePath));
    }

    public static dirExists(relativePath: string): boolean {
        return fs.pathExistsSync(this.getFullPath(relativePath));
    }

    public static readFileSync(relativePath: string): string {
        return fs.readFileSync(this.getFullPath(relativePath), 'utf8');
    }

    public static getFileExtension(relativePath: string): string {
        const fileExtension = this.getFullPath(relativePath)
            .split('.')
            .pop();

        if (fileExtension !== undefined) {
            return fileExtension;
        } else {
            return '';
        }
    }
}
