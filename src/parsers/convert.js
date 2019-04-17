import * as Origami from "../fold/origami";
import * as SVG from "../../include/svg";
import * as SVGHelper from "../svg/svgHelper";
import { segments } from "../../include/svg-segmentize";
import { flatten_frame } from "../fold/frame";
import { bounding_rect } from "../fold/graph";
// import * as Fold from "../include/fold";


/**
 * this asynchronously loads data from "input",
 * if necessary, converts into the FOLD format,
 * and calls "callback(fold)" with the data as the first argument.
 *
 * valid "input" arguments are:
 * - filenames ("pattern.svg")
 * - raw blob contents of a preloaded file (.fold, .oripa, .svg)
 * - SVG DOM objects (<svg> SVGElement)
 */

export const load_file = function(input, callback) {
	let type = typeof input;
	if (type === "object") {
		try {
			let fold = JSON.parse(JSON.stringify(input));
			// todo different way of checking fold format validity
			if (fold.vertices_coords == null) { throw "tried FOLD format, got empty object"; }
			if (callback != null) {
				callback(fold);
			}
		} catch(err) {
			// console.warn("could not load file, object is either not valid FOLD or corrupt JSON.", err);
			if (s instanceof Element){
				let fold = svg_to_fold(input);
				if (callback != null) {
					callback(fold);
				}
			}
		} finally {
			return;
		}
	}
	// are they giving us a filename, or the data of an already loaded file?
	if (type === "string" || input instanceof String) {
		// try a FOLD format string
		try {
			// try .fold file format first
			let fold = JSON.parse(input);
			if (callback != null) { callback(fold); }
		} catch(err) {
			let extension = input.substr((input.lastIndexOf('.') + 1));
			// filename. we need to upload
			switch(extension) {
				case "fold":
					fetch(input)
						.then((response) => response.json())
						.then((data) => {
							if (callback != null) { callback(data); }
						});
				break;
				case "svg":
					SVG.load(input, function(svg) {
						let fold = svg_to_fold(svg);
						if (callback != null) { callback(fold); }
					});
				break;
				case "oripa":
					// ORIPA.load(input, function(fold) {
					// 	if (callback != null) { callback(fold); }
					// });
				break;
			}
		}
	}
}


export const intoFOLD = function(input, callback) {
	load_file(input, function(fold) {
		if (callback != null) { callback(fold); }
	})
}

export const intoSVG = function(input, callback) {
	load_file(input, function(fold) {
		let svg = fold_to_svg(fold);
		if (callback != null) { 
			callback(svg);
		}
	})
}

export const intoORIPA = function(input, callback) {

}

export const svg_to_fold = function(svg) {
	// for each geometry, add creases without regards to invalid planar edge crossings
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
	// todo: import semgents into a planar graph, handle edge crossings
	segments(svg).forEach(l =>
		Origami.add_edge_between_points(graph, l[0], l[1], l[2], l[3])
	);
	return graph;
}

/**
 * specify a frame number otherwise it will render the top level
 */
export const fold_to_svg = function(fold, frame_number = 0) {
	console.log("fold_to_svg start");
	let graph = frame_number
		? flatten_frame(fold, frame_number)
		: fold;
	// if (isFolded(graph)) { }
	let svg = SVG.svg();
	svg.setAttribute("x", "0px");
	svg.setAttribute("y", "0px");
	svg.setAttribute("width", "600px");
	svg.setAttribute("height", "600px");
	let groupNames = ["boundary", "face", "crease", "vertex"];
	let groups = groupNames.map(key => svg.group().setID(groupNamesPlural[key]));
	console.log("fold_to_svg about to fill");
	console.log(svg, groups);
	// return svg;
	SVGHelper.fill_svg_groups(graph, ...groups);
	SVG.setViewBox(svg, ...bounding_rect(graph));
	console.log("fold_to_svg done");
	return svg;
}

const groupNamesPlural = {
	boundary: "boundaries",
	face: "faces",
	crease: "creases",
	vertex: "vertices"
};



const load_fold_object = function(input) {

}
const load_svg_element = function(input) {

}
const load_svg_filename = function(input) {

}
