/** .FOLD file viewer
 * converts .fold file into SVG, binds it to the DOM
 *   constructor arguments:
 *   - fold file
 *   - DOM object, or "string" DOM id
 * example:
 *   let origami = new FoldView().load("crane.fold");
 */

"use strict";

import SVG from "./SimpleSVG";
import * as Folder from "./Folder"
import * as Bases from "./OrigamiBases"

export default function FoldView(){

	const CREASE_DIR = {
		"B": "boundary",
		"M": "mountain",
		"V": "valley",
		"F": "mark",
		"U": "mark"
	};

	//  from arguments, get a fold file, if it exists
	let args = Array.from(arguments);
	let cp = args.filter(arg =>
		typeof arg == "object" && arg.vertices_coords != undefined
	).shift();
	if(cp == undefined){ cp = Bases.unitSquare; }

	// create a new SVG
	let svg = SVG.SVG();

	//  from arguments, get a parent DOM vertex for the new SVG as
	//  an HTML element or as a id-string
	//  but wait until after the <body> has rendered
	document.addEventListener("DOMContentLoaded", function(){
		let parent = args.filter((arg) =>
			arg instanceof HTMLElement
		).shift();
		if(parent == null){
			let idString = args.filter((a) =>
				typeof a === "string" || a instanceof String
			).shift();
			if(idString != null){
				parent = document.getElementById(idString);
			}
		}
		if(parent == null){ parent = document.body; }
		parent.appendChild(svg);
	});

	let groups = {
		boundary: SVG.group(undefined, "boundary"),
		faces: SVG.group(undefined, "faces"),
		creases: SVG.group(undefined, "creases"),
		vertices: SVG.group(undefined, "vertices"),
	}

	// prepare SVG
	svg.appendChild(groups.boundary);
	svg.appendChild(groups.faces);
	svg.appendChild(groups.creases);
	svg.appendChild(groups.vertices);

	// view properties
	let frame = 0; // which frame (0 ..< Inf) to display 
	let zoom = 1.0;
	let padding = 0.01;  // padding inside the canvas
	let style = {
		vertex:{ radius: 0.01 },  // radius, percent of page
	};

	const setPadding = function(pad){
		if(pad != null){
			padding = pad;
			// this.setViewBox();
			draw();
		}
	}

	const setViewBox = function(){
		let vertices = cp.vertices_coords;
		if(frame > 0 &&
		   cp.file_frames[frame - 1] != undefined &&
		   cp.file_frames[frame - 1].vertices_coords != undefined){
			vertices = cp.file_frames[frame - 1].vertices_coords;
		}
		const unitBounds = { origin:{x:0,y:0}, size:{width:1, height:1} };
		// calculate bounds
		let xSorted = vertices.slice().sort((a,b) => a[0] - b[0]);
		let ySorted = vertices.slice().sort((a,b) => a[1] - b[1]);
		let origin = {
			x: xSorted.shift()[0],
			y: ySorted.shift()[1]
		};
		let size = {
			width: xSorted.pop()[0] - origin.x, 
			height: ySorted.pop()[1] - origin.y
		};
		let isInvalid = isNaN(origin.x) || isNaN(origin.y) ||
					  isNaN(size.width) || isNaN(size.height);
		bounds = isInvalid ? unitBounds : {origin: origin, size: size};
		// todo: this is maybe not the best zoom operation
		let d = (bounds.size.width / zoom) - bounds.size.width;
		let oX = bounds.origin.x - d;
		let oY = bounds.origin.y - d;
		let width = bounds.size.width + d * 2;
		let height = bounds.size.height + d * 2;
		let viewBoxString = [
			(-padding+oX),
			(-padding+oY),
			(padding*2+width),
			(padding*2+height)
		].join(" ");
		svg.setAttribute("viewBox", viewBoxString);
	}

	const draw = function(importCP){
		let data = importCP != null ? importCP : cp;

		console.log(data);
		// if a frame is set, copy data from that frame
		if(frame > 0 &&
		   cp.file_frames[frame - 1] != undefined &&
		   cp.file_frames[frame - 1].vertices_coords != undefined){
			data = Folder.flattenFrame(cp, frame);
		}
		if(data.vertices_coords == undefined){ return; }
		setViewBox();
		// gather components
		let verts = data.vertices_coords;
		let edges = data.edges_vertices.map(ev => ev.map(v => verts[v]));
		let faces = data.faces_vertices.map(fv => fv.map(v => verts[v]));
		let orientations = data.edges_vertices.map((ev,i) =>
			(data.edges_assignment != undefined && 
			 data.edges_assignment[i] != undefined
				? CREASE_DIR[data.edges_assignment[i]] 
				: "mark"
			)
		);
		let faceOrder = (data.faces_layer != undefined)
			? data.faces_layer.slice()
			: data.faces_vertices.map((f,i) => i);

		let facesDirection = (data.faces_direction != undefined)
			? data.faces_direction.slice()
			: data.faces_vertices.map((f,i) => true);

		// clear layers
		[groups.boundary,
		 groups.faces,
		 groups.creases,
		 groups.vertices].forEach((layer) => SVG.removeChildren(layer));
		// vertices
		let vertexR = style.vertex.radius
		// verts.forEach((v,i) => SVG.circle(v[0], v[1], vertexR, "vertex", groups.vertices));
		verts.forEach((v,i) => SVG.circle(v[0], v[1], vertexR, "vertex", null, groups.vertices));
		// edges
		if(!isFoldedState()){
			edges.forEach((e,i) =>
				SVG.line(e[0][0], e[0][1], e[1][0], e[1][1], orientations[i], null, groups.creases)
			);
		}
		// faces
		faceOrder.forEach(i => {
			let faceClass = (!isFoldedState() ? "face" : facesDirection[i] ? "face folded" : "face-backside folded");
			SVG.polygon(faces[i], faceClass, "face", groups.faces)
		});
		// faces.forEach(f => SVG.polygon(f, faceClass, "face", this.faces));
	}

	const load = function(input, callback){ // epsilon
		// are they giving us a filename, or the data of an already loaded file?
		if (typeof input === 'string' || input instanceof String){
			let extension = input.substr((input.lastIndexOf('.') + 1));
			// filename. we need to upload
			switch(extension){
				case 'fold':
				fetch(input)
					.then((response) => response.json())
					.then((data) => {
						cp = data;
						draw();
						if(callback != undefined){ callback(cp); }
					});
				// return this;
			}
		}
		try{
			// try .fold file format first
			let foldFileImport = JSON.parse(input);
			cp = foldFileImport;
			// return this;
		} catch(err){
			console.log("not a valid .fold file format")
			// return this;
		}
	}
	const isFoldedState = function(){
		if(cp == undefined || cp.frame_classes == undefined){ return false; }
		let frame_classes = cp.frame_classes;
		if(frame > 0 &&
		   cp.file_frames[frame - 1] != undefined &&
		   cp.file_frames[frame - 1].frame_classes != undefined){
			frame_classes = cp.file_frames[frame - 1].frame_classes;
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

	const getFrames = function(){ return cp.file_frames; }
	const getFrame = function(index){ return cp.file_frames[index]; }
	const setFrame = function(index){
		frame = index;
		draw();
	}
	const showVertices = function(){ origami.vertices.setAttribute("display", "");}
	const hideVertices = function(){ origami.vertices.setAttribute("display", "none");}
	const showEdges = function(){ origami.creases.setAttribute("display", "");}
	const hideEdges = function(){ origami.creases.setAttribute("display", "none");}
	const showFaces = function(){ origami.faces.setAttribute("display", "");}
	const hideFaces = function(){ origami.faces.setAttribute("display", "none");}

	draw();

	return Object.freeze({
		cp,
		svg,

		groups,
		frame,
		zoom,
		padding,
		style,

		setPadding,
		draw,
		setViewBox,

		getFrames,
		getFrame,
		setFrame,
		showVertices,
		hideVertices,
		showEdges,
		hideEdges,
		showFaces,
		hideFaces
	});

}
