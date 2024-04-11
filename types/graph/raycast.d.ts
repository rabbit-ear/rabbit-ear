export default raycast;
/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description cast a ray and intersect a FOLD mesh, return
 * the intersected face, if exists, and the nearest edge
 * and vertex to the intersection.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine} ray a ray defined by a vector and origin
 */
declare function raycast(graph: FOLD, ray: VecLine): void;
