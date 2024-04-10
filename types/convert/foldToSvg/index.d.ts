export default foldToSvg;
/**
 * @description renders a FOLD object as an SVG. This is able to render
 * in a couple styles (creasePattern, foldedForm), and will do some work
 * to ensure a nice rendering by finding a decent stroke-width and viewBox.
 *
 * deprecated param {boolean} tell the draw method to resize the viewbox/stroke
 * @param {FOLD | string} file a FOLD object or a FOLD file as a string
 * @param {object?} options optional options object to style components
 * - "string" {boolean} if true, the return value will be a string
 *   otherwise it will be a Javascript DOM element object type.
 * - todo: more
 * @returns {SVGElement} SVG element, containing the rendering of the origami.
 */
declare function foldToSvg(file: FOLD | string, options?: object | null): SVGElement;
