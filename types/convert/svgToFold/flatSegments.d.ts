export default flatSegments;
/**
 * @description Get a flat array of all elements in the tree, with all
 * styles also flattened (nested transformed computed, for example)
 * convert all elements <path> <rect> etc into arrays of line segments
 */
declare function flatSegments(svgElement: any): any[];
