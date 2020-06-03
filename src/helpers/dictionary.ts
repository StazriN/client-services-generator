/* 
** @author  Samuel Obuch
** @project client-services-generator
*/

/**
 * Represents a collection of keys and values.
 * Key must be either string or number.
 * Value can be arbitrary type.
 */
export type Dictionary<TKey extends string | number | symbol, TValue> = { [K in TKey]: TValue };

export namespace Dictionary {
    export const foreach = <TKey extends string | number, TValue>(
        dictionary: Dictionary<TKey, TValue>,
        foreachFunction: (key: TKey, value: TValue) => void,
    ) => {
        for (const key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                foreachFunction(key, dictionary[key]);
            }
        }
    };

    export const map = <TKey extends string | number, TValue, TResultValue>(
        dictionary: Dictionary<TKey, TValue>,
        mapFunction: (key: TKey, value: TValue) => TResultValue,
    ): TResultValue[] => {
        const result: TResultValue[] = [];
        for (const key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                result.push(mapFunction(key, dictionary[key]));
            }
        }
        return result;
    };

    export const every = <TKey extends string | number, TValue>(
        dictionary: Dictionary<TKey, TValue>,
        testFunction: (key: TKey, value: TValue) => boolean,
    ): boolean => {
        for (const key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                if (!testFunction(key, dictionary[key])) {
                    return false;
                }
            }
        }
        return true;
    };

    export const length = (dictionary: Dictionary<any, any>): number => {
        return Object.keys(dictionary).length;
    };

    export const empty = () => ({});
}
