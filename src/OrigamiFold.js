import SVGLoader from './SVGLoader.js'
import {GraphNode, GraphEdge} from './compiled/src/graph.js'
import {PlanarFace, PlanarSector, PlanarGraph} from './compiled/src/planarGraph.js'
import CreasePattern from './compiled/src/CreasePattern.js'

'use strict';

var svgNS = 'http://www.w3.org/2000/svg';

export default class OrigamiFold{

	onResize(event){ }
	onFrame(event){ }
	onMouseDown(event){ }
	onMouseUp(event){ }
	onMouseMove(event){ }
	onMouseDidBeginDrag(event){ }

	constructor() {
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

		this.svg = this.createNewSVG();
		parent.appendChild(this.svg);

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
			that.mouse.pressed = that.convertDOMtoSVG(event);
			that.zoomOnMousePress = that.zoom;
			that.rotationOnMousePress = that.rotation;
			// that.attemptSelection();
			that.onMouseDown( {point:Object.assign({}, that.mouse.pressed)} );
		}
		this.svg.onmouseup = function(event){
			that.mouse.isPressed = false;
			that.mouse.isDragging = false;
			that.selectedTouchPoint = undefined;
			that.onMouseUp( {point:that.convertDOMtoSVG(event)} );
		}
		this.svg.onmousemove = function(event){
			that.mouse.position = that.convertDOMtoSVG(event);
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
	createNewSVG(){
		var svg = document.createElementNS(svgNS, 'svg');
		svg.setAttribute("viewBox", "0 0 1 1");

		this.facesLayer = document.createElementNS(svgNS, 'g');
		this.junctionsLayer = document.createElementNS(svgNS, 'g');
		this.sectorsLayer = document.createElementNS(svgNS, 'g');
		this.edgesLayer = document.createElementNS(svgNS, 'g');
		this.boundaryLayer = document.createElementNS(svgNS, 'g');
		this.nodesLayer = document.createElementNS(svgNS, 'g');

		this.facesLayer.setAttributeNS(null, 'id', 'faces');
		this.junctionsLayer.setAttributeNS(null, 'id', 'junctions');
		this.sectorsLayer.setAttributeNS(null, 'id', 'sectors');
		this.edgesLayer.setAttributeNS(null, 'id', 'creases');
		this.boundaryLayer.setAttributeNS(null, 'id', 'boundary');
		this.nodesLayer.setAttributeNS(null, 'id', 'nodes');

		svg.appendChild(this.boundaryLayer);
		svg.appendChild(this.facesLayer);
		svg.appendChild(this.junctionsLayer);
		svg.appendChild(this.sectorsLayer);
		svg.appendChild(this.edgesLayer);
		svg.appendChild(this.nodesLayer);

		return svg;
	}
	convertDOMtoSVG(event){
		var pt = this.svg.createSVGPoint();
		pt.x = event.clientX;
		pt.y = event.clientY;
		var svgPoint = pt.matrixTransform(this.svg.getScreenCTM().inverse());
		return { x: svgPoint.x, y: svgPoint.y };
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
		// this.edgesLayer.childNodes.forEach(function(edge,i){
		// 	if(this.cp.edges[i] != undefined){
		// 		edge.setAttributeNS(null, 'class', CreaseTypeString[this.cp.edges[i].orientation]);
		// 	}
		// },this);
		this.facesLayer.childNodes.forEach(function(face){ face.setAttributeNS(null, 'class', 'face'); },this);
		// this.nodesLayer.childNodes.forEach(function(node){ node.setAttributeNS(null, 'class', 'node'); },this);
		// this.sectorsLayer.childNodes.forEach(function(sector){ sector.setAttributeNS(null, 'class', 'sector'); },this);
		// this.junctionsLayer.childNodes.forEach(function(junction){ junction.setAttributeNS(null, 'class', 'junction'); },this);
	}



	draw(groundFace){
		this.setViewBox();

		this.foldedCP = this.cp.fold(groundFace);
		this.getBounds();
		this.faces = [];

		[this.boundaryLayer, this.facesLayer, this.junctionsLayer, this.sectorsLayer, this.edgesLayer, this.nodesLayer].forEach(function(layer){
			while(layer.lastChild) {
				layer.removeChild(layer.lastChild);
			}
		},this);

		// var pointsString = this.cp.boundary.nodes().reduce(function(prev,curr){
		// 	return prev + curr.x + "," + curr.y + " ";
		// },"");
		
		// var boundaryPolygon = document.createElementNS(svgNS, "polygon");
		// boundaryPolygon.setAttributeNS(null, 'class', 'boundary');
		// boundaryPolygon.setAttributeNS(null, 'points', pointsString);
		// this.boundaryLayer.appendChild(boundaryPolygon);

		// this.cp.nodes.forEach(function(node){ this.addNode(node); },this);
		// this.cp.edges.forEach(function(edge){ this.addEdge(edge); },this);
		// this.cp.faces.forEach(function(face){ this.addFace(face); },this);
		// this.cp.junctions.forEach(function(junction){ 
		// 	this.addJunction(junction);
		// 	var radius = this.style.sector.scale * junction.sectors
		// 		.map(function(el){ return el.edges[0].length(); },this)
		// 		.sort(function(a,b){return a-b;})
		// 		.shift();
		// 	junction.sectors.forEach(function(sector){ this.addSector(sector, radius); },this);
		// },this);


		if(this.foldedCP != undefined){

			this.foldedCP.faces_vertices
				.map(function(face){
					return face.map(function(nodeIndex){
						return this.foldedCP.vertices_coords[nodeIndex];
					},this);
				},this)
				.forEach(function(faceNodes, i){
					// var faceShape = new this.scope.Path({segments:faceNodes,closed:true});
					// faceShape.fillColor = this.style.face.fillColor;
					// this.faces.push( faceShape );
					this.addFace(faceNodes);
				},this);
		}
		this.setViewBox();
	}
	
	addFace(vertices, index){
		var pointsString = vertices
			.reduce(function(prev,curr){ return prev + curr[0] + "," + curr[1] + " "}, "");
		var polygon = document.createElementNS(svgNS,"polygon");
		polygon.setAttributeNS(null, 'points', pointsString);
		polygon.setAttributeNS(null, 'class', 'folded-face');
		polygon.setAttributeNS(null, 'id', 'face-' + index);
		this.facesLayer.appendChild(polygon);
	}

	load(path){ // (svg, callback, epsilon){}
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
					// that.cp = new SVGLoader().convertToCreasePattern(data, epsilon);
					that.foldedCP = cp.fold();
					that.draw();
					if(callback != undefined){
						// callback(that.cp);
					}
				});
			break;
		}
		return this;
	}
}
