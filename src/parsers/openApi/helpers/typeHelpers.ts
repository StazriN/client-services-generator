/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

import { Models } from '../../../models';

/*
 * Helper class for parsing the most common types in OpenApi documentation
 */
export class TypeHelpers {
    /* That method extract name of a user-defined object */
    public static refObjectName(refLink: string): string {
        const linkParts = refLink.split('/');

        return linkParts[linkParts.length - 1];
    }

    /* That method resolve if the reference link contains the path to RequestBodies */
    public static refContainsRequestBodies(refLink: string): boolean {
        const linkParts = refLink.split('/');

        return linkParts.includes('requestBodies');
    }

    /* That method resolve the most common types */
    public static parseBasicType(type: string): Models.BasicTypes {
        switch (type?.toLowerCase()) {
            case 'number':
            case 'integer':
                return Models.BasicTypes.number;
            case 'string':
                return Models.BasicTypes.string;
            case 'boolean':
                return Models.BasicTypes.boolean;
            case 'array':
                return Models.BasicTypes.array;
            case 'object':
                return Models.BasicTypes.object;
            default:
                return Models.BasicTypes.any;
        }
    }
}
