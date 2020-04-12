import * as yargs from 'yargs';
import * as inquirer from 'inquirer';
import { FileSystemHelpers } from '../helpers/fileSystemHelpers';

export interface IArguments {
    input: string;
    type: outputType;
    output: string;
}

export type outputType = 'axios' | 'angular';

/*
 * Class for parsing input arguments.
 * There are two options: command-line arguments or CLI
 */
export class ArgumentParser {
    public static parse(): Promise<IArguments> {
        const parsedArguments = this.parseArguments();

        // Check for '-i' argument that calls interactive mode
        if (parsedArguments.i) {
            return this.parseInteractive();
        } else {
            const inputFullPath = FileSystemHelpers.getFullPath(parsedArguments.s);
            const outputFullPath = FileSystemHelpers.getFullPath(parsedArguments.o);

            // Controls if the input file and the output directory exists
            if (!FileSystemHelpers.fileExists(inputFullPath)) {
                return Promise.reject('Invalid path to API documentation file.');
            }

            if (!FileSystemHelpers.dirExists(outputFullPath)) {
                return Promise.reject('Invalid path to output directory.');
            }

            return Promise.resolve({ input: inputFullPath, type: parsedArguments.t, output: outputFullPath });
        }
    }

    private static outputOptions: ReadonlyArray<outputType> = ['axios', 'angular'];

    /* Method that setup Yargs library for the command-line arguments parsing */
    private static parseArguments() {
        const argv = yargs
            .options({
                i: { alias: 'interactive', type: 'boolean', default: false, describe: 'Runs program in interactive mode.' },
                s: { alias: 'source', type: 'string', default: '', describe: 'Path to source file (api documentation).' },
                t: { alias: 'type', choices: this.outputOptions, default: this.outputOptions[0], describe: 'Output type of services.' },
                o: {
                    alias: 'output',
                    type: 'string',
                    default: FileSystemHelpers.basePath,
                    describe: 'Path to output directory for generated service files.',
                },
            })
            .help('h')
            .alias('h', 'help')
            .usage('Usage: $0 [options]')
            .example('$0 -s ./apiDocs/openApi.json -t axios -o ./myApp', 'Generate axios service files from openApi.json documentation file.')
            .check(({ i, s }) => {
                if ((i && !s) || (!i && s)) {
                    return true;
                } else if (i && s) {
                    throw new Error(`Argument 'i' is not compatible with other arguments.`);
                } else {
                    throw new Error(`One of arguments 'i' or 's' is required.`);
                }
            })
            .wrap(yargs.terminalWidth()).argv;

        return argv;
    }

    /* Method that setup Inquirer library for the CLI arguments parsing */
    private static async parseInteractive(): Promise<IArguments> {
        const questions: inquirer.QuestionCollection = [
            {
                type: 'input',
                name: 'input',
                message: 'Path to file that contains API documentation: ',
                validate: function(value) {
                    const fileExists = FileSystemHelpers.fileExists(value);

                    if (fileExists) {
                        return true;
                    } else {
                        return 'Please enter a valid path to API documentation file.';
                    }
                },
            },
            {
                type: 'list',
                name: 'type',
                message: 'What output framework format do you want?',
                default: 0,
                choices: this.outputOptions,
            },
            {
                type: 'input',
                name: 'output',
                message: 'Path to directory where you want to generate service directory with files:',
                default: FileSystemHelpers.basePath,
                validate: function(value) {
                    const dirExists = FileSystemHelpers.dirExists(value);

                    if (dirExists) {
                        return true;
                    } else {
                        return 'Please enter a valid path to output directory.';
                    }
                },
            },
        ];

        const interactiveArguments = await inquirer.prompt(questions);
        const inputFullPath = FileSystemHelpers.getFullPath(interactiveArguments.input);
        const outputFullPath = FileSystemHelpers.getFullPath(interactiveArguments.output);

        return { input: inputFullPath, type: interactiveArguments.type, output: outputFullPath };
    }
}
