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

import * as Geom from "../lib/geometry";
import * as SVG from "../lib/svg";
import * as Graph from "./fold/graph";
import * as Origami from "./fold/origami";
import * as Import from "./fold/import";
import { flatten_frame } from "./fold/file";
import CreasePattern from "./CreasePattern";
import * as FoldSVG from "./fold/svg";

export default function() {

	let _svg = SVG.image(...arguments);
	//  from arguments, get a fold file, if it exists
	let _cp = CreasePattern(...arguments);
	// tie handler from crease pattern
	_cp.onchange = function() {
		draw();
	};

	// prepare SVG
	let groups = {
		boundary: _svg.group().setID("boundary"),
		faces: _svg.group().setID("faces"),
		creases: _svg.group().setID("creases"),
		vertices: _svg.group().setID("vertices"),
	};

	// view properties
	let style = {
		vertex:{ radius: 0.01 },  // radius, percent of page
	};
	let _frame;

	const drawFolded = function(graph) {
		Object.keys(groups).forEach((key) => SVG.removeChildren(groups[key]));
		FoldSVG.foldedFaces(graph)
			.forEach(f => groups.faces.appendChild(f));
	}
	const drawCP = function(graph) {
		// clear layers
		Object.keys(groups).forEach((key) => SVG.removeChildren(groups[key]));

		let svg = {
			boundary: FoldSVG.boundary(graph),
			faces: FoldSVG.facesVertices(graph).concat(FoldSVG.facesEdges(graph)),
			creases: FoldSVG.creases(graph),
			vertices: FoldSVG.vertices(graph)
		};
		Object.keys(svg).forEach(key => 
			svg[key].forEach(el => groups[key].appendChild(el))
		);

		// FoldSVG.vertices(graph).forEach(a => groups.vertices.appendChild(a));
		// FoldSVG.creases(graph).forEach(a => groups.creases.appendChild(a));
		// FoldSVG.facesVertices(graph).forEach(a => groups.faces.appendChild(a));
		// FoldSVG.facesEdges(graph).forEach(a => groups.faces.appendChild(a));
		// FoldSVG.boundary(graph).forEach(a => groups.boundary.appendChild(a));
	}

	const draw = function() {
		if (_cp.vertices_coords == null){ return; }
		let graph = _frame ? flatten_frame(_cp, _frame) : _cp;
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
			SVG.setViewBox(_svg, 0, 0, 1, 1);
		} else{
			SVG.setViewBox(_svg, boundsX, boundsY, boundsW, boundsH);
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


	const setCP = function(cp) {
		_cp = cp;
		draw();
		_cp.onchange = draw;
	}

	Object.defineProperty(_svg, "cp", {
		get: function() { return _cp; },
		set: function(cp) { setCP(cp); }
	});
	Object.defineProperty(_svg, "vertices", {
		get: function() { return makeVertices(); }
	});
	Object.defineProperty(_svg, "edges", {
		get: function() { return makeEdges(); }
	});
	Object.defineProperty(_svg, "faces", {
		get: function() { return makeFaces(); }
	});
	Object.defineProperty(_svg, "frameCount", {
		get: function() { return _cp.file_frames ? _cp.file_frames.length : 0; }
	});
	Object.defineProperty(_svg, "frame", {
		set: function(f) { _frame = f; draw(); }
	});
	Object.defineProperty(_svg, "nearest", {value: nearest});
	Object.defineProperty(_svg, "axiom1", {value:function(){return _cp.axiom1(...arguments);}});
	Object.defineProperty(_svg, "axiom2", {value:function(){return _cp.axiom2(...arguments);}});
	Object.defineProperty(_svg, "axiom3", {value:function(){return _cp.axiom3(...arguments);}});
	Object.defineProperty(_svg, "axiom4", {value:function(){return _cp.axiom4(...arguments);}});
	Object.defineProperty(_svg, "axiom5", {value:function(){return _cp.axiom5(...arguments);}});
	Object.defineProperty(_svg, "axiom6", {value:function(){return _cp.axiom6(...arguments);}});
	Object.defineProperty(_svg, "axiom7", {value:function(){return _cp.axiom7(...arguments);}});
	Object.defineProperty(_svg, "draw", { value: draw });
	Object.defineProperty(_svg, "updateViewBox", { value: updateViewBox });
	Object.defineProperty(_svg, "isFolded", { value: isFolded });
	Object.defineProperty(_svg, "fold", { value: fold });
	Object.defineProperty(_svg, "crease", { value: crease });
	Object.defineProperty(_svg, "load", { value: load });
	Object.defineProperty(_svg, "folded", { 
		set: function(f) {
			_cp.frame_classes = _cp.frame_classes
				.filter(a => a !== "creasePattern");
			_cp.frame_classes = _cp.frame_classes
				.filter(a => a !== "foldedState");
			_cp.frame_classes.push("foldedState");
			// todo re-call draw()
		}
	});
	Object.defineProperty(_svg, "showVertices", { value: showVertices });
	Object.defineProperty(_svg, "hideVertices", { value: hideVertices });
	Object.defineProperty(_svg, "showEdges", { value: showEdges });
	Object.defineProperty(_svg, "hideEdges", { value: hideEdges });
	Object.defineProperty(_svg, "showFaces", { value: showFaces });
	Object.defineProperty(_svg, "hideFaces", { value: hideFaces });

	return _svg;
};
