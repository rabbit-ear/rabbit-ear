export default svgEdgeGraph;
/**
 * @description This method will handle all of the SVG parsing
 * and result in a very simple graph representation basically
 * only containing line segments and their assignment/foldAngle.
 * The graph will not be planar (edges will overlap), no faces
 * will exist, and duplicate vertices will exist and need to
 * be merged
 * @param {Element | string} svg an SVG image as a DOM element
 * or a string.
 * @returns {FOLD} a FOLD representation of the SVG image, not
 * yet a planar graph, no faces, and possible edge overlaps.
 */
declare function svgEdgeGraph(svg: Element | string, options: any): FOLD;
