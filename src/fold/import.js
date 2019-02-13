import * as Origami from "./origami";

let empty = {
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

export function svg_to_fold(svg) {
	let elements = flatten_tree(svg);
	// match this to the SVG spec
	let parseable = ["line", "rect", "path", "polyline", "circle"];
	let geometry = {};
	parseable.forEach(tag => geometry[tag] = elements.filter(e => e.tagName === tag));
	console.log(geometry);
	// for each geometry, add creases without regards to invalid planar data
	//  (intersecting lines, duplicate vertices), clean up later.
	let graph = JSON.parse(JSON.stringify(empty));
	// rectangles
	geometry.rect.forEach(rect => {
		let x = rect.x.baseVal.value;
		let y = rect.y.baseVal.value;
		let width = rect.width.baseVal.value;
		let height = rect.height.baseVal.value;
		let lines = [
			[[x,y], [x+width,y]],
			[[x+width,y], [x+width,y+height]],
			[[x+width,y+height], [x,y+height]],
			[[x,y+height], [x,y]],
		];
		lines.forEach(l => Origami.add_edge_between_points(graph, l[0][0],l[0][1], l[1][0],l[1][1]));
	});
	// circles
	let resolution = 128;
	// paths
	// polylines
	// lines
	return graph;
}

function flatten_tree(element) {
	// the container objects in SVG: group, the svg itself
	if (element.tagName === "g" || element.tagName === "svg") {
		return Array.from(element.children)
			.map(child => flatten_tree(child))
			.reduce((a,b) => a.concat(b),[]);
	}
	return [element];
}
