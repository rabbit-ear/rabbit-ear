export default svgToFold;
/**
 * @description Convert an SVG to a FOLD object. This only works
 * with SVGs of crease patterns, this will not work
 * with an SVG of a folded form.
 * @param {string | SVGElement} file the SVG element as a
 * document element node, or as a string
 * @param {number | object} options an options object or an epsilon number
 * @returns {FOLD} a FOLD representation of the SVG
 */
declare function svgToFold(file: string | SVGElement, options: number | object): FOLD;
