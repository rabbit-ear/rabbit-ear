import * as Origami from "../fold/origami";
import * as SVG from "../../include/svg";
import * as Segmentize from "../../include/svg-segmentize";
import { flatten_frame } from "../fold/file";
import { bounding_rect } from "../fold/planargraph";
import * as FoldToSVG from "../draw/toSVG";
import { default as ORIPA } from "./oripa";
// import * as Fold from "../include/fold";


/** parser error to check against */
const pErr = (new window.DOMParser())
	.parseFromString("INVALID", "text/xml")
	.getElementsByTagName("parsererror")[0]
	.namespaceURI;

/**
 * this asynchronously or synchronously loads data from "input",
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
			if (fold.vertices_coords == null) {
				throw "tried FOLD format, got empty object";
			}
			if (callback != null) {
				callback(fold);
			}
			return fold; // asynchronous loading was not required
		} catch(err) {
			if (input instanceof Element){
				let fold = svg_to_fold(input);
				if (callback != null) {
					callback(fold);
				}
				return fold; // asynchronous loading was not required
			} else {
				// console.warn("could not load file, object is either not valid FOLD or corrupt JSON.", err);
			}
		} 
		// finally {
		// 	return;  // currently not used. everything previous is already returning
		// }
	}
	// are they giving us a filename, or the data of an already loaded file?
	if (type === "string" || input instanceof String) {
		// try a FOLD format string
		try {
			// try .fold file format first
			let fold = JSON.parse(input);
			if (callback != null) { callback(fold); }
		} catch(err) {
			// try rendering the XML string
			let xml = (new window.DOMParser()).parseFromString(input, "text/xml");
			if (xml.getElementsByTagNameNS(pErr, "parsererror").length === 0) {
				let parsedSVG = xml.documentElement;
				let fold = svg_to_fold(parsedSVG);
				if (callback != null) { callback(fold); }
				return fold;
			}

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
	return load_file(input, function(fold) {
		if (callback != null) { callback(fold); }
	});
}

export const intoSVG = function(input, callback) {
	let syncFold, svg, async = false;
	// attempt to load synchronously, the callback will be called regardless,
	// we need a flag to flip when the call is done, then check if the async
	// call is in progress
	syncFold = load_file(input, function(fold) {
		if (async) {
			let svg = fold_to_svg(fold);
			if (callback != null) { 
				callback(svg);
			}
		}
	});
	async = true;
	// if the load was synchronous, syncFold will contain data. if not,
	// let the callback above finish off the conversion.
	if (syncFold !== undefined) {
		let svg = fold_to_svg(syncFold);
		if (callback != null) { 
			callback(svg);
		}
		return svg;
	}
}

export const intoORIPA = function(input, callback) {
	// coded for FOLD input only!!
	let fold = JSON.parse(JSON.stringify(input));
	return ORIPA.fromFold(fold);
}

export const svg_to_fold = function(svg) {
	// for each geometry, add creases without regards to invalid planar edge crossings
	//  (intersecting lines, duplicate vertices), clean up later.
	let graph = {
		"file_spec": 1.1,
		"file_creator": "Rabbit Ear",
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
	let vl = graph.vertices_coords.length;
	let segments = Segmentize.withAttributes(svg);

	graph.vertices_coords = segments.map(s => [[s.x1, s.y1], [s.x2, s.y2]])
		.reduce((a,b) => a.concat(b), []);
	graph.edges_vertices = segments.map((_,i) => [vl+i*2, vl+i*2+1]);
	graph.edges_assignment = segments.map(l => color_to_assignment(l.stroke));
	graph.edges_foldAngle = graph.edges_assignment.map(a => 
		(a === "M" ? -180 : (a === "V" ? 180 : 0))
	);
	// console.log("svg_to_fold");
	// todo: import semgents into a planar graph, handle edge crossings

	// Graph.makeComplete(graph);
	return graph;
}

const color_to_assignment = function(string) {
	// cannot discern between mark and boundary
	// boundary has to be decided by planar analysis
	let c = [0,0,0,1];
	if (string[0] === "#") {
		c = hexToComponents(string);
	} else if (css_color_names.indexOf(string) !== -1) {
		c = hexToComponents(css_colors[string]);
	}
	//
	const ep = 0.05;
	// black
	if (c[0] < ep && c[1] < ep && c[2] < ep) { return "F"; }
	if (c[0] > c[1] && (c[0] - c[2]) > ep) { return "V"; }
	if (c[2] > c[1] && (c[2] - c[0]) > ep) { return "M"; }
	return "F";
}

const hexToComponents = function(h) {
	let r = 0, g = 0, b = 0, a = 255;
	// 3 digits
	if (h.length == 4) {
		r = "0x" + h[1] + h[1];
		g = "0x" + h[2] + h[2];
		b = "0x" + h[3] + h[3];
	// 6 digits
	} else if (h.length == 7) {
		r = "0x" + h[1] + h[2];
		g = "0x" + h[3] + h[4];
		b = "0x" + h[5] + h[6];
	} else if (h.length == 5) {
		r = "0x" + h[1] + h[1];
		g = "0x" + h[2] + h[2];
		b = "0x" + h[3] + h[3];
		a = "0x" + h[4] + h[4];
	} else if (h.length == 9) {
		r = "0x" + h[1] + h[2];
		g = "0x" + h[3] + h[4];
		b = "0x" + h[5] + h[6];
		a = "0x" + h[7] + h[8];
	}
	return [+(r / 255), +(g / 255), +(b / 255), +(a / 255)];
}
/**
 * specify a frame number otherwise it will render the top level
 */
export const fold_to_svg = function(fold, frame_number = 0) {
	// console.log("fold_to_svg start");
	let graph = frame_number
		? flatten_frame(fold, frame_number)
		: fold;
	// if (isFolded(graph)) { }
	let svg = SVG.svg();
	svg.setAttribute("x", "0px");
	svg.setAttribute("y", "0px");
	svg.setAttribute("width", "600px");
	svg.setAttribute("height", "600px");
	let groupNames = ["boundary", "face", "crease", "vertex"]
		.map(singular => groupNamesPlural[singular])
	let groups = groupNames.map(key => svg.group().setID(key));
	let obj = { ...groups };
	// console.log("fold_to_svg about to fill");
	// console.log(svg, {...groups});
	// return svg;
	FoldToSVG.intoGroups(graph, {...groups});
	SVG.setViewBox(svg, ...bounding_rect(graph));
	// console.log("fold_to_svg done");
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

const css_colors = {
	"black": "#000000",
	"silver": "#c0c0c0",
	"gray": "#808080",
	"white": "#ffffff",
	"maroon": "#800000",
	"red": "#ff0000",
	"purple": "#800080",
	"fuchsia": "#ff00ff",
	"green": "#008000",
	"lime": "#00ff00",
	"olive": "#808000",
	"yellow": "#ffff00",
	"navy": "#000080",
	"blue": "#0000ff",
	"teal": "#008080",
	"aqua": "#00ffff",
	"orange": "#ffa500",
	"aliceblue": "#f0f8ff",
	"antiquewhite": "#faebd7",
	"aquamarine": "#7fffd4",
	"azure": "#f0ffff",
	"beige": "#f5f5dc",
	"bisque": "#ffe4c4",
	"blanchedalmond": "#ffebcd",
	"blueviolet": "#8a2be2",
	"brown": "#a52a2a",
	"burlywood": "#deb887",
	"cadetblue": "#5f9ea0",
	"chartreuse": "#7fff00",
	"chocolate": "#d2691e",
	"coral": "#ff7f50",
	"cornflowerblue": "#6495ed",
	"cornsilk": "#fff8dc",
	"crimson": "#dc143c",
	"cyan": "#00ffff",
	"darkblue": "#00008b",
	"darkcyan": "#008b8b",
	"darkgoldenrod": "#b8860b",
	"darkgray": "#a9a9a9",
	"darkgreen": "#006400",
	"darkgrey": "#a9a9a9",
	"darkkhaki": "#bdb76b",
	"darkmagenta": "#8b008b",
	"darkolivegreen": "#556b2f",
	"darkorange": "#ff8c00",
	"darkorchid": "#9932cc",
	"darkred": "#8b0000",
	"darksalmon": "#e9967a",
	"darkseagreen": "#8fbc8f",
	"darkslateblue": "#483d8b",
	"darkslategray": "#2f4f4f",
	"darkslategrey": "#2f4f4f",
	"darkturquoise": "#00ced1",
	"darkviolet": "#9400d3",
	"deeppink": "#ff1493",
	"deepskyblue": "#00bfff",
	"dimgray": "#696969",
	"dimgrey": "#696969",
	"dodgerblue": "#1e90ff",
	"firebrick": "#b22222",
	"floralwhite": "#fffaf0",
	"forestgreen": "#228b22",
	"gainsboro": "#dcdcdc",
	"ghostwhite": "#f8f8ff",
	"gold": "#ffd700",
	"goldenrod": "#daa520",
	"greenyellow": "#adff2f",
	"grey": "#808080",
	"honeydew": "#f0fff0",
	"hotpink": "#ff69b4",
	"indianred": "#cd5c5c",
	"indigo": "#4b0082",
	"ivory": "#fffff0",
	"khaki": "#f0e68c",
	"lavender": "#e6e6fa",
	"lavenderblush": "#fff0f5",
	"lawngreen": "#7cfc00",
	"lemonchiffon": "#fffacd",
	"lightblue": "#add8e6",
	"lightcoral": "#f08080",
	"lightcyan": "#e0ffff",
	"lightgoldenrodyellow": "#fafad2",
	"lightgray": "#d3d3d3",
	"lightgreen": "#90ee90",
	"lightgrey": "#d3d3d3",
	"lightpink": "#ffb6c1",
	"lightsalmon": "#ffa07a",
	"lightseagreen": "#20b2aa",
	"lightskyblue": "#87cefa",
	"lightslategray": "#778899",
	"lightslategrey": "#778899",
	"lightsteelblue": "#b0c4de",
	"lightyellow": "#ffffe0",
	"limegreen": "#32cd32",
	"linen": "#faf0e6",
	"magenta": "#ff00ff",
	"mediumaquamarine": "#66cdaa",
	"mediumblue": "#0000cd",
	"mediumorchid": "#ba55d3",
	"mediumpurple": "#9370db",
	"mediumseagreen": "#3cb371",
	"mediumslateblue": "#7b68ee",
	"mediumspringgreen": "#00fa9a",
	"mediumturquoise": "#48d1cc",
	"mediumvioletred": "#c71585",
	"midnightblue": "#191970",
	"mintcream": "#f5fffa",
	"mistyrose": "#ffe4e1",
	"moccasin": "#ffe4b5",
	"navajowhite": "#ffdead",
	"oldlace": "#fdf5e6",
	"olivedrab": "#6b8e23",
	"orangered": "#ff4500",
	"orchid": "#da70d6",
	"palegoldenrod": "#eee8aa",
	"palegreen": "#98fb98",
	"paleturquoise": "#afeeee",
	"palevioletred": "#db7093",
	"papayawhip": "#ffefd5",
	"peachpuff": "#ffdab9",
	"peru": "#cd853f",
	"pink": "#ffc0cb",
	"plum": "#dda0dd",
	"powderblue": "#b0e0e6",
	"rosybrown": "#bc8f8f",
	"royalblue": "#4169e1",
	"saddlebrown": "#8b4513",
	"salmon": "#fa8072",
	"sandybrown": "#f4a460",
	"seagreen": "#2e8b57",
	"seashell": "#fff5ee",
	"sienna": "#a0522d",
	"skyblue": "#87ceeb",
	"slateblue": "#6a5acd",
	"slategray": "#708090",
	"slategrey": "#708090",
	"snow": "#fffafa",
	"springgreen": "#00ff7f",
	"steelblue": "#4682b4",
	"tan": "#d2b48c",
	"thistle": "#d8bfd8",
	"tomato": "#ff6347",
	"turquoise": "#40e0d0",
	"violet": "#ee82ee",
	"wheat": "#f5deb3",
	"whitesmoke": "#f5f5f5",
	"yellowgreen": "#9acd32"
};

const css_color_names = Object.keys(css_colors);