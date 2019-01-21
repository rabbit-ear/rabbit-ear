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

export default function() {

	let canvas = SVG.Image(...arguments);
	//  from arguments, get a fold file, if it exists
	let _cp = RabbitEar.CreasePattern(...arguments);
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
	}
	canvas.svg.appendChild(groups.boundary);
	canvas.svg.appendChild(groups.faces);
	canvas.svg.appendChild(groups.creases);
	canvas.svg.appendChild(groups.vertices);

	// view properties
	let frame = 0; // which fold file frame (0 ..< Inf) to display
	let style = {
		vertex:{ radius: 0.01 },  // radius, percent of page
	};
	let _isFolded = false; // is this a rendering of the folded form?
	let _mouse = {
		isPressed: false,// is the mouse button pressed (y/n)
		position: [0,0], // the current position of the mouse
		pressed: [0,0],  // the last location the mouse was pressed
		drag: [0,0],     // vector, displacement from start to now
		prev: [0,0],     // on mouseMoved, this was the previous location
		x: 0,      // redundant data --
		y: 0       // -- these are the same as position
	};

	const draw = function() {
		if(_cp.vertices_coords == null){ return; }
		// gather components
		let verts = _cp.vertices_coords;
		let edges = _cp.edges_vertices.map(ev => ev.map(v => verts[v]));
		let eAssignments = ( _isFolded
			? _cp.edges_assignment.map(a => "F")
			: _cp.edges_assignment.map(a => CREASE_DIR[a]));
		let fAssignments = ( _isFolded
			? _cp.faces_vertices.map(fv => "face folded")
			: _cp.faces_vertices.map(fv => "face"));
		let facesV = _cp.faces_vertices
			.map(fv => fv.map(v => verts[v]))
			.map(face => Geom.Polygon(face));
		let facesE = _cp.faces_edges
			.map(face_edges => face_edges
				.map(edge => _cp.edges_vertices[edge])
				.map((vi,i,arr) => {
					let next = arr[(i+1)%arr.length];
					return (vi[1] === next[0] || vi[1] === next[1]
						? vi[0] : vi[1]);
				}).map(v => _cp.vertices_coords[v])
			)
			.map(face => Geom.Polygon(face));
		let boundary = Graph.get_boundary_vertices(_cp)
			.map(v => _cp.vertices_coords[v])
		
		if (!_isFolded) {
			facesV = facesV.map(face => face.scale(0.6666));
			facesE = facesE.map(face => face.scale(0.8333));
		}
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
		facesV.forEach((face, i) =>
			SVG.polygon(face.points, fAssignments[i], "face", groups.faces)
		);
		facesE.forEach((face, i) =>
			SVG.polygon(face.points, fAssignments[i], "face", groups.faces)
		);
		updateViewBox();
	}
	
	draw();

	const updateViewBox = function() {
		let vertices = _cp.vertices_coords;
		if (frame > 0 &&
		   _cp.file_frames[frame - 1] != null &&
		   _cp.file_frames[frame - 1].vertices_coords != null){
			vertices = _cp.file_frames[frame - 1].vertices_coords;
		}
		// calculate bounds
		let xSorted = vertices.slice().sort((a,b) => a[0] - b[0]);
		let ySorted = vertices.slice().sort((a,b) => a[1] - b[1]);
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
		if (typeof input === 'string' || input instanceof String){
			let extension = input.substr((input.lastIndexOf('.') + 1));
			// filename. we need to upload
			switch(extension){
				case 'fold':
				fetch(input)
					.then((response) => response.json())
					.then((data) => {
						_cp = data;
						draw();
						if(callback != null){ callback(_cp); }
					});
				// return this;
			}
		}
		try{
			// try .fold file format first
			let foldFileImport = JSON.parse(input);
			_cp = foldFileImport;
			// return this;
		} catch(err){
			console.log("not a valid .fold file format")
			// return this;
		}
	}
	const isFoldedState = function() {
		if(_cp == null || _cp.frame_classes == null){ return false; }
		let frame_classes = _cp.frame_classes;
		if(frame > 0 &&
		   _cp.file_frames[frame - 1] != null &&
		   _cp.file_frames[frame - 1].frame_classes != null){
			frame_classes = _cp.file_frames[frame - 1].frame_classes;
		}
		// try to discern folded state
		if(frame_classes.includes("foldedState")){
			return true;
		}
		if(frame_classes.includes("creasePattern")){
			return false;
		}
		// inconclusive
		return false;
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

	const getFrames = function(){ return _cp.file_frames; }
	const getFrame = function(index){ return _cp.file_frames[index]; }
	const setFrame = function(index){
		frame = index;
		draw();
	}
	const showVertices = function(){ groups.vertices.removeAttribute("visibility");}
	const hideVertices = function(){ groups.vertices.setAttribute("visibility", "hidden");}
	const showEdges = function(){ groups.creases.removeAttribute("visibility");}
	const hideEdges = function(){ groups.creases.setAttribute("visibility", "hidden");}
	const showFaces = function(){ groups.faces.removeAttribute("visibility");}
	const hideFaces = function(){ groups.faces.setAttribute("visibility", "hidden");}

	// const setFrame = function() {
	// 	// todo, this is fragmented code
	// 	// needs reorganizing
		
	// 	// if a frame is set, copy data from that frame
	// 	if (frame > 0 && _cp.file_frames != null){
	// 		if(_cp.file_frames[frame - 1] != null &&
	// 	   	   _cp.file_frames[frame - 1].vertices_coords != null){
	// 			data = File.flatten_frame(_cp, frame);
	// 		}
	// 	}
	// }

	function addClass(node, className) { SVG.addClass(node, className); }
	function removeClass(node, className) { SVG.removeClass(node, className); }

	const clear = function() {
		// todo: remove all creases from current CP, leave the boundary.
	}

	const crease = function(a, b, c, d){
		// Folder.
	}

	const fold = function(face){
		// return Folder.fold_without_layering(_cp, face);
	}

	// return Object.freeze({
	return {
		get mouse() { return JSON.parse(JSON.stringify(_mouse)); },
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

		nearest,
		addClass,
		removeClass,

		clear,
		crease,
		fold,

		draw,
		updateViewBox,

		getFrames, getFrame, setFrame,
		showVertices, showEdges, showFaces,
		hideVertices, hideEdges, hideFaces,
	
		load,
		save,
		get svg() { return canvas.svg; },
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

		set isFolded(_folded) {
			_isFolded = !!_folded;
			if (_isFolded) {

			} else{

			}
		},

	};
}

