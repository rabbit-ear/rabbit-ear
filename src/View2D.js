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
import { default as FOLD_SVG } from "../include/fold-svg";
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
	shadows: false,
	labels: false
});

const DISPLAY_NAME = {
	vertices: "vertices",
	edges: "creases",
	faces: "faces",
	boundaries: "boundaries"
};

const drawComponent = {
	vertices: FOLD_SVG.core.svgVertices,
	edges: FOLD_SVG.core.svgEdges,
	faces: FOLD_SVG.core.svgFacesVertices,
	boundaries: FOLD_SVG.core.svgBoundaries
};

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
	_this.appendChild(shadowFilter("faces_shadow"));

	// make SVG groups, containers for the crease pattern parts
	let groups = {};
	["boundaries", "faces", "edges", "vertices"].forEach(key => {
		groups[key] = _this.group();
		groups[key].setAttribute("class", DISPLAY_NAME[key]);
		// the SVG should get touches. faces/creases otherwise intercept events
		groups[key].setAttribute("pointer-events", "none");
		_this.appendChild(groups[key]);
	});
	// by default show these layers
	let visible = {
		"boundaries":true,
		"faces":true,
		"edges":true,
		"vertices":false
	};
	// container for labels and any top-level detail
	let groupLabels = _this.group();

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

	/**
	 * if the user passes in an already initialized CreasePattern object
	 * (this class), no deep copy will occur.
	 */
	const setCreasePattern = function(cp, frame = undefined) {
		// key indicates the object is already a CreasePattern type
		prop.cp = (cp.__rabbit_ear != null)
			? cp
			: CreasePattern(cp);
		prop.frame = frame;
		draw();
		// two levels of autofit going on here
		if (!preferences.autofit) { updateViewBox(); }
		prop.cp.onchange.push(draw);
	}

	const updateFromCPOnChange = function() {
		// get last update time
		// 1. if timeout is still running ignore it.
		// 2. if update time passes 1/30th of a second force a call
	}

	const isFolded = function(graph) {
		// this is a heuristic function.
		// need best practices for detecting folded state
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

		// copy file/frame classes to top level
		let file_classes = (graph.file_classes != null
			? graph.file_classes : []).join(" ");
		let frame_classes = graph.frame_classes != null
			? graph.frame_classes : [].join(" ");
		let top_level_classes = [file_classes, frame_classes]
			.filter(s => s !== "")
			.join(" ");
		_this.setAttribute("class", top_level_classes);

		// visible = isFolded(graph)
		// 	? ["faces", "edges"]
		// 	: ["boundaries", "faces", "edges"];

		Object.keys(groups).forEach(key => groups[key].removeChildren());
		groupLabels.removeChildren();

		// draw geometry into groups
		Object.keys(groups).filter(key => visible[key]).forEach(key =>
			drawComponent[key](graph).forEach(o =>
				groups[key].appendChild(o)
			)
		);

		if (preferences.debug) { drawDebug(graph); }
		if (preferences.labels) { drawLabels(graph); }
		if (preferences.autofit) { updateViewBox(); }
		if (preferences.shadows) {
			Array.from(groups.faces.childNodes).forEach(f =>
				f.setAttribute("filter", "url(#faces_shadow)")
			);
		}
		// let r = bounding_rect(graph);
		// let vmin = r[2] > r[3] ? r[3] : r[2];
		// _this.style = "--crease-width: " + vmin*0.005 + ";"
		// styleElement.innerHTML = "#creases line {" + creaseStyle + "}";

		// stroke width
		let styleElement = _this.querySelector("style");

		if (styleElement == null) {
			const svgNS = "http://www.w3.org/2000/svg";
			styleElement = document.createElementNS(svgNS, "style");
			_this.appendChild(styleElement);
		}
		let r = bounding_rect(graph);
		// --crease-width: 5;
		let vmin = r[2] > r[3] ? r[3] : r[2];
		let creaseStyle = "stroke-width:" + vmin*0.005;
		styleElement.innerHTML = "#creases line {" + creaseStyle + "}";
		// groups.creases.setAttribute("style", "stroke-width:"+vmin*0.005);
	};

	const drawLabels = function(graph) {
		if ("faces_vertices" in graph === false ||
		    "edges_vertices" in graph === false ||
		    "vertices_coords" in graph === false) { return; }
		let r = bounding_rect(graph);
		let vmin = r[2] > r[3] ? r[3] : r[2];
		let fSize = vmin*0.04;
		let labels_style = {
			vertices: "fill:#27b;font-family:sans-serif;font-size:"+fSize+"px;",
			edges: "fill:#e53;font-family:sans-serif;font-size:"+fSize+"px;",
			faces: "fill:black;font-family:sans-serif;font-size:"+fSize+"px;",
		}
		let m = [fSize*0.33, fSize*0.4];
		// vertices
		graph.vertices_coords
			.map((v,i) => groupLabels.text(""+i, v[0]-m[0], v[1]+m[1]))
			.forEach(t => t.setAttribute("style", labels_style.vertices));
		// edges
		graph.edges_vertices
			.map(ev => ev.map(v => graph.vertices_coords[v]))
			.map(verts => Geom.core.average(verts))
			.map((c,i) => groupLabels.text(""+i, c[0]-m[0], c[1]+m[1]))
			.forEach(t => t.setAttribute("style", labels_style.edges));
		// faces
		graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v]))
			.map(verts => Geom.core.average(verts))
			.map((c,i) => groupLabels.text(""+i, c[0]-m[0], c[1]+m[1]))
			.forEach(t => t.setAttribute("style", labels_style.faces));
	}

	const drawDebug = function(graph) {
		let r = bounding_rect(graph);
		let vmin = r[2] > r[3] ? r[3] : r[2];
		let strokeW = vmin*0.005;
		let debug_style = {
			faces_vertices: "fill:none;stroke:#27b;stroke-width:"+strokeW+";",
			faces_edges: "fill:none;stroke:#e53;stroke-width:"+strokeW+";",
		};
		graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v]))
			.map(face => Geom.ConvexPolygon(face).scale(0.866).points)
			.map(points => groupLabels.polygon(points))
			.forEach(poly => poly.setAttribute("style", debug_style.faces_vertices));
		graph.faces_edges
			.map(face_edges => face_edges
				.map(edge => graph.edges_vertices[edge])
				.map((vi, i, arr) => {
					let next = arr[(i+1)%arr.length];
					return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
				}).map(v => graph.vertices_coords[v])
			).map(face => Geom.ConvexPolygon(face).scale(0.75).points)
			.map(points => groupLabels.polygon(points))
			.forEach(poly => poly.setAttribute("style", debug_style.faces_edges));
	}

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
		let plural = {vertex: "vertices", edge: "edges", face: "faces"};
		// run these methods, store the results in their place in the same object
		let nearest = {
			vertex: prop.cp.nearestVertex,
			edge: prop.cp.nearestEdge,
			face: prop.cp.nearestFace,
		};
		Object.keys(nearest)
			.forEach(key => nearest[key] = nearest[key].apply(prop.cp, p));
		Object.keys(nearest)
			.filter(key => nearest[key] !== undefined)
			.forEach(key =>
				nearest[key].svg = groups[plural[key]].childNodes[nearest[key].index]
			);
		return nearest;
	}

	const getVertices = function() {
		let vertices = prop.cp.vertices;
		vertices.forEach((v,i) => v.svg = groups.vertices.childNodes[i])
		Object.defineProperty(vertices, "visible", {
			get: function() { return visible["vertices"]; },
			set: function(v) { visible["vertices"] = !!v; draw(); },
		});
		return vertices;
	}
	const getEdges = function() {
		let edges = prop.cp.edges;
		edges.forEach((v,i) => v.svg = groups.edges.childNodes[i])
		Object.defineProperty(edges, "visible", {
			get: function() { return visible["creases"]; },
			set: function(v) { visible["creases"] = !!v; draw(); },
		});
		return edges;
	}
	const getFaces = function() {
		let faces = prop.cp.faces;
		let sortedFaces = Array.from(groups.faces.childNodes).slice()
			.sort((a,b) => parseInt(a.id) - parseInt(b.id) );
		faces.forEach((v,i) => v.svg = sortedFaces[i])
		Object.defineProperty(faces, "visible", {
			get: function() { return visible["faces"]; },
			set: function(v) { visible["faces"] = !!v; draw(); },
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
			&& prop.cp.file_frames[0]["faces_re:matrix"] != null
			&& prop.cp.file_frames[0]["faces_re:matrix"].length 
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
	// ["isFolded"]
	// 	.forEach(method => Object.defineProperty(_this, method, {
	// 		get: function(){ return prop.cp[method]; }
	// 	}));

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
	Object.defineProperty(_this, "updateViewBox", { value: updateViewBox });
	_this.preferences = preferences;
	// _this.groups = groups;

	// boot
	setCreasePattern( CreasePattern(...arguments), 1 );

	let prevCP, prevCPFolded, touchFaceIndex;
	_this.events.addEventListener("onMouseDown", function(mouse) {
		if (preferences.folding) {
			try {
				prevCP = JSON.parse(JSON.stringify(prop.cp));
				if (prop.frame == null
					|| prop.frame === 0
					|| prevCP.file_frames == null) {
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

const shadowFilter = function(id_name = "shadow") {
	const svgNS = "http://www.w3.org/2000/svg";
	let defs = document.createElementNS(svgNS, "defs");

	let filter = document.createElementNS(svgNS, "filter");
	filter.setAttribute("width", "200%");
	filter.setAttribute("height", "200%");
	filter.setAttribute("id", id_name);

	let blur = document.createElementNS(svgNS, "feGaussianBlur");
	blur.setAttribute("in", "SourceAlpha");
	blur.setAttribute("stdDeviation", "0.01");
	blur.setAttribute("result", "blur");

	let offset = document.createElementNS(svgNS, "feOffset");
	offset.setAttribute("in", "blur");
	offset.setAttribute("result", "offsetBlur");

	let flood = document.createElementNS(svgNS, "feFlood");
	flood.setAttribute("flood-color", "#000");
	flood.setAttribute("flood-opacity", "0.4");
	flood.setAttribute("result", "offsetColor");

	let composite = document.createElementNS(svgNS, "feComposite");
	composite.setAttribute("in", "offsetColor");
	composite.setAttribute("in2", "offsetBlur");
	composite.setAttribute("operator", "in");
	composite.setAttribute("result", "offsetBlur");

	let merge = document.createElementNS(svgNS, "feMerge");
	let mergeNode1 = document.createElementNS(svgNS, "feMergeNode");
	let mergeNode2 = document.createElementNS(svgNS, "feMergeNode");
	mergeNode2.setAttribute("in", "SourceGraphic");
	merge.appendChild(mergeNode1);
	merge.appendChild(mergeNode2);

	defs.appendChild(filter);

	filter.appendChild(blur);
	filter.appendChild(offset);
	filter.appendChild(flood);
	filter.appendChild(composite);
	filter.appendChild(merge);
	return defs;
}