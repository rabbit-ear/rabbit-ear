/** .FOLD file viewer
 * this is an SVG based front-end for the .fold file format
 *  (.fold file spec: https://github.com/edemaine/fold)
 *
 *  View constructor arguments:
 *   - fold file
 *   - DOM object, or "string" DOM id to attach to
 */

import * as Geom from "../include/geometry";
import * as SVG from "../include/svg";
import * as Graph from "./fold/graph";
import * as Origami from "./fold/origami";
import * as Import from "./parsers/import";
import { flatten_frame } from "./fold/frame";
import CreasePattern from "./cp/CreasePattern";
import * as SVGHelper from "./svg/svgHelper";

const plural = { boundary: "boundaries", face: "faces", crease: "creases", vertex: "vertices" };

const DEFAULTS = Object.freeze({
	autofit: true,
	debug: false,
	folding: true,
	padding: 0
});

const parsePreferences = function() {
	let keys = Object.keys(DEFAULTS);
	let prefs = {};
	Array(...arguments)
		.filter(obj => typeof obj === "object")
		.forEach(obj => Object.keys(obj)
			.filter(key => keys.includes(key))
			.forEach(key => prefs[key] = obj[key])
		);
	return prefs;
}

export default function() {

	let _this = SVG.image(...arguments);

	let groups = {};
	["boundary", "face", "crease", "vertex"].forEach(key =>
		groups[key] = _this.group().setID(plural[key])
	);
	// make svg components pass through their touches
	Object.keys(groups).forEach(key =>
		groups[key].setAttribute("pointer-events", "none")
	);

	let labels = {
		"boundary": _this.group(),
		"face": _this.group(),
		"crease": _this.group(),
		"vertex": _this.group()
	};

	let isClean = true;

	let prop = {
		cp: undefined,
		frame: undefined,
		style: {
			vertex_radius: 0.01 // percent of page
		},
	};

	let preferences = {};
	Object.assign(preferences, DEFAULTS);
	let userDefaults = parsePreferences(...arguments);
	Object.keys(userDefaults)
		.forEach(key => preferences[key] = userDefaults[key]);

	const setCreasePattern = function(cp) {
		// todo: check if cp is a CreasePattern type
		prop.cp = cp;
		draw();
		prop.cp.onchange = draw;
	}

	const drawDebug = function(graph) {
		// if (preferences.debug) {
		// 	// add faces edges
		// 	drawings.face = drawings.face.concat(SVGHelper.facesEdges(graph));
		// }
		// face dubug numbers
		labels.face.removeChildren();
		let fAssignments = graph.faces_vertices.map(fv => "face");
		let facesText = !(graph.faces_vertices) ? [] : graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v]))
			.map(fv => Geom.ConvexPolygon(fv))
			.map(face => face.centroid)
			.map((c,i) => labels.face.text(""+i, c[0], c[1]));
		facesText.forEach(text => {
			text.setAttribute("fill", "black");
			text.setAttribute("style", "font-family: sans-serif; font-size:0.05px")
		})

	}

	const isFolded = function(graph) {
		if (graph.frame_classes == null) { return false; }
		return graph.frame_classes.includes("foldedState");
	}

	const draw = function() {
		// flatten if necessary
		let graph = prop.frame
			? flatten_frame(prop.cp, prop.frame)
			: prop.cp;

		if (isFolded(graph)) {
			_this.removeClass("creasePattern");
			_this.addClass("foldedState");
		} else{
			_this.removeClass("foldedState");
			_this.addClass("creasePattern");
		}

		Object.keys(groups).forEach((key) => SVG.removeChildren(groups[key]));
		labels.face.removeChildren(); //todo remove

		// both folded and non-folded draw all the components, style them in CSS
		let arr = [groups.boundary, groups.face, groups.crease, groups.vertex];
		SVGHelper.fill_svg_groups(graph, ...arr);

		if (preferences.debug) { drawDebug(graph); }
		if (preferences.autofit) { updateViewBox(); }
	};

	const updateViewBox = function() {
		let graph = prop.frame
			? flatten_frame(prop.cp, prop.frame)
			: prop.cp;
		let r = Graph.bounding_rect(graph);
		SVG.setViewBox(_this, r[0], r[1], r[2], r[3], preferences.padding);
	};

	const nearest = function() {
		let p = Geom.Vector(...arguments);
		let methods = {
			"vertex": prop.cp.nearestVertex,
			"crease": prop.cp.nearestEdge,
			"face": prop.cp.nearestFace,
		};
		let nearest = {};
		// fill the methods
		Object.keys(methods)
			.forEach(key => nearest[key] = methods[key].apply(prop.cp, p));
		Object.keys(methods)
			.filter(key => methods[key] == null)
			.forEach(key => delete methods[key]);
		Object.keys(nearest)
			.filter(key => nearest[key] != null)
			.forEach(key => nearest[key].svg = groups[key].childNodes[nearest[key].index]);
		return nearest;
	}

	const getVertices = function() {
		let vertices = prop.cp.vertices;
		vertices.forEach((v,i) => v.svg = groups.vertex.children[i])
		return vertices;
	}
	const getEdges = function() {
		let edges = prop.cp.edges;
		edges.forEach((v,i) => v.svg = groups.crease.children[i])
		return edges;
	}
	const getFaces = function() {
		let faces = prop.cp.faces;
		faces.forEach((v,i) => v.svg = groups.face.children[i])
		return faces;
		// return prop.cp.faces
		// 	.map((v,i) => Object.assign(groups.face.children[i], v));
	}
	const getBoundary = function() {
		let boundary = prop.cp.getBoundary();
		boundary.forEach((v,i) => v.svg = groups.boundary.children[i])
		return boundary;
	};

	const load = function(input, callback) { // epsilon
		Import.load_file(input, function(fold) {
			setCreasePattern( CreasePattern(fold) );
			if (callback != null) { callback(); }
		});
	}

	const fold = function(face){
		let vertices_coords = Origami.fold_vertices_coords(prop.cp, face);
		let file_frame = {
			vertices_coords,
			frame_classes: ["foldedState"],
			frame_inherit: true,
			frame_parent: 0
		};
		if (prop.cp.file_frames == null) { prop.cp.file_frames = []; }
		prop.cp.file_frames.unshift(file_frame);
		prop.frame = 1;
		draw();
		// setCreasePattern( CreasePattern(folded) );
	}

	const foldWithoutLayering = function(face){
		let folded = Origami.fold_without_layering(prop.cp, face);
		setCreasePattern( CreasePattern(folded) );
		Array.from(groups.face.children).forEach(face => face.setClass("face"))
	}

	Object.defineProperty(_this, "export", { value: function() {
		let svg = _this.cloneNode(true);
		svg.setAttribute("x", "0px");
		svg.setAttribute("y", "0px");
		svg.setAttribute("width", "600px");
		svg.setAttribute("height", "600px");
		return SVG.save(svg, ...arguments);
	}});

	Object.defineProperty(_this, "cp", {
		get: function() { return prop.cp; },
		set: function(cp) { setCreasePattern(cp); }
	});
	Object.defineProperty(_this, "frameCount", {
		get: function() { return prop.cp.file_frames ? prop.cp.file_frames.length : 0; }
	});
	Object.defineProperty(_this, "frame", {
		set: function(f) { prop.frame = f; draw(); },
		get: function() { return prop.frame; }
	});

	// attach CreasePattern methods
	["axiom1", "axiom2", "axiom3", "axiom4", "axiom5", "axiom6", "axiom7",
	 "crease"]
		.forEach(method => Object.defineProperty(_this, method, {
			value: function(){ return prop.cp[method](...arguments); }
		}));
	// attach CreasePattern getters
	// ["boundary", "vertices", "edges", "faces",
	["isFolded"]
		.forEach(method => Object.defineProperty(_this, method, {
			get: function(){
				let components = prop.cp[method];
				// components.forEach(c => c.svg = )
				return components;
			}
		}));

	Object.defineProperty(_this, "nearest", {value: nearest});
	Object.defineProperty(_this, "vertices", {
		get: function(){ return getVertices(); }
	});
	Object.defineProperty(_this, "edges", {
		get: function(){ return getEdges(); }
	});
	Object.defineProperty(_this, "faces", {
		get: function(){ return getFaces(); }
	});
	Object.defineProperty(_this, "draw", { value: draw });
	Object.defineProperty(_this, "fold", { value: fold });
	Object.defineProperty(_this, "foldWithoutLayering", { value: foldWithoutLayering });
	Object.defineProperty(_this, "load", { value: load });
	Object.defineProperty(_this, "folded", { 
		set: function(f) {
			prop.cp.frame_classes = prop.cp.frame_classes
				.filter(a => a !== "creasePattern");
			prop.cp.frame_classes = prop.cp.frame_classes
				.filter(a => a !== "foldedState");
			prop.cp.frame_classes.push("foldedState");
			// todo re-call draw()
		}
	});

	_this.groups = groups;
	_this.labels = labels;
	Object.defineProperty(_this, "updateViewBox", { value: updateViewBox });

	_this.preferences = preferences;

	// boot
	setCreasePattern( CreasePattern(...arguments) );

	let lastStep;
	_this.events.addEventListener("onMouseDown", function(mouse) {
		if (preferences.folding) {
			lastStep = JSON.parse(JSON.stringify(prop.cp));
		}
	});
	_this.events.addEventListener("onMouseMove", function(mouse) {
		if (preferences.folding && mouse.isPressed) {
			prop.cp = CreasePattern(lastStep);
			let points = [
				Geom.Vector(mouse.pressed),
				Geom.Vector(mouse.position)
			];
			let midpoint = points[0].midpoint(points[1]);
			let vector = points[1].subtract(points[0]);
			prop.cp.valleyFold(midpoint, vector.rotateZ90());
			fold();
		}
	});

	return _this;
};
