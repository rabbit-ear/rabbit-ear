export default PathToSegments;
/**
 * @description convert an SVG path into segments
 * @param {Element} path an SVG path element
 * @returns {[number, number, number, number][]} a list of segments
 * in the form of 4 numbers (x1, y1, x2, y2)
 */
declare function PathToSegments(path: Element): [number, number, number, number][];
