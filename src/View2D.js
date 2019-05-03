/** FOLD file viewer
 * this is an SVG based front-end for the FOLD file format
 *  (FOLD file spec: https://github.com/edemaine/fold)
 *
 *  View constructor arguments:
 *   - FOLD file
 *   - DOM object, or "string" DOM id to attach to
 */

import * as Geom from "../include/geometry";
import * as SVG from "../include/svg";
import * as Graph from "./fold/graph";
import * as Origami from "./fold/origami";
import { flatten_frame } from "./fold/file";
import { load_file } from "./convert/convert";
import CreasePattern from "./cp/CreasePattern";
import * as FoldToSVG from "./draw/toSVG";
import {
	faces_containing_point,
	topmost_face,
	bounding_rect
} from "./fold/planargraph";

const DEFAULTS = Object.freeze({
	autofit: true,
	debug: false,
	folding: false,
	padding: 0,
	shadows: false
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

	(function(){
		const svgNS = "http://www.w3.org/2000/svg";
		let defs = document.createElementNS(svgNS, "defs");
		let filter = document.createElementNS(svgNS, "filter");
		filter.setAttribute("width", "200%");
		filter.setAttribute("height", "200%");
		filter.setAttribute("id", "face-shadow");
		let blur = document.createElementNS(svgNS, "feGaussianBlur");
		blur.setAttribute("result", "blurOut");
		blur.setAttribute("in", "SourceAlpha");
		blur.setAttribute("stdDeviation", 0.005);
		let merge = document.createElementNS(svgNS, "feMerge");
		let mergeNode1 = document.createElementNS(svgNS, "feMergeNode");
		let mergeNode2 = document.createElementNS(svgNS, "feMergeNode");
		mergeNode2.setAttribute("in", "SourceGraphic");
		_this.appendChild(defs);
		defs.appendChild(filter);
		filter.appendChild(blur);
		filter.appendChild(merge);
		merge.appendChild(mergeNode1);
		merge.appendChild(mergeNode2);
	})();

	// make SVG groups
	let groups = {};  // visible = {};
	// ["boundary", "face", "crease", "vertex"]
	// make sure they are added in this order
	["boundaries", "faces", "creases", "vertices", "labels"].forEach(key =>
		groups[key] = _this.group().setID(key)
	);

	let visibleGroups = {
		"boundaries": groups["boundaries"],
		"faces": groups["faces"],
		"creases": groups["creases"],
	};

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

	const setCreasePattern = function(cp, frame = undefined) {
		// todo: check if cp is a CreasePattern type
		prop.cp = (cp.__rabbit_ear == null)
			? CreasePattern(cp)
			: cp;
		prop.frame = frame;
		draw();
		// two levels of autofit going on here
		if (!preferences.autofit) { updateViewBox(); }

		prop.cp.onchange = draw;
	}

	const drawDebug = function(graph) {
		// if (preferences.debug) {
		// 	// add faces edges
		// 	drawings.face = drawings.face.concat(Draw.facesEdges(graph));
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
		});
	}

	const isFolded = function(graph) {
		// todo, this is a heuristic function. can incorporate more cases
		if (graph.frame_classes == null) { return false; }
		return graph.frame_classes.includes("foldedForm");
	}

	/**
	 * This converts the FOLD object into an SVG
	 * (1) flattens the frame if one is selected (recursively if needed)
	 * (2) identifies whether the frame is creasePattern or folded form
	 */
	const draw = function() {
		// flatten if necessary
		let graph = prop.frame
			? flatten_frame(prop.cp, prop.frame)
			: prop.cp;

		if (isFolded(graph)) {
			_this.removeClass("creasePattern");
			_this.addClass("foldedForm");
		} else{
			_this.removeClass("foldedForm");
			_this.addClass("creasePattern");
		}

		Object.keys(groups).forEach((key) => SVG.removeChildren(groups[key]));
		labels.face.removeChildren(); //todo remove
		// both folded and non-folded draw all the components, style them in CSS
		FoldToSVG.intoGroups(graph, visibleGroups);

		// if (groups.faces.children.length === graph.faces_vertices.length) {
		// 	FoldToSVG.updateFaces(graph, groups.faces);
		// } else {
		// 	// SVG.removeChildren(groups.faces);
		// 	FoldToSVG.updateGroups(graph, visibleGroups);
		// }

		if (preferences.debug) { drawDebug(graph); }
		if (preferences.autofit) { updateViewBox(); }

		if (preferences.shadows) {
			Array.from(groups.faces.children)
				.forEach(f => f.setAttribute("filter", "url(#face-shadow)"));
		}

		return;
		// stroke width
		let styleElement = _this.querySelector("style");

		if (styleElement == null) {
			const svgNS = "http://www.w3.org/2000/svg";
			styleElement = document.createElementNS(svgNS, "style");
			_this.appendChild(styleElement);
		}
		let r = bounding_rect(graph);
		let vmin = r[2] > r[3] ? r[3] : r[2];
		let creaseStyle = "stroke-width:" + vmin*0.005;
		styleElement.innerHTML = "#creases line {" + creaseStyle + "}";
		// groups.creases.setAttribute("style", "stroke-width:"+vmin*0.005);
	};

	const updateViewBox = function() {
		let graph = prop.frame
			? flatten_frame(prop.cp, prop.frame)
			: prop.cp;
		let r = bounding_rect(graph);
		let vmin = r[2] > r[3] ? r[3] : r[2];
		SVG.setViewBox(_this, r[0], r[1], r[2], r[3], preferences.padding * vmin);
	};

	const nearest = function() {
		let p = Geom.Vector(...arguments);
		// let methods = {
		// 	"vertex": prop.cp.nearestVertex,
		// 	"crease": prop.cp.nearestEdge,
		// 	"face": prop.cp.nearestFace,
		// };
		let methods = {
			"vertices": prop.cp.nearestVertex,
			"creases": prop.cp.nearestEdge,
			"faces": prop.cp.nearestFace,
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
			.forEach(key =>
				nearest[key].svg = groups[key].childNodes[nearest[key].index]
			);
		return nearest;
	}

	const getVertices = function() {
		let vertices = prop.cp.vertices;
		vertices.forEach((v,i) => v.svg = groups.vertices.children[i])
		Object.defineProperty(vertices, "visible", {
			get: function(){ return visibleGroups["vertices"] !== undefined; },
			set: function(isVisible){
				if(isVisible) { visibleGroups["vertices"] = groups["vertices"]; }
				else { delete visibleGroups["vertices"]; }
				draw();
			},
		});
		return vertices;
	}
	const getEdges = function() {
		let edges = prop.cp.edges;
		edges.forEach((v,i) => v.svg = groups.creases.children[i])
		Object.defineProperty(edges, "visible", {
			get: function(){ return visibleGroups["creases"] !== undefined; },
			set: function(isVisible){
				if(isVisible) { visibleGroups["creases"] = groups["creases"]; }
				else { delete visibleGroups["creases"]; }
				draw();
			},
		});
		return edges;
	}
	const getFaces = function() {
		let faces = prop.cp.faces;
		let sortedFaces = Array.from(groups.faces.children).slice()
			.sort((a,b) => parseInt(a.id) - parseInt(b.id) );
		faces.forEach((v,i) => v.svg = sortedFaces[i])
		Object.defineProperty(faces, "visible", {
			get: function(){ return visibleGroups["faces"] !== undefined; },
			set: function(isVisible){
				if (isVisible) { visibleGroups["faces"] = groups["faces"]; }
				else { delete visibleGroups["faces"]; }
				draw();
			},
		});
		return faces;
		// return prop.cp.faces
		// 	.map((v,i) => Object.assign(groups.face.children[i], v));
	}
	const getBoundary = function() {
		let graph = prop.frame
			? flatten_frame(prop.cp, prop.frame)
			: prop.cp;
		return Geom.Polygon(
			Graph.get_boundary_face(graph)
				.vertices
				.map(v => graph.vertices_coords[v])
		);
		// let boundary = prop.cp.boundary;
		// boundary.forEach((v,i) => v.svg = groups.boundaries.children[i])
		// return boundary;
	};

	const load = function(input, callback) { // epsilon
		load_file(input, function(fold) {
			setCreasePattern( CreasePattern(fold) );
			if (callback != null) { callback(); }
		});
	}

	const fold = function(face) {
		// 1. check if a folded frame already exists (and it's valid)
		// 2. if not, build one
		// if (prop.cp.file_frames.length > 0)
		// if (face == null) { face = 0; }

		if (prop.cp.file_frames != null
			&& prop.cp.file_frames.length > 0
			&& prop.cp.file_frames[0]["re:faces_matrix"] != null
			&& prop.cp.file_frames[0]["re:faces_matrix"].length 
				=== prop.cp.faces_vertices.length) {
			// well.. do nothing. we're good
		} else {
			// for the moment let's assume it's just 1 layer. face = 0
			if (face == null) { face = 0; }
			let file_frame = Origami.build_folded_frame(prop.cp, face);
			if (prop.cp.file_frames == null) { prop.cp.file_frames = []; }
			prop.cp.file_frames.unshift(file_frame);
		}
		prop.frame = 1;
		draw();
	}

	const foldWithoutLayering = function(face){
		let folded = Origami.fold_without_layering(prop.cp, face);
		setCreasePattern( CreasePattern(folded) );
		Array.from(groups.faces.children).forEach(face => face.setClass("face"))
	}

	Object.defineProperty(_this, "frames", {
		get: function() {
			if (prop.cp.file_frames === undefined) {
				return [JSON.parse(JSON.stringify(prop.cp))];
			}
			let frameZero = JSON.parse(JSON.stringify(prop.cp));
			delete frameZero.file_frames;
			let frames = JSON.parse(JSON.stringify(prop.cp.file_frames));
			return [frameZero].concat(frames);
		}
	});
	Object.defineProperty(_this, "frame", {
		get: function() { return prop.frame; },
		set: function(newValue) {
			// check bounds of frames
			prop.frame = newValue;
			draw();
		}
	});

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
		get: function() { return prop.cp.file_frames
			? prop.cp.file_frames.length
			: 0;
		}
	});
	// Object.defineProperty(_this, "frame", {
	// 	set: function(f) { prop.frame = f; draw(); },
	// 	get: function() { return prop.frame; }
	// });

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
	Object.defineProperty(_this, "boundary", {
		get: function(){ return getBoundary(); }
	});
	Object.defineProperty(_this, "draw", { value: draw });
	Object.defineProperty(_this, "fold", { value: fold });
	Object.defineProperty(_this, "foldWithoutLayering", {
		value: foldWithoutLayering
	});
	Object.defineProperty(_this, "load", { value: load });
	Object.defineProperty(_this, "folded", { 
		set: function(f) {
			prop.cp.frame_classes = prop.cp.frame_classes
				.filter(a => a !== "creasePattern");
			prop.cp.frame_classes = prop.cp.frame_classes
				.filter(a => a !== "foldedForm");
			prop.cp.frame_classes.push( f ? "foldedForm" : "creasePattern");
			draw();
		}
	});

	_this.groups = groups;
	// _this.labels = labels;

	Object.defineProperty(_this, "updateViewBox", { value: updateViewBox });

	_this.preferences = preferences;

	// boot
	setCreasePattern( CreasePattern(...arguments), 1 );

	let prevCP, prevCPFolded, touchFaceIndex;
	_this.events.addEventListener("onMouseDown", function(mouse) {
		if (preferences.folding) {
			try {
				prevCP = JSON.parse(JSON.stringify(prop.cp));
				// console.log("got a prev cp", prevCP);
				if (prop.frame == null
					|| prop.frame === 0
					|| prevCP.file_frames == null) {
					// console.log("NEEDING TO BUILD A FOLDED FRAME");
					let file_frame = Origami.build_folded_frame(prevCP, 0);
					if (prevCP.file_frames == null) { prevCP.file_frames = []; }
					prevCP.file_frames.unshift(file_frame);
				}
				prevCPFolded = flatten_frame(prevCP, 1);
				let faces_containing = faces_containing_point(prevCPFolded, mouse);
				let top_face = topmost_face(prevCPFolded, faces_containing);
				touchFaceIndex = (top_face == null)
					? 0 // get bottom most face
					: top_face;
			} catch(error) {
				console.warn("problem loading the last fold step", error);
			}
		}
	});
	_this.events.addEventListener("onMouseMove", function(mouse) {
		if (preferences.folding && mouse.isPressed) {
			prop.cp = CreasePattern(prevCP);
			let points = [Geom.Vector(mouse.pressed), Geom.Vector(mouse.position)];
			let midpoint = points[0].midpoint(points[1]);
			let vector = points[1].subtract(points[0]);
			prop.cp.valleyFold(midpoint, vector.rotateZ90(), touchFaceIndex);
			fold();
		}
	});

	return _this;
};
