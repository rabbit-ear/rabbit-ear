/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @typedef FOLD
 * @type {{
 *   vertices_coords?: number[][],
 *   vertices_vertices?: number[][],
 *   vertices_edges?: number[][],
 *   vertices_faces?: (number | null | undefined)[][],
 *   edges_vertices?: number[][],
 *   edges_faces?: (number | null | undefined)[][],
 *   edges_assignment?: string[],
 *   edges_foldAngle?: number[],
 *   faces_vertices?: number[][],
 *   faces_edges?: number[][],
 *   faces_faces?: (number | null | undefined)[][]
 * }}
 * @description A Javascript object representation of a FOLD file which follows the FOLD
 * specification in that it contains any number of the geometry arrays.
 * @property {number[][]} [vertices_coords] xy or xyz coordinates of the vertices
 * @property {number[][]} [vertices_vertices] for each vertex all adjacent vertices
 * @property {number[][]} [vertices_edges] for each vertex all adjacent edges
 * @property {(number | null | undefined)[][]} [vertices_faces] for each vertex all adjacent faces
 * @property {number[][]} [edges_vertices] each edge connects two vertex indices
 * @property {(number | null | undefined)[][]} [edges_faces] for each edge all adjacent faces
 * @property {string[]} [edges_assignment] single-character fold assignment of each edge
 * @property {number[]} [edges_foldAngle] in degrees, the fold angle of each edge
 * @property {number[][]} [faces_vertices] for each face, all adjacent vertices
 * @property {number[][]} [faces_edges] for each face, all adjacent edges
 * @property {(number | null | undefined)[][]} [faces_faces] for each face, all adjacent faces
 * @property {FOLD[]} [file_frames] array of embedded FOLD objects, good for representing
 * a linear sequence like diagram steps for example.
 * @example
 * {
 *   vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
 *   vertices_faces: [[0, 1, null], [0, null], [1, 0, null], [1, null]],
 *   edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]],
 *   edges_assignment: ["B", "B", "B", "B", "V"],
 *   edges_foldAngle: [0, 0, 0, 0, 180],
 *   faces_vertices: [[0, 1, 2], [0, 2, 3]],
 * }
 */

/**
 * @typedef VecLine
 * @type {{ vector: number[], origin: number[] }}
 * @description a line defined by a vector and a point along the line,
 * capable of representing a line in any dimension.
 * @property {number[]} vector - a vector describing the direction of the line
 * @property {number[]} origin - a point which the line passes through
 */

/**
 * @typedef UniqueLine
 * @type {{ normal: number[], distance: number }}
 * @description a 2D line defined by a unit normal vector and a value that
 * describes the shortest distance from the origin to a point on the line.
 * @property {number[]} normal - a unit vector that is normal to the line
 * @property {number} distance - the shortest distance
 * from the line to the origin
 */

/**
 * @typedef Box
 * @type {{ min: number[], max: number[], span?: number[] }}
 * @description an axis-aligned bounding box, capable of representing
 * a bounding box with any number of dimensions.
 * @property {number[]} min - the point representing the absolute minimum
 * for all axes.
 * @property {number[]} max - the point representing the absolute maximum
 * for all axes.
 */

/**
 * @typedef Circle
 * @type {{ radius: number, origin: number[] }}
 * @description a circle primitive in 2D
 * @property {number} radius - the radius of the circle
 * @property {number[]} origin - the center of the circle as an array of numbers
 */

/**
 * @typedef TacoTacoConstraint
 * @type {[number, number, number, number]}
 * @description four face indices involved
 * in the taco-taco relationship, encoding this relationship:
 * 0 and 2 are connected (A and C) and 1 and 3 are connected (B and D)
 * (A,C) (B,D) (B,C) (A,D) (A,B) (C,D)
 *
 * @typedef TacoTortillaConstraint
 * @type {[number, number, number]}
 * @description three face indices involved
 * in the taco-tortilla relationship, encoding this relationship:
 * 0 and 2 are a connected taco, 1 is the tortilla face
 * (A,C) (A,B) (B,C)
 *
 * @typedef TortillaTortillaConstraint
 * @type {[number, number, number, number]}
 * @description four face indices involved
 * in the tortilla-tortilla relationship, encoding this relationship:
 * 0 and 1 are a connected tortilla, 2 and 3 are a connected tortilla.
 * where 0 is above/below 2, and 1 is above/below 3
 * (A,C) (B,D)
 *
 * @typedef TransitivityConstraint
 * @type {[number, number, number]}
 * @description three face indices encoding a transitivity constraint,
 * where the three faces involved are in sorted order.
 * (A,B) (B,C) (C,A)
 */

/**
 * @typedef LayerBranch
 * @type {LayerFork[]}
 * @description To compile a solution, you must include
 * a selection from every Branch inside this LayerBranches array.
 *
 * @typedef LayerOrders
 * @type {{[key: string]: number}}
 * @description an object with (many) face-pair keys, and value numbers 1 or 2.
 *
 * @typedef LayerFork
 * @type {{ orders: LayerOrders, branches?: LayerBranch[] }}
 * @description To compile a solution, you must choose only one item
 * from this list. Each item is a copy of one another, but with
 * different values.
 *
 * @typedef LayerSolverSolution
 * @type {LayerFork}
 * @example In this example there are three "branches", one top-level,
 * and two more inside of this one each at a similar depth.
 * The top-level branch contains two all-branches (each happen to be
 * identical in structure), and each of these all-branches contain
 * two choice-branches.
 * {
 *   "orders: LayerOrders,
 *   "branches: [
 *     [
 *       {
 *         "orders": LayerOrders,
 *         "branches": [
 *           [
 *             { "orders": LayerOrders },
 *             { "orders": LayerOrders },
 *           ],
 *         ],
 *       },
 *       {
 *         "orders": LayerOrders
 *       },
 *     ],
 *     [
 *       {
 *         "orders": LayerOrders,
 *         "branches": [
 *           [
 *             { "orders": LayerOrders },
 *             { "orders": LayerOrders },
 *           ],
 *         ],
 *       },
 *       {
 *         "orders": LayerOrders
 *       },
 *     ],
 *   ],
 * }
 *
 *
 */
