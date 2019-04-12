import * as Origami from "./origami";
import * as SVG from "../../include/svg";
import { segments } from "../../include/svg-segmentize";

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

export const load_fold = function(input, callback) {
	// are they giving us a filename, or the data of an already loaded file?
	if (typeof input === "string" || input instanceof String) {
		let extension = input.substr((input.lastIndexOf('.') + 1));
		// filename. we need to upload
		switch(extension) {
			case "fold":
			fetch(input)
				.then((response) => response.json)
				.then((data) => {
					if (callback != null) { callback(data); }
				});
			return;
			case "svg":
			SVG.load(input, function(svg) {
				let fold = svg_to_fold(svg);
				if (callback != null) { callback(fold); }
			});
			return;
		}
	}
	try {
		// try .fold file format first
		let fold = JSON.parse(input);
		if (callback != null) { callback(fold); }
	} catch(err) {
		console.log("not a valid .fold file format")
		// return this;
	}
}

