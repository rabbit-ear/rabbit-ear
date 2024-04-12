export function facesVerticesPolygon(graph: any, options: any): SVGElement[];
export function facesEdgesPolygon(graph: any, options: any): SVGElement[];
export default drawFaces;
/**
 * @description Convert the faces of a FOLD graph into SVG polygon elements.
 * Return the result as a group element <g> with all faces (if they exist)
 * as childNodes in the group.
 */
declare function drawFaces(graph: any, options: any): SVGElement | SVGElement[];
