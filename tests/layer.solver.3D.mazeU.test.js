import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

// 303 pairs of collinear edges (both edges with two faces)
// which overlap by a positive length. [edge, edge]
const EDGE_PAIRS = [
	[36, 54], [36, 56], [37, 38], [37, 63], [37, 66], [37, 73], [37, 74], [38, 63], [38, 66], [38, 73],
	[38, 74], [39, 67], [39, 68], [39, 69], [39, 70], [39, 71], [40, 99], [40, 101], [40, 121], [41, 42],
	[41, 100], [41, 102], [41, 117], [41, 119], [42, 100], [42, 102], [42, 117], [42, 119], [49, 50], [49, 82],
	[49, 85], [50, 82], [50, 85], [51, 52], [51, 136], [51, 137], [52, 136], [52, 137], [53, 135], [54, 56],
	[55, 57], [55, 75], [57, 75], [58, 59], [58, 60], [58, 61], [58, 62], [58, 72], [59, 60], [59, 61],
	[59, 62], [59, 72], [60, 61], [60, 62], [60, 72], [61, 62], [61, 72], [62, 72], [63, 66], [63, 73],
	[63, 74], [66, 73], [66, 74], [67, 68], [67, 69], [67, 70], [67, 71], [68, 69], [68, 70], [68, 71],
	[69, 70], [69, 71], [70, 71], [73, 74], [76, 77], [76, 84], [77, 84], [78, 79], [78, 83], [79, 83],
	[82, 85], [86, 103], [87, 125], [88, 95], [89, 90], [91, 92], [91, 93], [91, 94], [91, 108], [91, 109],
	[91, 110], [91, 111], [91, 123], [91, 124], [92, 93], [92, 94], [92, 108], [92, 109], [92, 110], [92, 111],
	[92, 123], [92, 124], [93, 94], [93, 108], [93, 109], [93, 110], [93, 111], [93, 123], [93, 124], [94, 108],
	[94, 109], [94, 110], [94, 111], [94, 123], [94, 124], [96, 113], [97, 114], [98, 120], [99, 101], [99, 121],
	[100, 102], [100, 117], [100, 119], [101, 121], [102, 117], [102, 119], [104, 128], [105, 112], [106, 107], [108, 109],
	[108, 110], [108, 111], [108, 123], [108, 124], [109, 110], [109, 111], [109, 123], [109, 124], [110, 111], [110, 123],
	[110, 124], [111, 123], [111, 124], [115, 122], [115, 193], [115, 215], [116, 118], [116, 121], [117, 119], [118, 121],
	[122, 193], [122, 215], [123, 124], [126, 127], [126, 129], [127, 129], [131, 149], [131, 151], [132, 133], [132, 158],
	[132, 161], [132, 168], [132, 169], [133, 158], [133, 161], [133, 168], [133, 169], [134, 162], [134, 163], [134, 164],
	[134, 165], [134, 166], [136, 137], [144, 145], [144, 177], [144, 180], [145, 177], [145, 180], [146, 147], [146, 195],
	[146, 197], [146, 212], [146, 214], [147, 195], [147, 197], [147, 212], [147, 214], [148, 211], [148, 213], [148, 216],
	[149, 151], [150, 152], [150, 170], [152, 170], [153, 154], [153, 155], [153, 156], [153, 157], [153, 167], [154, 155],
	[154, 156], [154, 157], [154, 167], [155, 156], [155, 157], [155, 167], [156, 157], [156, 167], [157, 167], [158, 161],
	[158, 168], [158, 169], [161, 168], [161, 169], [162, 163], [162, 164], [162, 165], [162, 166], [163, 164], [163, 165],
	[163, 166], [164, 165], [164, 166], [165, 166], [168, 169], [171, 172], [171, 179], [172, 179], [173, 174], [173, 178],
	[174, 178], [177, 180], [181, 198], [182, 220], [183, 190], [184, 185], [186, 187], [186, 188], [186, 189], [186, 203],
	[186, 204], [186, 205], [186, 206], [186, 218], [186, 219], [187, 188], [187, 189], [187, 203], [187, 204], [187, 205],
	[187, 206], [187, 218], [187, 219], [188, 189], [188, 203], [188, 204], [188, 205], [188, 206], [188, 218], [188, 219],
	[189, 203], [189, 204], [189, 205], [189, 206], [189, 218], [189, 219], [191, 208], [192, 209], [193, 215], [194, 196],
	[194, 216], [195, 197], [195, 212], [195, 214], [196, 216], [197, 212], [197, 214], [199, 223], [200, 207], [201, 202],
	[203, 204], [203, 205], [203, 206], [203, 218], [203, 219], [204, 205], [204, 206], [204, 218], [204, 219], [205, 206],
	[205, 218], [205, 219], [206, 218], [206, 219], [210, 217], [211, 213], [211, 216], [212, 214], [213, 216], [218, 219],
	[221, 222], [221, 224], [222, 224],
];

// 64 cases of a 3D edge crossing the interior of a face.
// [edge, tortilla (the face being crossed), coplanar (the edge's face in the
// tortilla's plane), angled (the edge's other face)]
const EDGE_FACE = [
	[39, 17, 6, 10], [58, 17, 4, 31], [59, 17, 5, 12], [60, 17, 11, 13], [61, 17, 16, 14], [62, 17, 18, 15],
	[67, 17, 18, 21], [68, 17, 22, 23], [69, 17, 26, 28], [70, 17, 30, 29], [71, 17, 35, 33], [72, 17, 6, 7],
	[91, 42, 40, 47], [91, 51, 40, 47], [92, 42, 39, 46], [92, 51, 39, 46], [93, 42, 48, 49], [93, 51, 48, 49],
	[94, 42, 4, 31], [94, 51, 4, 31], [108, 42, 57, 60], [108, 51, 57, 60], [109, 42, 58, 61], [109, 51, 58, 61],
	[110, 42, 62, 50], [110, 51, 62, 50], [111, 42, 6, 7], [111, 51, 6, 7], [123, 42, 43, 44], [123, 51, 43, 44],
	[124, 42, 41, 45], [124, 51, 41, 45], [134, 74, 6, 64], [153, 74, 35, 33], [154, 74, 63, 69], [155, 74, 67, 70],
	[156, 74, 73, 71], [157, 74, 72, 68], [162, 74, 72, 78], [163, 74, 79, 77], [164, 74, 82, 85], [165, 74, 86, 84],
	[166, 74, 90, 87], [167, 74, 6, 10], [186, 93, 59, 98], [186, 101, 59, 98], [187, 93, 58, 97], [187, 101, 58, 97],
	[188, 93, 62, 99], [188, 101, 62, 99], [189, 93, 6, 64], [189, 101, 6, 64], [203, 93, 105, 107], [203, 101, 105, 107],
	[204, 93, 106, 108], [204, 101, 106, 108], [205, 93, 109, 100], [205, 101, 109, 100], [206, 93, 90, 87], [206, 101, 90, 87],
	[218, 93, 94, 95], [218, 101, 94, 95], [219, 93, 92, 96], [219, 101, 92, 96],
];

// 60 faceOrders (FOLD spec) implied by EDGE_FACE.
// the angled face leaves the plane from the coplanar face's layer, so the
// tortilla must be on the opposite side of the coplanar face.
const EDGE_FACE_ORDERS = [
	[4, 17, 1], [4, 42, -1], [4, 51, 1], [5, 17, 1], [6, 17, 1], [6, 42, -1], [6, 51, 1], [6, 74, 1],
	[6, 93, -1], [6, 101, 1], [11, 17, 1], [16, 17, 1], [17, 18, 1], [17, 22, 1], [17, 26, -1], [17, 30, 1],
	[17, 35, -1], [35, 74, 1], [39, 42, -1], [39, 51, 1], [40, 42, -1], [40, 51, 1], [41, 42, -1], [41, 51, 1],
	[42, 43, -1], [42, 48, 1], [42, 57, 1], [42, 58, -1], [42, 62, 1], [43, 51, 1], [48, 51, 1], [51, 57, 1],
	[51, 58, -1], [51, 62, 1], [58, 93, -1], [58, 101, 1], [59, 93, -1], [59, 101, 1], [62, 93, -1], [62, 101, 1],
	[63, 74, 1], [67, 74, 1], [72, 74, 1], [73, 74, 1], [74, 79, 1], [74, 82, -1], [74, 86, 1], [74, 90, -1],
	[90, 93, -1], [90, 101, 1], [92, 93, -1], [92, 101, 1], [93, 94, -1], [93, 105, 1], [93, 106, -1], [93, 109, 1],
	[94, 101, 1], [101, 105, 1], [101, 106, -1], [101, 109, 1],
];

// 82 edge pairs, two 3D edges, one face from each is stacked,
// the other two faces are coplanar but not stacked. [edge, edge]
const T_JUNCTIONS = [
	[39, 68], [39, 69], [39, 70], [39, 71], [58, 62], [58, 72], [59, 62], [59, 72], [60, 62], [60, 72],
	[61, 62], [61, 72], [67, 68], [67, 69], [67, 70], [67, 71], [91, 108], [91, 109], [91, 110], [91, 111],
	[91, 124], [92, 108], [92, 109], [92, 110], [92, 111], [92, 124], [93, 108], [93, 109], [93, 110], [93, 111],
	[93, 124], [94, 108], [94, 109], [94, 110], [94, 111], [94, 124], [108, 123], [109, 123], [110, 123], [111, 123],
	[123, 124], [134, 163], [134, 164], [134, 165], [134, 166], [153, 157], [153, 167], [154, 157], [154, 167], [155, 157],
	[155, 167], [156, 157], [156, 167], [162, 163], [162, 164], [162, 165], [162, 166], [186, 203], [186, 204], [186, 205],
	[186, 206], [186, 219], [187, 203], [187, 204], [187, 205], [187, 206], [187, 219], [188, 203], [188, 204], [188, 205],
	[188, 206], [188, 219], [189, 203], [189, 204], [189, 205], [189, 206], [189, 219], [203, 218], [204, 218], [205, 218],
	[206, 218], [218, 219],
];

// 79 faceOrders (FOLD spec) implied by T_JUNCTIONS: of the two stacked
// faces, the one whose partner face is reached first, rotating from the
// stacked direction towards the lower face's normal, is on top.
const T_JUNCTION_ORDERS = [
	[7, 12, 1], [7, 13, -1], [7, 14, 1], [7, 31, -1], [7, 44, -1], [7, 46, -1], [7, 47, 1], [7, 49, 1],
	[10, 23, 1], [10, 28, -1], [10, 29, 1], [10, 33, -1], [10, 69, 1], [10, 70, -1], [10, 71, 1], [12, 15, 1],
	[13, 15, 1], [14, 15, 1], [15, 31, -1], [21, 23, 1], [21, 28, -1], [21, 29, 1], [21, 33, -1], [31, 45, -1],
	[31, 50, 1], [31, 60, 1], [31, 61, -1], [33, 68, 1], [44, 45, -1], [44, 50, 1], [44, 60, 1], [44, 61, -1],
	[45, 46, -1], [45, 47, 1], [45, 49, 1], [46, 50, 1], [46, 60, 1], [46, 61, -1], [47, 50, 1], [47, 60, 1],
	[47, 61, -1], [49, 50, 1], [49, 60, 1], [49, 61, -1], [64, 77, 1], [64, 84, 1], [64, 85, -1], [64, 87, -1],
	[64, 96, -1], [64, 100, 1], [64, 107, 1], [64, 108, -1], [68, 69, 1], [68, 70, -1], [68, 71, 1], [77, 78, 1],
	[78, 84, 1], [78, 85, -1], [78, 87, -1], [87, 95, -1], [87, 97, -1], [87, 98, 1], [87, 99, 1], [95, 96, -1],
	[95, 100, 1], [95, 107, 1], [95, 108, -1], [96, 97, -1], [96, 98, 1], [96, 99, 1], [97, 100, 1], [97, 107, 1],
	[97, 108, -1], [98, 100, 1], [98, 107, 1], [98, 108, -1], [99, 100, 1], [99, 107, 1], [99, 108, -1],
];

// 16 edge pairs, a 180 degree fold (taco) and a 3D fold whose
// coplanar face (tortilla) is stacked with the taco. the tortilla may not
// lie between the two taco faces. [[edge, edge], [taco, taco], tortilla]
const TACO_TORTILLAS = [
	[[37, 63], [12, 31], 32], [[37, 73], [12, 31], 9], [[38, 63], [7, 8], 32],
	[[38, 73], [7, 8], 9], [[63, 66], [15, 34], 32], [[63, 74], [29, 33], 21],
	[[66, 73], [15, 34], 9], [[73, 74], [29, 33], 10], [[132, 158], [33, 69], 88],
	[[132, 168], [33, 69], 66], [[133, 158], [10, 65], 88], [[133, 168], [10, 65], 66],
	[[158, 161], [68, 89], 88], [[158, 169], [84, 87], 78], [[161, 168], [68, 89], 66],
	[[168, 169], [84, 87], 64],
];

// 70 edge pairs, two 3D folds with the same fold angle whose faces are
// stacked on both sides. [[edge, edge], [a, b], [c, d], k] where the
// faceOrder between a and b is k times the faceOrder between c and d.
const TORTILLA_TORTILLAS = [
	[[39, 67], [6, 18], [10, 21], 1], [[58, 59], [4, 5], [12, 31], 1], [[58, 60], [4, 11], [13, 31], -1],
	[[58, 61], [4, 16], [14, 31], 1], [[59, 60], [5, 11], [12, 13], 1], [[59, 61], [5, 16], [12, 14], 1],
	[[60, 61], [11, 16], [13, 14], 1], [[62, 72], [7, 15], [6, 18], 1], [[63, 73], [10, 21], [9, 32], 1],
	[[68, 69], [22, 26], [23, 28], 1], [[68, 70], [22, 30], [23, 29], 1], [[68, 71], [22, 35], [23, 33], 1],
	[[69, 70], [26, 30], [28, 29], 1], [[69, 71], [26, 35], [28, 33], 1], [[70, 71], [29, 33], [30, 35], 1],
	[[91, 92], [39, 40], [46, 47], 1], [[91, 93], [40, 48], [47, 49], 1], [[91, 94], [4, 40], [31, 47], 1],
	[[91, 123], [40, 43], [44, 47], 1], [[92, 93], [39, 48], [46, 49], 1], [[92, 94], [4, 39], [31, 46], 1],
	[[92, 123], [39, 43], [44, 46], -1], [[93, 94], [4, 48], [31, 49], 1], [[93, 123], [43, 48], [44, 49], 1],
	[[94, 123], [4, 43], [31, 44], 1], [[108, 109], [57, 58], [60, 61], 1], [[108, 110], [57, 62], [50, 60], -1],
	[[108, 111], [6, 57], [7, 60], 1], [[108, 124], [41, 57], [45, 60], 1], [[109, 110], [58, 62], [50, 61], 1],
	[[109, 111], [6, 58], [7, 61], 1], [[109, 124], [41, 58], [45, 61], 1], [[110, 111], [7, 50], [6, 62], 1],
	[[110, 124], [45, 50], [41, 62], 1], [[111, 124], [6, 41], [7, 45], 1], [[134, 162], [6, 72], [64, 78], 1],
	[[153, 154], [33, 69], [35, 63], 1], [[153, 155], [33, 70], [35, 67], 1], [[153, 156], [33, 71], [35, 73], 1],
	[[154, 155], [63, 67], [69, 70], 1], [[154, 156], [63, 73], [69, 71], 1], [[155, 156], [67, 73], [70, 71], 1],
	[[157, 167], [10, 68], [6, 72], 1], [[158, 168], [64, 78], [66, 88], 1], [[163, 164], [77, 85], [79, 82], 1],
	[[163, 165], [77, 84], [79, 86], 1], [[163, 166], [77, 87], [79, 90], 1], [[164, 165], [82, 86], [84, 85], 1],
	[[164, 166], [82, 90], [85, 87], 1], [[165, 166], [84, 87], [86, 90], 1], [[186, 187], [58, 59], [97, 98], 1],
	[[186, 188], [59, 62], [98, 99], 1], [[186, 189], [6, 59], [64, 98], 1], [[186, 218], [59, 94], [95, 98], 1],
	[[187, 188], [58, 62], [97, 99], 1], [[187, 189], [6, 58], [64, 97], 1], [[187, 218], [58, 94], [95, 97], -1],
	[[188, 189], [6, 62], [64, 99], 1], [[188, 218], [62, 94], [95, 99], 1], [[189, 218], [6, 94], [64, 95], 1],
	[[203, 204], [105, 106], [107, 108], 1], [[203, 205], [105, 109], [100, 107], -1], [[203, 206], [90, 105], [87, 107], 1],
	[[203, 219], [92, 105], [96, 107], 1], [[204, 205], [106, 109], [100, 108], 1], [[204, 206], [90, 106], [87, 108], 1],
	[[204, 219], [92, 106], [96, 108], 1], [[205, 206], [87, 100], [90, 109], 1], [[205, 219], [96, 100], [92, 109], 1],
	[[206, 219], [87, 96], [90, 92], 1],
];

const FOLD = JSON.parse(fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8"));
const { faceOrders: _, ...folded } = ear.graph.getFramesByClassName(FOLD, "foldedForm")[0];
const graph = structuredClone(folded);
ear.graph.populate(graph);
const normals = ear.graph.makeFacesNormal(graph);
const clusterInfo = ear.layer.constraints3DFaceClusters(graph);
const { faces_winding } = clusterInfo;

const sign = (n) => (n > 0) - (n < 0);
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// sort arrays (of arrays) lexicographically, so lists can be compared as sets
const compare = (a, b) => {
	if (!Array.isArray(a)) {
		return a - b;
	}
	for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
		const c = compare(a[i], b[i]);
		if (c !== 0) {
			return c;
		}
	}
	return a.length - b.length;
};
const sorted = (array) => array.slice().sort(compare);
const sortedPair = ([a, b]) => (a < b ? [a, b] : [b, a]);

/**
 * @description rewrite a FOLD faceOrder [a, b, s] so that a < b.
 * "a is on side s of b along b's normal" means "b is on side -s of a along
 * b's normal", which along a's normal is flipped again if the normals oppose.
 */
const canonical = ([a, b, s]) =>
	a < b ? [a, b, s] : [b, a, -s * sign(dot3(normals[a], normals[b]))];

// convert solver orders ("a b": 1 or 2) into canonical FOLD faceOrders
const solverToFaceOrders = (orders) =>
	sorted(ear.layer.solverOrdersToFaceOrders(orders, faces_winding).map(canonical));

/**
 * @description convert a solver tortilla-tortilla constraint [A, B, X, Y]
 * (the solver's "A above X" equals its "B above Y", relative to each plane's
 * chosen normal) into the form [[a, b], [c, d], k] used by TORTILLA_TORTILLAS.
 */
const solverTortillaTortilla = ([A, B, X, Y]) => {
	const winding = (f) => (faces_winding[f] ? 1 : -1);
	const p = canonical([A, X, 1]);
	const q = canonical([B, Y, 1]);
	const k = winding(X) * winding(Y) * p[2] * q[2];
	const [P, Q] = sorted([p.slice(0, 2), q.slice(0, 2)]);
	return [P, Q, k];
};

const expectedTortillaTortillas = sorted(
	TORTILLA_TORTILLAS.map(([, P, Q, k]) => [...sorted([P, Q]), k]),
);

// all pairs of collinear overlapping edges, only including edges with two faces
const libraryEdgePairs = () => {
	const edges_vertices = graph.edges_vertices.slice();
	graph.edges_faces.forEach((faces, e) => {
		if (faces.length !== 2) {
			delete edges_vertices[e];
		}
	});
	const overlap = ear.graph.getEdgesEdgesCollinearOverlap({
		vertices_coords: graph.vertices_coords,
		edges_vertices,
	});
	return ear.graph.connectedComponentsPairs(overlap);
};

test("maze-u, collinear overlapping edge pairs", () => {
	expect(sorted(libraryEdgePairs())).toEqual(sorted(EDGE_PAIRS));
});

test("maze-u, edge pair classification", () => {
	const edgePairs = libraryEdgePairs();
	const classes = ear.layer.getSolvable3DEdgePairs({
		edges_faces: graph.edges_faces,
		faces_plane: clusterInfo.faces_plane,
		edgePairs,
		facesFacesLookup: ear.general.arrayArrayToLookupArray(clusterInfo.facesFacesOverlap),
	});
	const pairsOf = (key) => sorted(classes[key].map((i) => edgePairs[i]));
	expect(pairsOf("tJunctions")).toEqual(sorted(T_JUNCTIONS));
	expect(pairsOf("yJunctions")).toEqual([]);
	expect(pairsOf("bentFlatTortillas")).toEqual([]);
	expect(pairsOf("bentTortillas")).toEqual(sorted(TORTILLA_TORTILLAS.map(([edges]) => edges)));
	expect(pairsOf("bentTortillasFlatTaco")).toEqual(
		sorted(TACO_TORTILLAS.map(([edges]) => edges)),
	);
});

test("maze-u, 3D edges crossing the interior of a face", () => {
	const overlaps = ear.layer.getOverlapFacesWith3DEdge(graph, clusterInfo);
	expect(
		sorted(overlaps.map(({ edge, tortilla, coplanar, angled }) => [edge, tortilla, coplanar, angled])),
	).toEqual(sorted(EDGE_FACE));
});

test("maze-u, orders from 3D edges crossing the interior of a face", () => {
	const overlaps = ear.layer.getOverlapFacesWith3DEdge(graph, clusterInfo);
	const orders = ear.layer.solveOverlapFacesWith3DEdge(graph, overlaps, faces_winding);
	expect(solverToFaceOrders(orders)).toEqual(sorted(EDGE_FACE_ORDERS));
});

test("maze-u, constraints3DEdges orders, taco-tortillas, tortilla-tortillas", () => {
	const { orders, taco_tortilla, tortilla_tortilla } = ear.layer.constraints3DEdges(
		graph,
		clusterInfo,
	);
	expect(solverToFaceOrders(orders)).toEqual(sorted(T_JUNCTION_ORDERS));
	// [taco, tortilla, taco]
	expect(sorted(taco_tortilla.map(([a, t, b]) => [sortedPair([a, b]), t]))).toEqual(
		sorted(TACO_TORTILLAS.map(([, taco, tortilla]) => [taco, tortilla])),
	);
	expect(sorted(tortilla_tortilla.map(solverTortillaTortilla))).toEqual(
		expectedTortillaTortillas,
	);
});

test("maze-u, makeSolverConstraints3D keeps all of the above", () => {
	const { orders, constraints } = ear.layer.makeSolverConstraints3D(graph);
	const faceOrders = solverToFaceOrders(orders).map((o) => JSON.stringify(o));
	[...EDGE_FACE_ORDERS, ...T_JUNCTION_ORDERS].forEach((order) =>
		expect(faceOrders).toContain(JSON.stringify(order)),
	);
	const tacoTortillas = constraints.taco_tortilla.map(([a, t, b]) =>
		JSON.stringify([sortedPair([a, b]), t]),
	);
	TACO_TORTILLAS.forEach(([, taco, tortilla]) =>
		expect(tacoTortillas).toContain(JSON.stringify([taco, tortilla])),
	);
	const tortillaTortillas = constraints.tortilla_tortilla
		.map(solverTortillaTortilla)
		.map((c) => JSON.stringify(c));
	expectedTortillaTortillas.forEach((c) =>
		expect(tortillaTortillas).toContain(JSON.stringify(c)),
	);
});

test("maze-u, every layer3D solution satisfies all of the above", () => {
	const solution = ear.layer.layer3D(folded);
	// every branch is an independent binary choice, visit every combination
	const choices = solution.count().map(({ choices }) => choices);
	expect(choices).toEqual([2, 2, 2, 2, 2, 2]);
	const patterns = Array.from({ length: 2 ** choices.length }, (_, n) =>
		choices.map((__, i) => (n >> i) & 1),
	);
	patterns.forEach((pattern) => {
		const lookup = {};
		solution.faceOrders(...pattern).map(canonical).forEach(([a, b, s]) => {
			lookup[`${a} ${b}`] = s;
		});
		// the FOLD order of a relative to b: a is on side s of b, along b's normal
		const side = (a, b) =>
			a < b
				? lookup[`${a} ${b}`]
				: -lookup[`${b} ${a}`] * sign(dot3(normals[a], normals[b]));

		[...EDGE_FACE_ORDERS, ...T_JUNCTION_ORDERS].forEach(([a, b, s]) =>
			expect([pattern, a, b, side(a, b)]).toEqual([pattern, a, b, s]),
		);
		// the tortilla is not between the taco faces: both taco faces are on
		// the same side of the tortilla
		TACO_TORTILLAS.forEach(([, [t1, t2], tortilla]) =>
			expect([pattern, tortilla, side(t1, tortilla)]).toEqual([
				pattern,
				tortilla,
				side(t2, tortilla),
			]),
		);
		TORTILLA_TORTILLAS.forEach(([, [a, b], [c, d], k]) =>
			expect([pattern, a, b, side(a, b)]).toEqual([pattern, a, b, k * side(c, d)]),
		);
	});
});
