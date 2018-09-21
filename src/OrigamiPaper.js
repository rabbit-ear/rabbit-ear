import SVGLoader from './SVGLoader.js'
import {GraphNode, GraphEdge} from './compiled/src/graph.js'
import {PlanarFace, PlanarSector, PlanarGraph} from './compiled/src/planarGraph.js'
import CreasePattern from './compiled/src/CreasePattern.js'
import SimpleSVG from './SimpleSVG.js'

'use strict';

var svgNS = 'http://www.w3.org/2000/svg';

var CreaseTypeString = {
	// CreaseDirection.mark : "mark"
	// CreaseDirection.border : "border",
	// CreaseDirection.mountain : "mountain",
	// CreaseDirection.valley : "valley",
	0 : "mark",
	1 : "boundary",
	2 : "mountain",
	3 : "valley",
}

export default class OrigamiPaper extends SimpleSVG{

	onResize(event){ }
	onFrame(event){ }
	onMouseDown(event){ }
	onMouseUp(event){ }
	onMouseMove(event){ }
	onMouseDidBeginDrag(event){ }

	constructor() {
		super();
		// read arguments:
		//   a CreasePattern() object
		//   a parent DOM node for the new SVG as an HTML element or as a id-string
		var args = []; for(var i = 0; i < arguments.length; i++){ args.push(arguments[i]); }
		this.cp = args.filter(function(arg){ return arg instanceof PlanarGraph },this).shift();
		var parent = args.filter(function(arg){ return arg instanceof HTMLElement },this).shift();
		if(parent == undefined){
			var idString = args.filter(function(a){ return typeof a === 'string' || a instanceof String;},this).shift();
			if(idString != undefined){ parent = document.getElementById(idString); }
		}

		if(this.cp == undefined){ this.cp = new CreasePattern(); }
		if(parent == undefined){ parent = document.body; }

		this.svg = this.SVG();
		parent.appendChild(this.svg);

		this.facesLayer = this.group('faces');
		this.junctionsLayer = this.group('junctions');
		this.sectorsLayer = this.group('sectors');
		this.edgesLayer = this.group('creases');
		this.boundaryLayer = this.group('boundary');
		this.nodesLayer = this.group('nodes');
		this.svg.appendChild(this.boundaryLayer);
		this.svg.appendChild(this.facesLayer);
		this.svg.appendChild(this.junctionsLayer);
		this.svg.appendChild(this.sectorsLayer);
		this.svg.appendChild(this.edgesLayer);
		this.svg.appendChild(this.nodesLayer);

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

		var that = this;
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
		this.onFrameTimer = setInterval(function(){
			that.onFrame({'time':that.svg.getCurrentTime(),'frame':frameNum});
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
		var bounds = this.cp.bounds();
		this.svg.setAttribute("viewBox", (-this.padding+bounds.origin.x) + " " + (-this.padding+bounds.origin.y) + " " + (bounds.size.width+this.padding*2) + " " + (bounds.size.height+this.padding*2));
	}
	get(component){
		// this way also works
		// var svgEdge = document.getElementById("edge-" + nearest.edge.index);
		if(component instanceof GraphNode){ return this.nodesLayer.childNodes[ component.index ]; }
		if(component instanceof GraphEdge){ return this.edgesLayer.childNodes[ component.index ]; }
		if(component instanceof PlanarFace){ return this.facesLayer.childNodes[ component.index ]; }
		if(component instanceof PlanarSector){ return this.sectorsLayer.childNodes[ component.index ]; }
		// if(component instanceof PlanarJunction){ return this.junctionsLayer.childNodes[ component.index ]; }
		// allow chaining without errors
		// return {'setAttribute':function(){}};
		return document.createElement('void');
	}

	showNodes(){ origami.nodesLayer.setAttribute('display', '');}
	showEdges(){ origami.edgesLayer.setAttribute('display', '');}
	showFaces(){ origami.facesLayer.setAttribute('display', '');}
	showSectors(){ origami.sectorsLayer.setAttribute('display', '');}
	hideNodes(){ origami.nodesLayer.setAttribute('display', 'none');}
	hideEdges(){ origami.nodesLayer.setAttribute('display', 'none');}
	hideFaces(){ origami.nodesLayer.setAttribute('display', 'none');}
	hideSectors(){ origami.nodesLayer.setAttribute('display', 'none');}

	update(){
		// better system, put everything inside of <g id="mountain">
		// iterate over all child elements, look them up from their ids
		// for(var i = 0; i < this.cp.edges.length; i++){
		// 	var edge = document.getElementById("edge-" + i);
		// 	if(edge != undefined){
		// 		edge.setAttributeNS(svgNS, 'class', CreaseTypeString[this.cp.edges[i].orientation]);
		// 	}
		// }
		this.edgesLayer.childNodes.forEach(function(edge,i){
			if(this.cp.edges[i] != undefined){
				edge.setAttributeNS(svgNS, 'class', CreaseTypeString[this.cp.edges[i].orientation]);
			}
		},this);
		this.facesLayer.childNodes.forEach(function(face){ face.setAttributeNS(svgNS, 'class', 'face'); },this);
		this.nodesLayer.childNodes.forEach(function(node){ node.setAttributeNS(svgNS, 'class', 'node'); },this);
		this.sectorsLayer.childNodes.forEach(function(sector){ sector.setAttributeNS(svgNS, 'class', 'sector'); },this);
		this.junctionsLayer.childNodes.forEach(function(junction){ junction.setAttributeNS(svgNS, 'class', 'junction'); },this);
	}

	draw(){
		this.setViewBox();

		[this.boundaryLayer, this.facesLayer, this.junctionsLayer, this.sectorsLayer, this.edgesLayer, this.nodesLayer].forEach(function(layer){
			while(layer.lastChild) {
				layer.removeChild(layer.lastChild);
			}
		},this);

		var pointsString = this.cp.boundary.nodes().reduce(function(prev,curr){
			return prev + curr.x + "," + curr.y + " ";
		},"");
		
		var boundaryPolygon = document.createElementNS(svgNS, 'polygon');
		boundaryPolygon.setAttributeNS(svgNS, 'class', 'boundary');
		boundaryPolygon.setAttributeNS(svgNS, 'points', pointsString);
		this.boundaryLayer.appendChild(boundaryPolygon);

		this.cp.nodes.forEach(function(node){ this.addNode(node); },this);
		this.cp.edges.forEach(function(edge){ this.addEdge(edge); },this);
		this.cp.faces.forEach(function(face){ this.addFace(face); },this);
		this.cp.junctions.forEach(function(junction){ 
			this.addJunction(junction);
			var radius = this.style.sector.scale * junction.sectors
				.map(function(el){ return el.edges[0].length(); },this)
				.sort(function(a,b){return a-b;})
				.shift();
			junction.sectors.forEach(function(sector){ this.addSector(sector, radius); },this);
		},this);
	}

	addNode(node){
		var dot = this.circle(node.x, node.y, this.style.node.radius, 'node', 'node-' + node.index);
		this.nodesLayer.appendChild(dot);
	}
	addEdge(edge){
		var line = this.line(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y, CreaseTypeString[edge.orientation], 'edge-' + edge.index);
		this.edgesLayer.appendChild(line);
	}
	addFace(face){
		function lerp(a,b,pct){ var l = b-a; return a+l*(1-pct); }
		var centroid = face.centroid();
		var points = face.nodes.map(function(el){ return [lerp(el.x, centroid.x, this.style.face.scale), lerp(el.y, centroid.y, this.style.face.scale)]; },this);
		var polygon = this.polygon(points, 'face', 'face-' + face.index);
		this.facesLayer.appendChild(polygon);
	}
	addSector(sector, radius){
		var origin = sector.origin;
		var v = sector.endPoints.map(function(vec){ return vec.subtract(origin).normalize().scale(radius); },this);
		var arcVec = v[1].subtract(v[0]);
		var arc = Math.atan2(v[0].x*v[1].y - v[0].y*v[1].x, v[0].x*v[1].x + v[0].y*v[1].y) > 0 ? 0 : 1;
		var d = 'M ' + origin.x + ',' + origin.y + ' l ' + v[0].x + ',' + v[0].y + ' ';
		d += ['a ', radius, radius, 0, arc, 1,  arcVec.x, arcVec.y].join(' ');
		d += ' Z';
		var path = document.createElementNS(svgNS,"path");
		path.setAttribute('d', d);
		path.setAttributeNS(svgNS, 'class', 'sector');
		path.setAttributeNS(svgNS, 'id', 'sector-' + sector.index);
		this.sectorsLayer.appendChild(path);
	}
	addJunction(junction){ }

	load(path){  // callback
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
					var data = (new window.DOMParser()).parseFromString(string, "text/xml");
					that.cp = new SVGLoader().convertToCreasePattern(data);
					that.draw();
					// if(callback != undefined){
					// 	// callback(that.cp);
					// }
				});
			break;
		}
	}
}
