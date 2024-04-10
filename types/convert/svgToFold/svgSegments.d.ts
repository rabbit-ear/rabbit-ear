export default svgSegments;
/**
 * @description Given an SVG element (as a string or Element object),
 * Extract all straight lines from the SVG, including those inside of
 * complex path objects. Return the straight lines as a flat array with
 * additional attribute information.
 * @param {Element | string} svg an SVG image as a DOM element
 * or a string.
 * @returns {object[]} array of objects, one for each straight line segment
 * with these values:
 * - .element a pointer to the element that this segment comes from.
 * - .attributes the attributes of the element as a Javascript object.
 *    this includes those which were inherited from its parents
 * - .segment a pair of vertices, the endpoints of the segment.
 * - .data two "data-" attributes representing assignment and foldAngle.
 * - .stroke the stroke attribute taken from getComputedStyle if possible.
 * - .opacity the opacity attribute taken from getComputedStyle if possible.
 */
declare function svgSegments(svg: Element | string): object[];
