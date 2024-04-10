export function edgesPaths(graph: FOLD, options?: object): SVGElement;
export function edgesLines(graph: FOLD, options?: object): SVGElement;
export default drawEdges;
/**
 * @description Convert the edges of a FOLD graph into SVG line or path elements
 * and return the result as a group element <g> containing the lines.
 *
 * If the fold angles are all flat, all edges of the same assignment can have
 * the same style, so, we draw them all as SVG path objects. Otherwise if there
 * exists edges with non flat fold angles, simply draw all of them as lines,
 * ensuring that some can have the style associated with fold angle (opacity).
 */
declare function drawEdges(graph: any, options: any): SVGElement;
