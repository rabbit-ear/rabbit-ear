import * as Origami from "./origami";

const RES_CIRCLE = 64;
const RES_PATH = 64;

function flatten_tree(element) {
	// the container objects in SVG: group, the svg itself
	if (element.tagName === "g" || element.tagName === "svg") {
		return Array.from(element.children)
			.map(child => flatten_tree(child))
			.reduce((a,b) => a.concat(b),[]);
	}
	return [element];
}

/*
 * convert an SVG into line segments. include all SVG primitives
 * all line segments are encoded as 1 array of 4 numbers:
 *  [ x1, y1, x2, y2 ]
 */
function svg_line_to_segments(line) {
	return [[
		line.x1.baseVal.value,
		line.y1.baseVal.value,
		line.x2.baseVal.value,
		line.y2.baseVal.value
	]];
}
function svg_rect_to_segments(rect) {
	let x = rect.x.baseVal.value;
	let y = rect.y.baseVal.value;
	let width = rect.width.baseVal.value;
	let height = rect.height.baseVal.value;
	return [
		[x, y, x+width, y],
		[x+width, y, x+width, y+height],
		[x+width, y+height, x, y+height],
		[x, y+height, x, y]
	];
}
function svg_circle_to_segments(circle) {
	let x = circle.cx.baseVal.value;
	let y = circle.cy.baseVal.value;
	let r = circle.r.baseVal.value;
	return Array.from(Array(RES_CIRCLE))
		.map((_,i) => [x + r*Math.cos(i/RES_CIRCLE*Math.PI*2), y + r*Math.sin(i/RES_CIRCLE*Math.PI*2)])
		.map((_,i,arr) => [arr[i][0], arr[i][1], arr[(i+1)%arr.length][0], arr[(i+1)%arr.length][1]]);
}
function svg_ellipse_to_segments(ellipse) {
	let x = ellipse.cx.baseVal.value;
	let y = ellipse.cy.baseVal.value;
	let rx = ellipse.rx.baseVal.value;
	let ry = ellipse.ry.baseVal.value;
	return Array.from(Array(RES_CIRCLE))
		.map((_,i) => [x + rx*Math.cos(i/RES_CIRCLE*Math.PI*2), y + ry*Math.sin(i/RES_CIRCLE*Math.PI*2)])
		.map((_,i,arr) => [arr[i][0], arr[i][1], arr[(i+1)%arr.length][0], arr[(i+1)%arr.length][1]]);
}
function svg_polygon_to_segments(polygon) {
	return Array.from(polygon.points)
		.map(p => [p.x, p.y])
		.map((_,i,a) => [a[i][0], a[i][1], a[(i+1)%a.length][0], a[(i+1)%a.length][1]])
}
function svg_polyline_to_segments(polyline) {
	let circularPath = svg_polygon_to_segments(polyline);
	circularPath.pop();
	return circularPath;
}
function svg_path_to_segments(path) {
	let segmentLength = path.getTotalLength() / RES_PATH;
	let d = path.getAttribute("d");
	let isClosed = (d[d.length-1] === "Z" || d[d.length-1] === "z");
	let pathsPoints = Array.from(Array(RES_PATH))
		.map((_,i) => path.getPointAtLength(i*segmentLength))
		.map(p => [p.x, p.y]);
	let segments = pathsPoints.map((_,i,a) => [a[i][0], a[i][1], a[(i+1)%a.length][0], a[(i+1)%a.length][1]]);
	if (!isClosed) { segments.pop(); }
	return segments;
}

function svg_to_segments(svg) {
	let parsers = {
		"line": svg_line_to_segments,
		"rect": svg_rect_to_segments,
		"circle": svg_circle_to_segments,
		"ellipse": svg_ellipse_to_segments,
		"polygon": svg_polygon_to_segments,
		"polyline": svg_polyline_to_segments,
		"path": svg_path_to_segments
	}
	let parseable = Object.keys(parsers);
	return flatten_tree(svg)
		.filter(e => parseable.indexOf(e.tagName) !== -1)
		.map(e => parsers[e.tagName](e))
		.reduce((a,b) => a.concat(b), []);
}


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
	}

	svg_to_segments(svg).forEach(l => 
		Origami.add_edge_between_points(graph, l[0], l[1], l[2], l[3])
	);

	return graph;
}
