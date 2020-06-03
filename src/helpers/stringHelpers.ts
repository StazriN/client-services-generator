/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

/*
 * Helper class for operations with strings
 */
export class StringHelpers {
    /**
     * Checks if the string is empty, undefined or null.
     * @param input String to test.
     * @returns True if the string is empty, undefined or null, otherwise false.
     */
    public static isNullOrUndefinedOrEmpty(input: string | undefined, trim: boolean = false): boolean {
        return input === null || input === undefined || input.length === 0 || (trim && input.trim().length === 0);
    }

    /**
     * Removes extra spaces from string.
     * @param input String to check.
     * @returns String without extra white spaces.
     */
    public static removeExtraWhiteSpaces(input: string): string {
        return input.replace(/\s+/g, ' ').trim();
    }

    /**
     * Removes all spaces from string.
     * @param input String to check.
     * @returns String without all white spaces.
     */
    public static removeAllWhiteSpaces(input: string): string {
        return input.replace(/\s+/g, '').trim();
    }

    /**
     * Convert string to string with capitalized first letter.
     * @param input String for conversion.
     * @returns String with capitalized first letter.
     */
    public static capitalizeFirstLetter(input: string): string {
        if (!input) {
            return '';
        }

        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    /**
     * Convert string to string with lowercased first letter.
     * @param input String for conversion.
     * @returns String with lowercased first letter.
     */
    public static lowercaseFirstLetter(input: string): string {
        if (!input) {
            return '';
        }

        return input.charAt(0).toLowerCase() + input.slice(1);
    }
}
