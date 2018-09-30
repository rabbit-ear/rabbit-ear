import SVGLoader from './SVGLoader.js'
import {GraphNode, GraphEdge} from './graph.js'
import {PlanarFace, PlanarSector, PlanarGraph} from './planarGraph.js'
import CreasePattern from './creasePattern.js'
import * as SVG from './SimpleSVG.js'

'use strict';

var svgNS = 'http://www.w3.org/2000/svg';

// this is a replica of the CreaseDirection object
var CreaseTypeString = {
	0 : "mark",
	1 : "boundary",
	2 : "mountain",
	3 : "valley",
}

var creaseTypeDictionary = {
	"B": "boundary",
	"M": "mountain",
	"V": "valley",
	"F": "mark",
	"U": "mark"
}


export default class OrigamiPaper{

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

		this.foldFile = {}

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
		this.edgesLayer = this.group(null, 'creases');
		this.boundaryLayer = this.group(null, 'boundary');
		this.nodesLayer = this.group(null, 'nodes');
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
		// var bounds = this.cp.boundaryBounds();
		var bounds = { origin:{x:0,y:0}, size:{width:1, height:1} };
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
		// 		edge.setAttributeNS(null, 'class', CreaseTypeString[this.cp.edges[i].orientation]);
		// 	}
		// }
		this.edgesLayer.childNodes.forEach(function(edge,i){
			if(this.cp.edges[i] != undefined){
				edge.setAttributeNS(null, 'class', this.cp.edges[i].orientation);
			}
		},this);
		this.facesLayer.childNodes.forEach(function(face){ face.setAttributeNS(null, 'class', 'face'); },this);
		this.nodesLayer.childNodes.forEach(function(node){ node.setAttributeNS(null, 'class', 'node'); },this);
		this.sectorsLayer.childNodes.forEach(function(sector){ sector.setAttributeNS(null, 'class', 'sector'); },this);
		this.junctionsLayer.childNodes.forEach(function(junction){ junction.setAttributeNS(null, 'class', 'junction'); },this);
	}

/*
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
		boundaryPolygon.setAttributeNS(null, 'class', 'boundary');
		boundaryPolygon.setAttributeNS(null, 'points', pointsString);
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
	}*/


/*
	addNode(node){
		var dot = this.circle(node.x, node.y, this.style.node.radius, 'node', 'node-' + node.index);
		this.nodesLayer.appendChild(dot);
	}
	addEdge(edge){
		var creaseline = this.line(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y, edge.orientation, 'edge-' + edge.index);
		this.edgesLayer.appendChild(creaseline);
	}
	addFace(face){
		function lerp(a,b,pct){ var l = b-a; return a+l*(1-pct); }
		var centroid = face.centroid();
		var points = face.nodes.map(function(el){ return [lerp(el.x, centroid.x, this.style.face.scale), lerp(el.y, centroid.y, this.style.face.scale)]; },this);
		var poly = this.polygon(points, 'face', 'face-' + face.index);
		this.facesLayer.appendChild(poly);
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
		path.setAttributeNS(null, 'd', d);
		path.setAttributeNS(null, 'class', 'sector');
		path.setAttributeNS(null, 'id', 'sector-' + sector.index);
		this.sectorsLayer.appendChild(path);
	}
	addJunction(junction){ }
*/

	draw(){
		if(this.foldFile.vertices_coords == undefined){ return; }

		var verts = this.foldFile.vertices_coords;
		var edges = this.foldFile.edges_vertices.map(ev => [verts[ev[0]], verts[ev[1]]])
		var orientations = this.foldFile.edges_assignment.map(a => creaseTypeDictionary[a])
		var faces = this.foldFile.faces_vertices.map(fv => fv.map(v => verts[v]))

		this.setViewBox();

		[this.boundaryLayer, this.facesLayer, this.junctionsLayer, this.sectorsLayer, this.edgesLayer, this.nodesLayer].forEach(function(layer){
			while(layer.lastChild) {
				layer.removeChild(layer.lastChild);
			}
		},this);
		
		edges.forEach((e,i) => this.addEdge(e, orientations[i]));
		faces.forEach(f => this.addFace(f))
	}
	addEdge(edge, orientation){
		console.log("adding " + orientation + " edge with ", edge);
		var creaseline = this.line(edge[0][0], edge[0][1], edge[1][0], edge[1][1], orientation, 'edge');
		this.edgesLayer.appendChild(creaseline);
	}
	addFace(points){
		console.log(points);
		var poly = this.polygon(points, 'face', 'face');
		this.facesLayer.appendChild(poly);
	}


	load(input, callback){ // epsilon
		// are they giving us a filename, or the data of an already loaded file?
		var that = this;
		if (typeof input === 'string' || input instanceof String){
			var extension = input.substr((input.lastIndexOf('.') + 1));
			// filename. we need to upload
			switch(extension){
				case 'fold':
				fetch(input)
					.then(function(response){ return response.json(); })
					.then(function(data){
						that.cp.importFoldFile(data);
						that.draw();
						if(callback != undefined){ callback(that.cp); }
					});
				return that;
				case 'svg':
				fetch(input)
					.then(response => response.text())
					.then(function(string){
						that.cp = new SVGLoader(string);
						that.draw();
						if(callback != undefined){ callback(that.cp); }
					});
				return that;
				case 'opx':
				fetch(input)
					.then(response => response.text())
					.then(function(string){
						var foldFileImport = FOLD.convert.convertFromTo(string, "opx", "fold");
						that.cp.importFoldFile(foldFileImport);
						that.draw();
						if(callback != undefined){ callback(that.cp); }
					});
				return that;
			}
		}
		try{
			// try .fold file format first
			var foldFileImport = JSON.parse(input);
			this.cp.importFoldFile(foldFileImport);
			return this;
		} catch(err){
			// try .svg file format
			try {
				this.cp = new SVGLoader(input);
				this.draw();
				return this;
			}
			catch(err) {
				console.log("can't recognize file");
			}
		}
		return this;
	}
}
