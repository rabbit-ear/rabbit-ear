/**
 * Rabbit Ear (c) Kraft
 */
export default Object.create(null);

/**
 * @typedef AxiomParams
 * @type {object}
 * @description The input to one of the seven axiom calculations. Depending on which axiom,
 * this will include up to two points and up to two lines, each inside their
 * respectively named arrays, where the order matters.
 * @property {RayLine[]} [lines] an array of lines
 * @property {number[][]} [points] an array of points
 * @example
 * {
 *   points: [[0.8, 0.5], [0.1, 0.15]],
 *   lines: [{vector: [0,1], origin: [0.5, 0.5]}]
 * }
 */

/**
 * @typedef FOLD
 * @type {object}
 * @description A Javascript object representation of a FOLD file which follows the FOLD
 * specification in that it contains any number of the geometry arrays.
 * @property {number[][]} [vertices_coords] xy or xyz coordinates of the vertices
 * @property {number[][]} [vertices_vertices] for each vertex, all of its edge-adjacent vertices
 * @property {number[][]} [edges_vertices] each edge connects two vertex indices
 * @property {string[]} [edges_assignment] single-character fold assignment of each edge
 * @property {number[]} [edges_foldAngle] in degrees, the fold angle of each edge
 * @property {number[][]} [faces_vertices] each face defined by a sequence of vertex indices
 * @property {number[][]} [faces_edges] each face defined by a sequence of edge indices
 * @property {number[][]} [faces_faces] for each face, a list of faces which are edge-adjacent neighbors.
 * @property {FOLD[]} [file_frames] array of embedded FOLD objects, good for representing
 * a linear sequence like diagram steps for example.
 * @example
 * {
 *   vertices_coords: [[0,0], [1,0], [1,1], [0,1]],
 *   edges_vertices: [[0,1], [1,2], [2,3], [3,0], [0,2]],
 *   edges_assignment: ["B", "B", "B", "B", "V"],
 *   edges_foldAngle: [0, 0, 0, 0, 180],
 *   faces_vertices: [[0,1,2], [0,2,3]],
 * }
 */


/**
 * @typedef BoundingBox
 * @type {object}
 * @description An n-dimensional axis-aligned bounding box that ecloses a space.
 * @property {number[]} min the corner point of the box that is a minima along all axes.
 * @property {number[]} max the corner point of the box that is a maxima along all axes.
 * @property {number[]} span the lengths of the box along all dimensions, the difference between the maxima and minima.
 * @example
 * {
 *   min: [-3, -10],
 *   max: [5, -1],
 *   span: [8, 9],
 * }
 */


/**
 * @typedef RayLine
 * @type {object}
 * @description an object with a vector and an origin, representing a line or a ray.
 * @property {number[]} vector - the line's direction vector
 * @property {number[]} origin - one point that intersects with the line
 * @example
 * {
 *   vector: [0.0, 1.0],
 *   origin: [0.5, 0.5]
 * }
 */

/**
 * @typedef UniqueLine
 * @type {object}
 * @description This is a line parameterization which 
 * @property {number[]} u - the line's normal vector
 * @property {number} d - the shortest distance from the origin to the line
 */
