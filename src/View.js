/** .FOLD file viewer
 * this is an SVG based front-end for the .fold file format
 *  (.fold file spec: https://github.com/edemaine/fold)
 *
 *  View constructor arguments:
 *   - fold file
 *   - DOM object, or "string" DOM id to attach to
 */

const CREASE_DIR = {
	"B": "boundary", "b": "boundary",
	"M": "mountain", "m": "mountain",
	"V": "valley",   "v": "valley",
	"F": "mark",     "f": "mark",
	"U": "mark",     "u": "mark"
};

import "./CreasePattern";
import * as Geom from "../lib/geometry";
import * as SVG from "../lib/svg";
import * as Graph from "./fold/graph";
import * as Origami from "./fold/origami";
import * as Import from "./fold/import";
import { flatten_frame } from "./fold/file";
import CreasePattern from "./CreasePattern";

export default function() {

	let canvas = SVG.Image(...arguments);
	//  from arguments, get a fold file, if it exists
	let _cp = CreasePattern(...arguments);
	// tie handler from crease pattern
	_cp.onchange = function() {
		draw();
	}

	// prepare SVG
	let groups = {
		boundary: SVG.group(undefined, "boundary"),
		faces: SVG.group(undefined, "faces"),
		creases: SVG.group(undefined, "creases"),
		vertices: SVG.group(undefined, "vertices"),
	};
	canvas.svg.appendChild(groups.boundary);
	canvas.svg.appendChild(groups.faces);
	canvas.svg.appendChild(groups.creases);
	canvas.svg.appendChild(groups.vertices);

	// view properties
	let style = {
		vertex:{ radius: 0.01 },  // radius, percent of page
	};
	let frame;

	const drawFolded = function(graph) {
		// gather components
		let verts = graph.vertices_coords;
		// let edges = graph.edges_vertices.map(ev => ev.map(v => verts[v]));
		// let eAssignments = graph.edges_assignment.map(a => CREASE_DIR["F"]);
		let fAssignments = graph.faces_vertices.map(fv => "folded-face");
		// todo: ask if faces V or faces E doesn't exist, grab available one
		let facesV = graph.faces_vertices
			.map(fv => fv.map(v => verts[v]))
			.map(face => Geom.Polygon(face));
		let boundary = Graph.get_boundary_vertices(graph)
			.map(v => graph.vertices_coords[v])
		
		// clear layers
		Object.keys(groups).forEach((key) => SVG.removeChildren(groups[key]));
		// boundary
		// SVG.polygon(boundary, "boundary", null, groups.boundary);
		// // vertices
		// verts.forEach((v,i) => SVG.circle(v[0], v[1], style.vertex.radius, "vertex", ""+i, groups.vertices));
		// // edges
		// edges.forEach((e,i) =>
		// 	SVG.line(e[0][0], e[0][1], e[1][0], e[1][1], eAssignments[i], ""+i, groups.creases)
		// );
		// faces
		if (graph["re:faces_layer"] && graph["re:faces_layer"].length > 0) {
			graph["re:faces_layer"].forEach((fi,i) =>
				SVG.polygon(facesV[fi].points, i%2==0 ? "face-front" : "face-back", "face", groups.faces)
			);
		} else if (graph.facesOrder && graph.facesOrder.length > 0) {

		} else {
			facesV.forEach((face, i) =>
				SVG.polygon(face.points, fAssignments[i], "face", groups.faces)
			);
		}
	}
	const drawCP = function(graph) {
		// gather components
		let verts = graph.vertices_coords;
		let edges = graph.edges_vertices.map(ev => ev.map(v => verts[v]));
		let eAssignments = graph.edges_assignment.map(a => CREASE_DIR[a]);
		let fAssignments = graph.faces_vertices.map(fv => "face");
		let facesV = !(graph.faces_vertices) ? [] : graph.faces_vertices
			.map(fv => fv.map(v => verts[v]))
			.map(face => Geom.Polygon(face));
		let facesE = !(graph.faces_edges) ? [] : graph.faces_edges
			.map(face_edges => face_edges
				.map(edge => graph.edges_vertices[edge])
				.map((vi,i,arr) => {
					let next = arr[(i+1)%arr.length];
					return (vi[1] === next[0] || vi[1] === next[1]
						? vi[0] : vi[1]);
				}).map(v => graph.vertices_coords[v])
			)
			.map(face => Geom.Polygon(face));
		let boundary = Graph.get_boundary_vertices(graph)
			.map(v => graph.vertices_coords[v])
		
		facesV = facesV.map(face => face.scale(0.6666));
		facesE = facesE.map(face => face.scale(0.8333));
		// clear layers
		Object.keys(groups).forEach((key) => SVG.removeChildren(groups[key]));
		// boundary
		SVG.polygon(boundary, "boundary", null, groups.boundary);
		// vertices
		verts.forEach((v,i) => SVG.circle(v[0], v[1], style.vertex.radius, "vertex", ""+i, groups.vertices));
		// edges
		edges.forEach((e,i) =>
			SVG.line(e[0][0], e[0][1], e[1][0], e[1][1], eAssignments[i], ""+i, groups.creases)
		);
		// faces
		facesV.filter(f => f != null).forEach((face, i) =>
			SVG.polygon(face.points, fAssignments[i], "face", groups.faces)
		);
		facesE.filter(f => f != null).forEach((face, i) =>
			SVG.polygon(face.points, fAssignments[i], "face", groups.faces)
		);
	}

	const draw = function() {
		if (_cp.vertices_coords == null){ return; }
		let graph = frame ? flatten_frame(_cp, frame) : _cp;
		if (isFolded()) {
			drawFolded(graph);
		} else{
			drawCP(graph);
		}
		updateViewBox();
	}
	
	const updateViewBox = function() {
		// calculate bounds
		let xSorted = _cp.vertices_coords.slice().sort((a,b) => a[0] - b[0]);
		let ySorted = _cp.vertices_coords.slice().sort((a,b) => a[1] - b[1]);
		let boundsX = xSorted.shift()[0];
		let boundsY = ySorted.shift()[1];
		let boundsW = xSorted.pop()[0] - boundsX;
		let boundsH = ySorted.pop()[1] - boundsY;
		let isInvalid = isNaN(boundsX) || isNaN(boundsY) ||
		                isNaN(boundsW) || isNaN(boundsH);
		if (isInvalid) {
			SVG.setViewBox(canvas.svg, 0, 0, 1, 1);
		} else{
			SVG.setViewBox(canvas.svg, boundsX, boundsY, boundsW, boundsH);
		}
	}

	const nearest = function() {
		let point = Geom.Vector(...arguments);
		let nearestVertex = _cp.nearestVertex(point[0], point[1]);
		let nearestEdge = _cp.nearestEdge(point[0], point[1]);
		let nearestFace = _cp.nearestFace(point[0], point[1]);

		let nearest = {};

		if (nearestVertex != null) {
			nearestVertex.svg = groups.vertices.childNodes[nearestVertex.index];
			nearest.vertex = nearestVertex;
		}
		if (nearestEdge != null) {
			nearestEdge.svg = groups.creases.childNodes[nearestEdge.index];
			nearest.edge = nearestEdge;
		}
		if (nearestFace != null) {
			nearestFace.svg = groups.faces.childNodes[nearestFace.index];
			nearest.face = nearestFace;
		}

		return nearest;

		// var junction = (node != undefined) ? node.junction() : undefined;
		// if(junction === undefined){
		// 	var sortedJunction = this.junctions
		// 		.map(function(el){ return {'junction':el, 'distance':point.distanceTo(el.origin)};},this)
		// 		.sort(function(a,b){return a['distance']-b['distance'];})
		// 		.shift();
		// 	junction = (sortedJunction !== undefined) ? sortedJunction['junction'] : undefined
		// }

		// var sector = (junction !== undefined) ? junction.sectors.filter(function(el){
		// 	return el.contains(point);
		// },this).shift() : undefined;
	}

	const save = function() {

	}

	const load = function(input, callback) { // epsilon
		// are they giving us a filename, or the data of an already loaded file?
		if (typeof input === "string" || input instanceof String) {
			let extension = input.substr((input.lastIndexOf('.') + 1));
			// filename. we need to upload
			switch(extension) {
				case "fold":
				fetch(input)
					.then((response) => response.json)
					.then((data) => {
						_cp = CreasePattern(data);
						draw();
						if (callback != null) { callback(_cp); }
					});
				return;
				case "svg":
				SVG.load(input, function(svg) {
					_cp = CreasePattern(Import.svg_to_fold(svg));
					draw();
					if (callback != null) { callback(_cp); }
				});
				return;
			}
		}
		try {
			// try .fold file format first
			let foldFileImport = JSON.parse(input);
			_cp = CreasePattern(foldFileImport);
			// return this;
		} catch(err) {
			console.log("not a valid .fold file format")
			// return this;
		}
	}
	const isFolded = function() {
		// try to discern folded state
		if (_cp == null || _cp.frame_classes == null) { return false; }
		return _cp.frame_classes.includes("foldedState");
	}

	const makeVertices = function() {
		return _cp.vertices_coords == null
			? []
			: _cp.vertices_coords.map(v => Geom.Vector(v));
	}
	const makeEdges = function() {
		return _cp.edges_vertices == null
			? []
			: _cp.edges_vertices
				.map(e => e.map(ev => _cp.vertices_coords[ev]))
				.map(e => Geom.Edge(e));
	}
	const makeFaces = function() {
		return _cp.faces_vertices == null
			? []
			: _cp.faces_vertices
				.map(f => f.map(fv => _cp.vertices_coords[fv]))
				.map(f => Geom.Polygon(f));
	}

	const showVertices = function(){ groups.vertices.removeAttribute("visibility");}
	const hideVertices = function(){ groups.vertices.setAttribute("visibility", "hidden");}
	const showEdges = function(){ groups.creases.removeAttribute("visibility");}
	const hideEdges = function(){ groups.creases.setAttribute("visibility", "hidden");}
	const showFaces = function(){ groups.faces.removeAttribute("visibility");}
	const hideFaces = function(){ groups.faces.setAttribute("visibility", "hidden");}

	function addClass(node, className) { SVG.addClass(node, className); }
	function removeClass(node, className) { SVG.removeClass(node, className); }

	const clear = function() {
		// todo: remove all creases from current CP, leave the boundary.
	}

	const crease = function(a, b, c, d){
		// Folder.
	}
	
	const fold = function(face){
		let folded = Origami.fold_without_layering(_cp, face);
		_cp = CreasePattern(folded);
		draw();
	}
	// crease pattern functions for convenience
	const axiom1 = function() { return _cp.axiom1(...arguments); }
	const axiom2 = function() { return _cp.axiom2(...arguments); }
	const axiom3 = function() { return _cp.axiom3(...arguments); }
	const axiom4 = function() { return _cp.axiom4(...arguments); }
	const axiom5 = function() { return _cp.axiom5(...arguments); }
	const axiom6 = function() { return _cp.axiom6(...arguments); }
	const axiom7 = function() { return _cp.axiom7(...arguments); }

	// init this object
	draw();

	// return Object.freeze({
	return {
		get mouse() { return canvas.mouse; },
		set cp(c){
			_cp = c;
			draw();
			_cp.onchange = function() {
				draw();
			}
		},
		get cp(){ return _cp; },
		get vertices() { return makeVertices(); },
		get edges() { return makeEdges(); },
		get faces() { return makeFaces(); },

		get frameCount() {
			return _cp.file_frames ? _cp.file_frames.length : 0;
		},
		set frame(f) {
			frame = f;
			draw();
		},

		nearest,
		addClass,
		removeClass,

		clear,
		crease,
		fold,
		axiom1, axiom2, axiom3, axiom4, axiom5, axiom6, axiom7,
		isFolded,

		draw,
		updateViewBox,

		showVertices, showEdges, showFaces,
		hideVertices, hideEdges, hideFaces,
	
		load,
		save,
		get svg() { return canvas.svg; },
		get svgFile() { return canvas.save(); },
		get zoom() { return canvas.zoom; },
		get translate() { return canvas.translate; },
		get appendChild() { return canvas.appendChild; },
		get removeChildren() { return canvas.removeChildren; },
		get size() { return canvas.size; },
		get scale() { return canvas.scale; },
		get width() { return canvas.width; },
		get height() { return canvas.height; },
		set width(a) { canvas.width = a; },
		set height(a) { canvas.height = a; },
		set onMouseMove(a) { canvas.onMouseMove = a; },
		set onMouseDown(a) { canvas.onMouseDown = a; },
		set onMouseUp(a) { canvas.onMouseUp = a; },
		set onMouseLeave(a) { canvas.onMouseLeave = a; },
		set onMouseEnter(a) { canvas.onMouseEnter = a; },
		set animate(a) { canvas.animate = a; },

		set setFolded(_folded) {
			_cp.frame_classes = _cp.frame_classes
				.filter(a => a !== "creasePattern");
			_cp.frame_classes = _cp.frame_classes
				.filter(a => a !== "foldedState");
			_cp.frame_classes.push("foldedState");
			// todo re-call draw()
		},

	};
}

