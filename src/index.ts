#!/usr/bin/env node

/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { ArgumentParser, InputFileResolver, IArguments, OutputFilesResolver } from './core';
import { Models } from './models';
import { OpenApiParser } from './parsers/openApi';
import { AxiosServiceGenerator } from './generators/axios';
import { AngularServiceGenerator } from './generators/angular';

/* The main function that calls all parts of the application */
async function main() {
    try {
        // Parsing program arguments
        const parsedArguments: IArguments = await ArgumentParser.parse();

        // Loading API object from API documentation file
        const rawApiData: Models.IRawApiData = await InputFileResolver.getRawApiData(parsedArguments.input);

        // Parsing OpenAPI documentation
        const openAPI: Models.Application = OpenApiParser.parse(rawApiData.data);
        let genResult: Models.GeneratedData;

        // Generating output file structures based on selected framework
        if (parsedArguments.type == 'axios') {
            genResult = AxiosServiceGenerator.generate(openAPI);
        } else {
            genResult = AngularServiceGenerator.generate(openAPI);
        }

        // Generating output directory structure and output files
        const filesGenerated = await OutputFilesResolver.generateOutput(parsedArguments.output, genResult);

        if (filesGenerated) {
            console.log(`Services was successfully generated to (${parsedArguments.output}\\services\\).`);
        } else {
            console.log(`Services wasn't generated.`);
        }
    } catch (error) {
        console.error(error);
    }
}

main();
