/**
 * Rabbit Ear (c) Kraft
 */
import makeFacesFacesOverlap from "../../graph/makeFacesFacesOverlap";
import {
	makeFacesWinding,
} from "../../graph/make";
import {
	booleanMatrixToUniqueIndexPairs,
} from "../../general/arrays";
// algorithm outline.
//
// find all face-to-face pleat walks, where the adjacent
// creases alternate M/V.
// gather this data together as a directed graph (we only need
// one of the +1 and -1 above/below motions).
// find the roots of the graph (no parent nodes).
// now we begin polygon-intersection.
// walk 2 pointers down every branch towards every leaf.
// both pointers start at the root, the front pointer moves
// as far ahead as possible as long as the intersection of
// the intersection... (of parents) exists.
// when an intersection no longer exists, walk the back pointer
// forward until an intersection exists again. repeat.
// every time a pointer moves (and is valid) we can record with
// certainty the above/below state of every pair of faces included
// between the two pointers. n faces, triangle number n-1 cases.

const clone = obj => JSON.parse(JSON.stringify(obj));

// top level keys are the direction. value will be an NxN matrix with holes.
const empty_tree = () => ({ "-1": [], "1": []});

/**
 * @param {number[][]} this matrix is filled in on both sides, it relates
 *  faces to faces, and the contents is either (-1, 0, 1) meaning:
 *  (below, unknown but to be determined, above) read as: face0 is "above" face1
 *  notice: 0 does not mean "flat, faces are same level"
 */
const walk_pleat_path = (matrix, direction, current, parent, tree = empty_tree()) => {
	if (tree[direction][current]) {
		tree[direction][current].parents[parent] = true;
		// console.log("found a loop, exiting", current, parent);
		return;
	}
	const parents = {};
	if (parent !== undefined) { parents[parent] = true; }
	const children = matrix[current]
		.map((dir, index) => dir === direction ? index : undefined)
		.filter(a => a !== undefined);
	tree[direction][current] = { parents, children };
	// set matrix for both directions between face pair
	// gather the next iteration's indices, recurse.
	children.map(child => walk_pleat_path(matrix, direction, child, current, tree));
	return tree;
};

/**
 * the matrix encodes above/below, in the flat-folded state
 */
const walk_all_pleat_paths = (matrix) => {
	const tree = empty_tree();
	[-1, 1].forEach(dir => matrix
		.forEach((_, face) => walk_pleat_path(matrix, dir, face, undefined, tree)));
	return tree;
};

const get_all_pleat_pairs = (graph, matrix) => {
	const faces_winding = makeFacesWinding(graph);
	const trees = walk_all_pleat_paths(matrix);
	[-1, 1].forEach(dir => trees[dir]
		.forEach(el => {
			const parents = Object.keys(el.parents).map(n => parseInt(n, 10));
			el.parents = parents;
		}));
	// const roots = {};
	// [-1, 1].forEach(dir => {
	//   roots[dir] = trees[dir]
	//     .map((el, face) => el.parents.length === 0 ? face : undefined)
	//     .filter(a => a !== undefined);
	//   });
	// we only need one of these branches.
	const tree = trees[1];
	const roots = tree
		.map((el, face) => (el.parents.length === 0 ? face : undefined))
		.filter(a => a !== undefined);

	// clips will be a deeply nested objects where a polygon is

	// prepare a list of all faces in the graph as lists of vertices
	// also, make sure they all have the same winding (reverse if necessary)
	const graph_polygons = graph.faces_vertices
		.map(face => face
			.map(v => graph.vertices_coords[v]));
	graph_polygons.forEach((face, i) => {
		if (!faces_winding[i]) { face.reverse(); }
	});

	const recurse = (tree, index, polygons = {}, stack = [], visited = {}) => {
		const this_polygon = graph_polygons[index];
		// polygon clip through the entire stack
		const parent_polygon = polygons[stack.join("-")];

		// add this face to the stack
		stack.push(index);
		visited[index] = true;
		// console.log("polygon intersection", stack.join("-"), parent_polygon, this_polygon);
		let new_polygon = parent_polygon
			? ear.math.intersectPolygonPolygon(parent_polygon, this_polygon)
			: this_polygon;
		// polygon doesn't exist. step forward the top pointer
		// (or, step top pointer backwards from this face)
		while (new_polygon === undefined) {
			// pop off the first face in the stack until we get a valid
			// series of intersections.
			stack.shift();
			if (stack.length < 2) { break; }
			const stack_increment = [stack[0]];
			// const new_key = stack.join("-");
			let poly = graph_polygons[stack[0]];
			for (let i = 1; i < stack.length; i += 1) {
				stack_increment.push(stack[i]);
				poly = ear.math.intersectPolygonPolygon(poly, graph_polygons[stack[i]]);
				if (poly === undefined) { break; }
			}
			new_polygon = poly;
		}

		polygons[stack.join("-")] = new_polygon;

		// console.log("recurse", index, "into children", tree[index].children);
		tree[index].children
			.filter(child => visited[child] === undefined)
			.forEach(child => recurse(tree, child, polygons, clone(stack), visited));
	};

	const polygons_dictionary = {};
	roots.forEach(root_face => recurse(tree, root_face, polygons_dictionary));

	const sequences = Object.keys(polygons_dictionary)
		.filter(key => polygons_dictionary[key].length > 0)
		.map(string => string.split("-").map(n => parseInt(n, 10)));

	const pairs = [];
	sequences.forEach(sequence => {
		const last_face = sequence.pop();
		for (let i = 0; i < sequence.length; i += 1) {
			pairs.push([sequence[i], last_face]);
		}
	});

	// console.log("tree", tree);
	// console.log("roots", roots);
	// console.log("polygons", polygons_dictionary);
	// console.log("sequences", sequences);
	// console.log("pairs", pairs);
	return pairs;
};

const make_matrix = (graph, epsilon) => {
	const matrix = [];

	const overlap_matrix = makeFacesFacesOverlap(graph, epsilon);
	const overlap_pairs = booleanMatrixToUniqueIndexPairs(overlap_matrix);
	overlap_pairs.forEach(p => {
		matrix[p[0]] = [];
		matrix[p[1]] = [];
	});
	overlap_pairs.forEach(pair => { matrix[pair[0]][pair[1]] = 0; });

	const assignment_direction = { M: 1, m: 1, V: -1, v: -1 };
	const faces_winding = makeFacesWinding(graph);

	// console.log("facesWinding", faces_winding);
	graph.edges_faces.forEach((faces, edge) => {
		const assignment = graph.edges_assignment[edge];
		const direction = assignment_direction[assignment];
		if (faces.length < 2 || direction === undefined) { return; }
		// relationship data is stored as [small index][large index]. flip if needed.
		const faces_in_order = faces[0] < faces[1];
		const upright = faces_winding[faces[0]];
		const relationship = upright ? direction : -direction;
		matrix[faces[0]][faces[1]] = relationship;
		matrix[faces[1]][faces[0]] = -relationship;
	});
	return matrix;
};

const walk_pleat_paths = (graph, matrix, epsilon = 1e-7) => {
	// if (!matrix) { matrix = make_matrix(graph, epsilon); }

	matrix = make_matrix(graph, epsilon);

	// console.log("-1", walk_pleat_path(matrix, 1, 0, -1));
	// console.log("1", walk_pleat_path(matrix, 1, 0, 1));
	// const tree = empty_tree();
	// console.log("walk_pleat_path, 0", walk_pleat_path(matrix, 1, 0, undefined, tree));
	// console.log("walk_pleat_path, 1", walk_pleat_path(matrix, 1, 1, undefined, tree));

	// console.log("matrix", matrix);
	// console.log("walk_all_pleat_paths", walk_all_pleat_paths(matrix));
	const pleat_pairs = get_all_pleat_pairs(graph, matrix);
	// console.log("get_all_pleat_pairs", pleat_pairs);
	return pleat_pairs;
};

export default walk_pleat_paths;
