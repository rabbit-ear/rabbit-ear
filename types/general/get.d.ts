/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @param {object} obj
 * @returns {boolean}
 */
declare function isIterable(obj: object): boolean;
/**
 * @description flatten only until the point of comma separated entities.
 * This will preserve vectors (number[]) in an array of array of vectors.
 * @param {any[][]} args any array, intended to contain arrays of arrays.
 * @returns {array[]} a flattened copy, flattened up until the point before
 * combining arrays of elements.
 */
declare function semiFlattenArrays(...args: any[]): any[][];
/**
 * @description Totally flatten, recursive
 * @param {any[][]} args any array, intended to contain arrays of arrays.
 * @returns {any[]} fully, recursively flattened array
 */
declare function flattenArrays(...args: any[]): any[];
