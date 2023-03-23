/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @typedef FOLD
 * @type {{
 *   vertices_coords?: number[][],
 *   vertices_vertices?: number[][],
 *   vertices_edges?: number[][],
 *   vertices_faces?: number[][],
 *   edges_vertices?: number[][],
 *   edges_faces?: number[][],
 *   edges_assignment?: string[],
 *   edges_foldAngle?: number[],
 *   faces_vertices?: number[][],
 *   faces_edges?: number[][],
 *   faces_faces?: number[][]
 * }}
 * @description A Javascript object representation of a FOLD file which follows the FOLD
 * specification in that it contains any number of the geometry arrays.
 * @property {number[][]} [vertices_coords] xy or xyz coordinates of the vertices
 * @property {number[][]} [vertices_vertices] for each vertex all adjacent vertices
 * @property {number[][]} [vertices_edges] for each vertex all adjacent edges
 * @property {number[][]} [vertices_faces] for each vertex all adjacent faces
 * @property {number[][]} [edges_vertices] each edge connects two vertex indices
 * @property {number[][]} [edges_faces] for each edge all adjacent faces
 * @property {string[]} [edges_assignment] single-character fold assignment of each edge
 * @property {number[]} [edges_foldAngle] in degrees, the fold angle of each edge
 * @property {number[][]} [faces_vertices] for each face, all adjacent vertices
 * @property {number[][]} [faces_edges] for each face, all adjacent edges
 * @property {number[][]} [faces_faces] for each face, all adjacent faces
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
