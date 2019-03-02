import * as Origami from "./origami";
import { segments } from "../../lib/svg-segmentize";

export function svg_to_fold(svg) {

	// for each geometry, add creases without regards to invalid planar data
	//  (intersecting lines, duplicate vertices), clean up later.
	let graph = {
		"file_spec": 1.1,
		"file_creator": "RabbitEar",
		"file_classes": ["singleModel"],
		"frame_title": "",
		"frame_classes": ["creasePattern"],
		"frame_attributes": ["2D"],
		"vertices_coords": [],
		"vertices_vertices": [],
		"vertices_faces": [],
		"edges_vertices": [],
		"edges_faces": [],
		"edges_assignment": [],
		"edges_foldAngle": [],
		"edges_length": [],
		"faces_vertices": [],
		"faces_edges": [],
	};

	segments(svg).forEach(l =>
		Origami.add_edge_between_points(graph, l[0], l[1], l[2], l[3])
	);

	return graph;
}
