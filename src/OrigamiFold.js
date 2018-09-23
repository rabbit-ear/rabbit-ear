import FileImport from './SVGLoader.js'
import {GraphNode, GraphEdge} from './compiled/src/graph.js'
import {PlanarFace, PlanarSector, PlanarGraph} from './compiled/src/planarGraph.js'
import CreasePattern from './compiled/src/CreasePattern.js'
import * as SVG from './SimpleSVG.js'

'use strict';

var svgNS = 'http://www.w3.org/2000/svg';

export default class OrigamiFold{

	onResize(event){ }
	animate(event){ }
	onMouseDown(event){ }
	onMouseUp(event){ }
	onMouseMove(event){ }
	onMouseDidBeginDrag(event){ }

	constructor() {
		//  from arguments, get a CreasePattern() object
		var args = []; for(var i = 0; i < arguments.length; i++){ args.push(arguments[i]); }
		this.cp = args.filter(function(arg){ return arg instanceof PlanarGraph },this).shift();
		if(this.cp == undefined){ this.cp = new CreasePattern(); }
		this.svg = SVG.SVG();

		//  from arguments, get a parent DOM node for the new SVG as an HTML element or as a id-string
		//  but wait until after the <body> has rendered
		var that = this;
		document.addEventListener("DOMContentLoaded", function(){
			var parent = args.filter(function(arg){ return arg instanceof HTMLElement },this).shift();
			if(parent == undefined){
				var idString = args.filter(function(a){ return typeof a === 'string' || a instanceof String;},that).shift();
				if(idString != undefined){ parent = document.getElementById(idString); }
			}
			if(parent == undefined){ parent = document.body; }
			parent.appendChild(that.svg);
		});

		// create the OrigamiFold object
		this.line = SVG.line;
		this.circle = SVG.circle;
		this.polygon = SVG.polygon;
		this.group = SVG.group;
		this.SVG = SVG.SVG;
		this.addClass = SVG.addClass;
		this.removeClass = SVG.removeClass;
		this.convertToViewbox = SVG.convertToViewbox;
		this.facesLayer = SVG.group(null, 'faces');
		this.junctionsLayer = SVG.group(null, 'junctions');
		this.sectorsLayer = SVG.group(null, 'sectors');
		this.edgesLayer = SVG.group(null, 'creases');
		this.boundaryLayer = SVG.group(null, 'boundary');
		this.nodesLayer = SVG.group(null, 'nodes');
		this.svg.appendChild(this.boundaryLayer);
		this.svg.appendChild(this.facesLayer);
		this.svg.appendChild(this.junctionsLayer);
		this.svg.appendChild(this.sectorsLayer);
		this.svg.appendChild(this.edgesLayer);
		this.svg.appendChild(this.nodesLayer);

		// which face will lie flat, other faces fold around it
		this.holdPoint = undefined; //{x:0.5, y:0.5}; 
		this.padding = 0.0;  // padding inside the canvas
		this.mouseZoom = true;
		this.zoom = 1.0;
		this.rotation = 0;
		this.bounds = {'origin':{'x':0,'y':0},'size':{'width':1.0, 'height':1.0}};
		this.mouse = {
			position: {'x':0,'y':0},  // the current position of the mouse
			pressed: {'x':0,'y':0},   // the last location the mouse was pressed
			isPressed: false,         // is the mouse button pressed (y/n)
			isDragging: false         // is the mouse moving while pressed (y/n)
		};
		this.style = { };

		this.draw();

		var that = this;
		this.svg.onmousedown = function(event){
			that.mouse.isPressed = true;
			that.mouse.isDragging = false;
			that.mouse.pressed = SVG.convertToViewbox(that.svg, event.clientX, event.clientY);
			that.zoomOnMousePress = that.zoom;
			that.rotationOnMousePress = that.rotation;
			// that.attemptSelection();
			that.onMouseDown( {point:Object.assign({}, that.mouse.pressed)} );
		}
		this.svg.onmouseup = function(event){
			that.mouse.isPressed = false;
			that.mouse.isDragging = false;
			that.selectedTouchPoint = undefined;
			that.onMouseUp( {point:SVG.convertToViewbox(that.svg, event.clientX, event.clientY)} );
		}
		this.svg.onmousemove = function(event){
			that.mouse.position = SVG.convertToViewbox(that.svg, event.clientX, event.clientY);
			if(that.mouse.isPressed){ 
				if(that.mouse.isDragging == false){
					that.mouse.isDragging = true;
					that.onMouseDidBeginDrag( {point:Object.assign({}, that.mouse.position)} );
				}
				if(that.mouseZoom){
					that.zoom = that.zoomOnMousePress + 0.01 * (that.mouse.pressed.y - that.mouse.position.y);
					that.rotation = that.rotationOnMousePress + (that.mouse.pressed.x - that.mouse.position.x);
					if(that.zoom < 0.02){ that.zoom = 0.02; }
					if(that.zoom > 100){ that.zoom = 100; }
					that.setViewBox();
				}
			}
			// that.updateSelected();
			that.onMouseMove( {point:Object.assign({}, that.mouse.position)} );
		}
		this.svg.onResize = function(event){
			that.onResize(event);
		}
	}
	reset(){
		this.zoom = 1.0;
		this.rotation = 0;
		this.setViewBox();
	}

	getBounds(){
		if(this.foldedCP === undefined){ 
			this.bounds = {'origin':{'x':0,'y':0},'size':{'width':1.0, 'height':1.0}};
			return;
		}
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;
		this.foldedCP.vertices_coords.forEach(function(point){
			if(point[0] > maxX){ maxX = point[0]; }
			if(point[0] < minX){ minX = point[0]; }
			if(point[1] > maxY){ maxY = point[1]; }
			if(point[1] < minY){ minY = point[1]; }
		},this);
		this.bounds = {'origin':{'x':minX,'y':minY},'size':{'width':maxX-minX, 'height':maxY-minY}};
	}

	setPadding(padding){
		if(padding != undefined){
			this.padding = padding;
			this.setViewBox();
		}
		return this;
	}
	setViewBox(){
		// todo: need protections if cp is returning no bounds
		this.getBounds();
		this.svg.setAttribute("viewBox", (-this.padding+this.bounds.origin.x) + " " + (-this.padding+this.bounds.origin.y) + " " + (this.bounds.size.width+this.padding*2) + " " + (this.bounds.size.height+this.padding*2));
	}

	update(){
		this.facesLayer.childNodes.forEach(function(face){ face.setAttributeNS(null, 'class', 'face'); },this);
	}

	draw(groundFace){
		this.setViewBox();

		if(this.holdPoint != undefined){ groundFace = this.cp.nearest(this.holdPoint).face; }

		this.foldedCP = this.cp.fold(groundFace);
		this.getBounds();
		this.faces = [];

		[this.boundaryLayer, this.facesLayer, this.junctionsLayer, this.sectorsLayer, this.edgesLayer, this.nodesLayer].forEach(function(layer){
			while(layer.lastChild) {
				layer.removeChild(layer.lastChild);
			}
		},this);

		if(this.foldedCP != undefined){
			this.foldedCP.faces_vertices
				.map(function(face){
					return face.map(function(nodeIndex){
						return this.foldedCP.vertices_coords[nodeIndex];
					},this);
				},this)
				.forEach(function(faceNodes, i){ this.addFace(faceNodes); },this);
		}
		this.setViewBox();
	}
	
	addFace(vertices, index){
		var polygon = SVG.polygon(vertices, 'folded-face', 'face-' + index);
		this.facesLayer.appendChild(polygon);
	}

	load(path, callback){ // (svg, callback, epsilon){}
		// this.cp = new FileImport(path);
		// this.draw();
		// return;

		// figure out the file extension
		var extension = 'svg';
		var that = this;
		switch(extension){
			case 'fold':
			fetch(path)
				.then(function(response){ return response.json(); })
				.then(function(data){

				});
			break;
			case 'svg':
			fetch(path)
				.then(response => response.text())
				.then(function(string){
					that.cp = new FileImport(string);
					that.draw();
					if(callback != undefined){ callback(that.cp); }
				});
			break;
		}
		return this;
	}

}
