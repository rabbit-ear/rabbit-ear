/** Simple .FOLD file view
 * converts .fold file into SVG, binds it to the DOM
 *   constructor arguments:
 *   - fold file
 *   - DOM object, or "string" DOM id
 * example:
 *   let origami = new FoldView().load("crane.fold");
 */

"use strict";

import SVG from "./SimpleSVG";

const CREASE_DIR = {
	"B": "boundary",
	"M": "mountain",
	"V": "valley",
	"F": "mark",
	"U": "mark"
};

const emptyFoldFile = {"file_spec":1.1,"file_creator":"Rabbit Ear","file_author":"","file_classes":["singleModel"],"frame_attributes":["2D"],"frame_classes":["foldedState"],"vertices_coords":[[0,0],[1,0],[1,1],[0,1]],"edges_vertices":[[0,1],[1,2],[2,3],[3,0]],"edges_assignment":["B","B","B","B"],"faces_vertices":[[0,1,2,3]],"faces_layer":[0],"faces_matrix":[[1,0,0,1,0,0]],"file_frames":[{"frame_classes":["creasePattern"],"parent":0,"inherit":true}]};


function flatten_frame(fold_file, frame_num){
	if(frame_num == undefined ||
	   fold_file.file_frames == undefined ||
	   fold_file.file_frames[frame_num] == undefined ||
	   fold_file.file_frames[frame_num].vertices_coords == undefined){
		throw "fold file has no frame number " + frame_num;
		return;
	}
	const dontCopy = ["parent", "inherit"];
	let fold = JSON.parse(JSON.stringify(fold_file));
	let keys = Object.keys(fold.file_frames[frame_num]).filter(key =>
		!dontCopy.includes(key)
	)
	keys.forEach(key => fold[key] = fold.file_frames[frame_num][key] )
	fold.file_frames = null;
	return fold;
}


export default class FoldView{

	constructor() {
		//  from arguments, get a fold file, if it exists
		let args = Array.from(arguments);
		this.cp = args.filter(arg =>
			typeof arg == "object" && arg.vertices_coords != undefined
		).shift();
		if(this.cp == undefined){ this.cp = emptyFoldFile; }

		// create a new SVG
		this.svg = SVG.SVG();

		//  from arguments, get a parent DOM vertex for the new SVG as
		//  an HTML element or as a id-string
		//  but wait until after the <body> has rendered
		let that = this;
		document.addEventListener("DOMContentLoaded", function(){
			let parent = args.filter((arg) =>
				arg instanceof HTMLElement
			).shift();
			if(parent == undefined){
				let idString = args.filter((a) =>
					typeof a === "string" || a instanceof String
				).shift();
				if(idString != undefined){
					parent = document.getElementById(idString);
				}
			}
			if(parent == undefined){ parent = document.body; }
			parent.appendChild(that.svg);
		});

		// prepare SVG
		this.boundary = SVG.group(null, "boundary");
		this.faces = SVG.group(null, "faces");
		this.creases = SVG.group(null, "creases");
		this.vertices = SVG.group(null, "vertices");
		this.svg.appendChild(this.boundary);
		this.svg.appendChild(this.faces);
		this.svg.appendChild(this.creases);
		this.svg.appendChild(this.vertices);

		// view properties
		this.frame = undefined; // which frame (0 ..< Inf) to display 
		this.zoom = 1.0;
		this.padding = 0.01;  // padding inside the canvas
		this.style = {
			vertex:{ radius: 0.01 },  // radius, percent of page
		};

		this.draw();
	}
	isFolded(){
		if(this.cp == undefined || this.cp.frame_classes == undefined){ return false; }
		let frame_classes = this.cp.frame_classes;
		if(this.frame != undefined &&
		   this.cp.file_frames[this.frame] != undefined &&
		   this.cp.file_frames[this.frame].frame_classes != undefined){
			frame_classes = this.cp.file_frames[this.frame].frame_classes;
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
	setPadding(padding){
		if(padding != undefined){
			this.padding = padding;
			// this.setViewBox();
			this.draw();
		}
		return this;
	}
	setViewBox(){
		let vertices = this.cp.vertices_coords;
		if(this.frame != undefined &&
		   this.cp.file_frames[this.frame] != undefined &&
		   this.cp.file_frames[this.frame].vertices_coords != undefined){
			vertices = this.cp.file_frames[this.frame].vertices_coords;
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
		this.bounds = isInvalid ? unitBounds : {origin: origin, size: size};
		// todo: this is maybe not the best zoom operation
		let d = (this.bounds.size.width / this.zoom) - this.bounds.size.width;
		let oX = this.bounds.origin.x - d;
		let oY = this.bounds.origin.y - d;
		let width = this.bounds.size.width + d * 2;
		let height = this.bounds.size.height + d * 2;
		let viewBoxString = [
			(-this.padding+oX),
			(-this.padding+oY),
			(this.padding*2+width),
			(this.padding*2+height)
		].join(" ");
		this.svg.setAttribute("viewBox", viewBoxString);
	}

	draw(){
		let data = this.cp;
		// if a frame is set, copy data from that frame
		if(this.frame != undefined &&
		   this.cp.file_frames[this.frame] != undefined &&
		   this.cp.file_frames[this.frame].vertices_coords != undefined){
			data = flatten_frame(this.cp, this.frame);
		}
		if(data.vertices_coords == undefined){ return; }
		this.setViewBox();
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
		// clear layers
		[this.boundary,
		 this.faces,
		 this.creases,
		 this.vertices].forEach((layer) => {
			while(layer.lastChild) {
				layer.removeChild(layer.lastChild);
			}
		});
		// vertices
		let vertexR = this.style.vertex.radius
		verts.forEach((v,i) => {
			let dot = SVG.circle(v[0], v[1], vertexR, "vertex");
			this.vertices.appendChild(dot);
		});
		// edges
		if(!this.isFolded()){
			edges.forEach((e,i) => {
				let creaseline = SVG.line(e[0][0], e[0][1], e[1][0], e[1][1], orientations[i]);
				this.creases.appendChild(creaseline);
			});
		}
		// faces
		let faceClass = (this.isFolded() ? "face folded" : "face");
		faces.forEach(f => {
			let poly = SVG.polygon(f, faceClass);
			this.faces.appendChild(poly);
		});
	}

	getFrames(){
		return this.cp.file_frames;
	}
	getFrame(index){
		return this.cp.file_frames[index];
	}
	setFrame(index){
		this.frame = index;
		this.draw();
	}

	showVertices(){ origami.vertices.setAttribute("display", "");}
	hideVertices(){ origami.vertices.setAttribute("display", "none");}
	showEdges(){ origami.creases.setAttribute("display", "");}
	hideEdges(){ origami.creases.setAttribute("display", "none");}
	showFaces(){ origami.faces.setAttribute("display", "");}
	hideFaces(){ origami.faces.setAttribute("display", "none");}

	load(input, callback){ // epsilon
		// are they giving us a filename, or the data of an already loaded file?
		let that = this;
		if (typeof input === 'string' || input instanceof String){
			let extension = input.substr((input.lastIndexOf('.') + 1));
			// filename. we need to upload
			switch(extension){
				case 'fold':
				fetch(input)
					.then((response) => response.json())
					.then((data) => {
						that.cp = data;
						that.draw();
						if(callback != undefined){ callback(that.cp); }
					});
				return that;
			}
		}
		try{
			// try .fold file format first
			let foldFileImport = JSON.parse(input);
			that.cp = foldFileImport;
			return that;
		} catch(err){
			console.log("not a valid .fold file format")
			return that;
		}
	}
}
