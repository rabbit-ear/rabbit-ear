import * as Geom from "../../include/geometry";
import { get_boundary_face } from "./graph";

// "re:construction" example
// { axiom: 2,
// 	type: "valley",
// 	direction: [0.0435722, -0.999050],
// 	edge: [[0, 0.45016], [1, 0.49377]],
// 	parameters: { marks: [[0.97319, 0.05149], [0.93478, 0.93204]] }
// };

// "re:diagrams" example (these are objects inside arrays):
// [{
// 	"re:diagram_lines": [{
// 		"re:diagram_line_classes": ["valley"],
// 		"re:diagram_line_coords": [[0,0.2], [1,0.5]]
// 	}],
// 	"re:diagram_arrows": [{
// 		"re:diagram_arrow_classes": [],
// 		"re:diagram_arrow_coords": [[0.6,0], [0.3,1]]
// 	}]
// }]

const instructions_for_axiom = {
	en:[null,
		"make a crease that passes through two points",
		"make a crease by bringing one point to another",
		"make a crease by bringing one line onto another",
		"make a crease by bringing one line onto itself and passing through a point",
		"make a crease",
		"make a crease",
		"make a crease"
	]
};

export const build_diagram_frame = function(graph) {
	let c = graph["re:construction"];
	if (c == null) {
		console.warn("couldn't build diagram. construction info doesn't exist");
		return;
	}
	switch (c.type) {
		case "flip":
			return {
				"re:diagram_arrows": [{
					"re:diagram_arrow_classes": ["flip"],
					"re:diagram_arrow_coords": []
				}],
				"re:instructions": { "en": "flip over" }
			};
			break;
		case "mountain":
		case "valley":
			return {
				"re:diagram_lines": [{
					"re:diagram_line_classes": [c.type],
					"re:diagram_line_coords": c.edge,
				}],
				"re:diagram_arrows": [{
					"re:diagram_arrow_classes": [],
					"re:diagram_arrow_coords": arrowForConstruction(c, graph)
				}],
				"re:instructions": {
					"en": instructions_for_axiom.en[c.axiom] || (c.type + " fold")
				}
			};
			break;
		default:
			return {"error": "could not determine construction type"};
			break;
	}
}


// intersect is a point on the line,
// the point which the arrow should be cast perpendicularly across
// when left undefined, intersect will be the midpoint of the line.
// const drawArrowAcross = function(crease, crossing){
const arrowForConstruction = function(construction, graph) {
	let p = construction.parameters;
	// axiom 2, simplest case
	if (construction.axiom === 2) {
		return [p.marks[1], p.marks[0]];
	}

	let crease_vector = [
		construction.edge[1][0] - construction.edge[0][0],
		construction.edge[1][1] - construction.edge[0][1]
	];
	let arrow_vector = construction.direction;
	let crossing;
	switch (construction.axiom) {
		case 4: 
			crossing = Geom.core.intersection.nearest_point(
				construction.edge[0], crease_vector, p.lines[0][0], ((a)=>a));
			break;
		case 7:
			crossing = Geom.core.intersection.nearest_point(
				construction.edge[0], crease_vector, p.marks[0], ((a)=>a));
			break;
		default:
				crossing = Geom.core.average(construction.edge);
				break;
	}
	let perpLine = { point: crossing, vector: arrow_vector };

	let boundary = get_boundary_face(graph).vertices
		.map(v => graph.vertices_coords[v]);
	let perpClipEdge = Geom.core.intersection.clip_line_in_convex_poly(
		boundary, crossing, arrow_vector);
	if (perpClipEdge === undefined) {
		// todo: something is causing this to happen. when you flip over the page, far from where it started, then perform folds. when your fold starts and ends outside the bounds of the piece on one side of it.
		return [];
	}
	let short_length = [perpClipEdge[0], perpClipEdge[1]]
		.map(n => Geom.core.distance2(n, crossing))
		.sort((a,b) => a-b)
		.shift();
	if (construction.axiom === 7) {
		short_length = Geom.core.distance2(p.marks[0], crossing);
	}
	let short_vector = arrow_vector.map(v => v * short_length);
	return [
		crossing.map((c, i) => c - short_vector[i]),
		crossing.map((c, i) => c + short_vector[i])
	];
}
