export default foldToObj;
/**
 * @description Convert a FOLD object into an OBJ file. For FOLD objects
 * with many frames, this will only work on one frame at a time.
 * @param {FOLD|string} file a FOLD object
 * @returns {string} an OBJ representation of the FOLD object
 */
declare function foldToObj(file: FOLD | string): string;
