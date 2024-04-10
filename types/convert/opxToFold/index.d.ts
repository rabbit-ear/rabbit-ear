export default opxToFold;
/**
 * @description Convert an ORIPA file into a FOLD object
 * @param {string} file an ORIPA file as a string
 * @param {number | object} options an epsilon or an options object
 * used to merge nearby vertices
 * @returns {FOLD} a FOLD representation of the ORIPA file
 */
declare function opxToFold(file: string, options: number | object): FOLD;
