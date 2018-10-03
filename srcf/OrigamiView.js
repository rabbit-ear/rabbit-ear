import * as SVG from './SimpleSVG.js'

'use strict';

var svgNS = 'http://www.w3.org/2000/svg';

var creaseTypeDictionary = {
	"B": "boundary",
	"M": "mountain",
	"V": "valley",
	"F": "mark",
	"U": "mark"
}

export default class OrigamiView{

	onResize(event){ }
	animate(event){ }
	onMouseDown(event){ }
	onMouseUp(event){ }
	onMouseMove(event){ }
	onMouseDidBeginDrag(event){ }

	constructor() {
		//  from arguments, get a fold file, if it exists
		var args = []; for(var i = 0; i < arguments.length; i++){ args.push(arguments[i]); }
		// this.cp = args.filter(function(arg){ return arg instanceof PlanarGraph },this).shift();
		// if(this.cp == undefined){ this.cp = new CreasePattern(); }
		this.svg = SVG.SVG();

		this.cp = {}

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

		// create the OrigamiPaper object
		this.line = SVG.line;
		this.circle = SVG.circle;
		this.polygon = SVG.polygon;
		this.bezier = SVG.bezier;
		this.group = SVG.group;
		this.SVG = SVG.SVG;
		this.addClass = SVG.addClass;
		this.removeClass = SVG.removeClass;
		this.convertToViewbox = SVG.convertToViewbox;
		this.facesLayer = this.group(null, 'faces');
		this.junctionsLayer = this.group(null, 'junctions');
		this.sectorsLayer = this.group(null, 'sectors');
		this.creasesLayer = this.group(null, 'creases');
		this.boundaryLayer = this.group(null, 'boundary');
		this.nodesLayer = this.group(null, 'nodes');
		this.svg.appendChild(this.boundaryLayer);
		this.svg.appendChild(this.facesLayer);
		this.svg.appendChild(this.junctionsLayer);
		this.svg.appendChild(this.sectorsLayer);
		this.svg.appendChild(this.creasesLayer);
		this.svg.appendChild(this.nodesLayer);

		this.isFolded = false;
		this.zoom = 1.0;
		this.padding = 0.01;  // padding inside the canvas
	
		this.mouse = {
			position: {'x':0,'y':0},  // the current position of the mouse
			pressed: {'x':0,'y':0},   // the last location the mouse was pressed
			isPressed: false,         // is the mouse button pressed (y/n)
			isDragging: false         // is the mouse moving while pressed (y/n)
		};

		this.style = {
			node:{ radius: 0.01 },
			sector:{ scale: 0.5 },
			face:{ scale:1.0 },
			selected:{
				node:{ radius: 0.02 },
				edge:{ strokeColor:{ hue:0, saturation:0.8, brightness:1 } },
				face:{ fillColor:{ hue:0, saturation:0.8, brightness:1 } }
			}
		}

		this.draw();

		this.svg.onmousedown = function(event){
			that.mouse.isPressed = true;
			that.mouse.isDragging = false;
			that.mouse.pressed = that.convertToViewbox(that.svg, event.clientX, event.clientY);
			// that.attemptSelection();
			that.onMouseDown( {point:Object.assign({}, that.mouse.pressed)} );
		}
		this.svg.onmouseup = function(event){
			that.mouse.isPressed = false;
			that.mouse.isDragging = false;
			that.selectedTouchPoint = undefined;
			that.onMouseUp( {point:that.convertToViewbox(that.svg, event.clientX, event.clientY)} );
		}
		this.svg.onmousemove = function(event){
			that.mouse.position = that.convertToViewbox(that.svg, event.clientX, event.clientY);
			if(that.mouse.isPressed){ 
				if(that.mouse.isDragging === false){
					that.mouse.isDragging = true;
					that.onMouseDidBeginDrag( {point:Object.assign({}, that.mouse.position)} );
				}
			}
			// that.updateSelected();
			that.onMouseMove( {point:Object.assign({}, that.mouse.position)} );
		}
		this.svg.onResize = function(event){
			that.onResize(event);
		}
		// javascript get Date()
		var frameNum = 0
		this.animateTimer = setInterval(function(){
			that.animate({'time':that.svg.getCurrentTime(),'frame':frameNum});
			frameNum += 1;
		}, 1000/60);
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
		this.bounds = { origin:{x:0,y:0}, size:{width:1, height:1} };
		// todo: this is maybe not the best zoom operation
		var d = (this.bounds.size.width / this.zoom) - this.bounds.size.width;
		var oX = this.bounds.origin.x - d;
		var oY = this.bounds.origin.y - d;
		var width = this.bounds.size.width + d*2;
		var height = this.bounds.size.height + d*2;
		this.svg.setAttribute("viewBox", (-this.padding+oX) + " " + (-this.padding+oY) + " " + (this.padding*2+width) + " " + (this.padding*2+height));
	}


	showNodes(){ origami.nodesLayer.setAttribute('display', '');}
	showEdges(){ origami.creasesLayer.setAttribute('display', '');}
	showFaces(){ origami.facesLayer.setAttribute('display', '');}
	showSectors(){ origami.sectorsLayer.setAttribute('display', '');}
	hideNodes(){ origami.nodesLayer.setAttribute('display', 'none');}
	hideEdges(){ origami.nodesLayer.setAttribute('display', 'none');}
	hideFaces(){ origami.nodesLayer.setAttribute('display', 'none');}
	hideSectors(){ origami.nodesLayer.setAttribute('display', 'none');}

	draw(){
		if(this.cp.vertices_coords == undefined){ return; }

		var verts = this.cp.vertices_coords;
		var edges = this.cp.edges_vertices.map(ev => [verts[ev[0]], verts[ev[1]]])
		var orientations = this.cp.edges_assignment.map(a => creaseTypeDictionary[a])
		var faces = this.cp.faces_vertices.map(fv => fv.map(v => verts[v]))

		this.setViewBox();

		[this.boundaryLayer, this.facesLayer, this.junctionsLayer, this.sectorsLayer, this.creasesLayer, this.nodesLayer].forEach(function(layer){
			while(layer.lastChild) {
				layer.removeChild(layer.lastChild);
			}
		},this);
		
		edges.forEach((e,i) => this.addEdge(e, orientations[i]));
		faces.forEach(f => this.addFace(f))
	}
	addEdge(edge, orientation){
		if(orientation == undefined){ orientation = "mark"; }
		var creaseline = this.line(edge[0][0], edge[0][1], edge[1][0], edge[1][1], orientation, 'edge');
		this.creasesLayer.appendChild(creaseline);
	}
	addFace(points){
		var poly = this.polygon(points, (this.isFolded) ? 'face folded' : 'face', 'face');
		this.facesLayer.appendChild(poly);
	}

}
