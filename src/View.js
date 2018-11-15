/** .FOLD file viewer
 * this is an SVG based front-end for the .fold file format
 *  (.fold file spec: https://github.com/edemaine/fold)
 *
 *  View constructor arguments:
 *   - fold file
 *   - DOM object, or "string" DOM id
 * example:
 *   let origami = new View().load("crane.fold");
 */

const CREASE_DIR = {
	"B": "boundary",
	"M": "mountain",
	"V": "valley",
	"F": "mark",
	"U": "mark"
};

import * as SVG from "../lib/svg";
import * as Folder from "./Folder"
import { unitSquare } from "./OrigamiBases"

export default function View(){

	let { zoom, translate, appendChild, setViewBox, getViewBox,
		scale, svg, width, height,
		// onMouseMove, onMouseDown, onMouseUp, onMouseLeave, onMouseEnter
	} = SVG.View(...arguments);

	//  from arguments, get a fold file, if it exists
	let args = Array.from(arguments);
	let _cp = args.filter(arg =>
		typeof arg == "object" && arg.vertices_coords != undefined
	).shift();
	if(_cp == undefined){ _cp = unitSquare; }

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
	let padding = 0.01;  // padding inside the canvas
	let _zoom = 1.0;
	let style = {
		vertex:{ radius: 0.01 },  // radius, percent of page
	};
	let _mouse = {
		isPressed: false,// is the mouse button pressed (y/n)
		position: [0,0], // the current position of the mouse
		pressed: [0,0],  // the last location the mouse was pressed
		drag: [0,0],     // vector, displacement from start to now
		prev: [0,0],     // on mouseMoved, this was the previous location
		x: 0,      // redundant data --
		y: 0       // -- these are the same as position
	};

	// const setPadding = function(pad){
	// 	if(pad != null){
	// 		padding = pad;
	// 		// this.setViewBox();
	// 		draw();
	// 	}
	// }

	const updateViewBox = function(){
		let vertices = _cp.vertices_coords;
		if(frame > 0 &&
		   _cp.file_frames[frame - 1] != undefined &&
		   _cp.file_frames[frame - 1].vertices_coords != undefined){
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
			SVG.setViewBox(svg, 0, 0, 1, 1, padding);
		} else{
			SVG.setViewBox(svg, boundsX, boundsY, boundsW, boundsH, padding);
		}
	}

	const draw = function(){
		let data = _cp;
		// if a frame is set, copy data from that frame
		if(frame > 0 && _cp.file_frames != null){
			if(_cp.file_frames[frame - 1] != undefined &&
		   	   _cp.file_frames[frame - 1].vertices_coords != undefined){
				data = Folder.flattenFrame(_cp, frame);
			}
		}
		if(data.vertices_coords == undefined){ return; }
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
		let faceOrder = (data.faces_layer != undefined && data.faces_layer.length == data.faces_vertices.length)
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
		if(!isFoldedState()){
			let vertexR = style.vertex.radius;
			verts.forEach((v,i) => SVG.circle(v[0], v[1], vertexR, "vertex", null, groups.vertices));
		}
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
		updateViewBox();
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
						_cp = data;
						draw();
						if(callback != undefined){ callback(_cp); }
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
	const isFoldedState = function(){
		if(_cp == undefined || _cp.frame_classes == undefined){ return false; }
		let frame_classes = _cp.frame_classes;
		if(frame > 0 &&
		   _cp.file_frames[frame - 1] != undefined &&
		   _cp.file_frames[frame - 1].frame_classes != undefined){
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

	const getFrames = function(){ return _cp.file_frames; }
	const getFrame = function(index){ return _cp.file_frames[index]; }
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



	let _onmousemove, _onmousedown, _onmouseup, _onmouseleave, _onmouseenter;

	// clientX and clientY are from the browser event data
	function updateMousePosition(clientX, clientY){
		_mouse.prev = _mouse.position;
		_mouse.position = SVG.convertToViewBox(svg, clientX, clientY);
		_mouse.x = _mouse.position[0];
		_mouse.y = _mouse.position[1];
	}

	function updateHandlers(){
		svg.onmousemove = function(event){
			updateMousePosition(event.clientX, event.clientY);
			if(_mouse.isPressed){
				_mouse.drag = [_mouse.position[0] - _mouse.pressed[0], 
				               _mouse.position[1] - _mouse.pressed[1]];
				_mouse.drag.x = _mouse.drag[0];
				_mouse.drag.y = _mouse.drag[1];
			}
			if(_onmousemove != null){ _onmousemove( Object.assign({}, _mouse) ); }
		}
		svg.onmousedown = function(event){
			_mouse.isPressed = true;
			_mouse.pressed = SVG.convertToViewBox(svg, event.clientX, event.clientY);
			if(_onmousedown != null){ _onmousedown( Object.assign({}, _mouse) ); }
		}
		svg.onmouseup = function(event){
			_mouse.isPressed = false;
			if(_onmouseup != null){ _onmouseup( Object.assign({}, _mouse) ); }
		}
		svg.onmouseleave = function(event){
			updateMousePosition(event.clientX, event.clientY);
			if(_onmouseleave != null){ _onmouseleave( Object.assign({}, _mouse) ); }
		}
		svg.onmouseenter = function(event){
			updateMousePosition(event.clientX, event.clientY);
			if(_onmouseenter != null){ _onmouseenter( Object.assign({}, _mouse) ); }
		}
	}

	// return Object.freeze({
	return {
		set cp(c){
			_cp = c;
			draw();
		},
		get cp(){
			return _cp;
		},
		svg,

		// groups,
		// frame,
		// zoom,
		// padding,
		// style,

		// setPadding,
		draw,
		updateViewBox,

		getFrames,
		getFrame,
		setFrame,
		showVertices,
		hideVertices,
		showEdges,
		hideEdges,
		showFaces,
		hideFaces,

		set onMouseMove(handler) {
			_onmousemove = handler;
			updateHandlers();
		},
		set onMouseDown(handler) {
			_onmousedown = handler;
			updateHandlers();
		},
		set onMouseUp(handler) {
			_onmouseup = handler;
			updateHandlers();
		},
		set onMouseLeave(handler) {
			_onmouseleave = handler;
			updateHandlers();
		},
		set onMouseEnter(handler) {
			_onmouseenter = handler;
			updateHandlers();
		}
	// });
	};

}
