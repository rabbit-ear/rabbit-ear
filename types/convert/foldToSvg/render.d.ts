export default render;
/**
 * @name render
 * @memberof graph
 * @description renders a FOLD object into an SVG, ensuring visibility by
 * setting the viewBox and the stroke-width attributes on the SVG.
 * @param {SVGElement} element an already initialized SVG DOM element.
 * @param {FOLD} graph a FOLD object
 * @param {object} options an optional options object to style the rendering
 * @returns {SVGElement} the first SVG parameter object.
 */
declare function render(graph: FOLD, element: SVGElement, options?: object): SVGElement;
