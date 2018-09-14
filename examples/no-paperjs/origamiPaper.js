// this generates an SVG rendering of a CreasePattern object

var canvasSize = 1;
var svgNS = "http://www.w3.org/2000/svg";
var pad = 0.01

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

var OrigamiPaper = (function(){

	// function OrigamiPaper(svg, creasePattern) {
	function OrigamiPaper(creasePattern) {
		this.cp = creasePattern;
		if(this.cp == undefined){ this.cp = new CreasePattern(); }

		this.svg = this.createNewSVG();
		document.body.appendChild(this.svg);

		this.backgroundLayer;
		this.faceLayer;
		this.junctionLayer;
		this.sectorLayer;
		this.edgeLayer;
		this.boundaryLayer;
		this.nodeLayer;
	
		this.mouse = {
			position: {'x':0,'y':0},
			pressed: {'x':0,'y':0},
			isPressed: false,
			isDragging: false
		};
		this.draw();

		var that = this;
		this.svg.onmousedown = function(event){
			that.mouse.isPressed = true;
			that.mouse.isDragging = false;
			that.mouse.pressed = that.convertDOMtoSVG(event);
			// that.attemptSelection();
			that.onMouseDown( Object.assign({}, that.mouse.pressed) );
		}
		this.svg.onmouseup = function(event){
			that.mouse.isPressed = false;
			that.selectedTouchPoint = undefined;
			that.onMouseUp( that.convertDOMtoSVG(event) );
		}
		this.svg.onmousemove = function(event){
			that.mouse.position = that.convertDOMtoSVG(event);
			if(that.mouse.isPressed){ 
				if(that.mouse.isDragging === false){
					that.mouse.isDragging = true;
					that.onMouseDidBeginDrag( Object.assign({}, that.mouse.position) );
				}
			}
			that.onMouseMove( Object.assign({}, that.mouse.position) );
		}
		this.svg.onResize = function(event){
			// that.buildViewMatrix();
			that.onResize(event);
		}
		// javascript get Date()
		var frameNum = 0
		// this.onFrameTimer = setInterval(function(){
		// 	that.onFrame({frame:frameNum});
		// 	frameNum += 1;
		// }, 1/60);
	}
	OrigamiPaper.prototype.convertDOMtoSVG = function(event){
		var pt = this.svg.createSVGPoint();
		pt.x = event.clientX;
		pt.y = event.clientY;
		var svgPoint = pt.matrixTransform(this.svg.getScreenCTM().inverse());
		return { x: svgPoint.x, y: svgPoint.y };
	}
	OrigamiPaper.prototype.createNewSVG = function(){
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute("width", "100vmin");
		svg.setAttribute("height", "100vmin");
		svg.setAttribute("viewBox", "" + -pad + " " + -pad + " " + (canvasSize+pad*2) + " " + (canvasSize+pad*2));

		this.backgroundLayer = document.createElementNS(svgNS, 'g');
		this.faceLayer = document.createElementNS(svgNS, 'g');
		this.junctionLayer = document.createElementNS(svgNS, 'g');
		this.sectorLayer = document.createElementNS(svgNS, 'g');
		this.edgeLayer = document.createElementNS(svgNS, 'g');
		this.boundaryLayer = document.createElementNS(svgNS, 'g');
		this.nodeLayer = document.createElementNS(svgNS, 'g');

		this.backgroundLayer.setAttributeNS(null, 'id', 'background');
		this.faceLayer.setAttributeNS(null, 'id', 'faces');
		this.junctionLayer.setAttributeNS(null, 'id', 'junctions');
		this.sectorLayer.setAttributeNS(null, 'id', 'sectors');
		this.edgeLayer.setAttributeNS(null, 'id', 'creases');
		this.boundaryLayer.setAttributeNS(null, 'id', 'boundary');
		this.nodeLayer.setAttributeNS(null, 'id', 'nodes');

		svg.appendChild(this.backgroundLayer);
		svg.appendChild(this.faceLayer);
		svg.appendChild(this.junctionLayer);
		svg.appendChild(this.sectorLayer);
		svg.appendChild(this.edgeLayer);
		svg.appendChild(this.boundaryLayer);
		svg.appendChild(this.nodeLayer);

		return svg;
	}
	OrigamiPaper.prototype.draw = function(){
		var bounds = this.cp.bounds();
		this.svg.setAttributeNS(null, "viewBox",  (-pad+bounds.origin.x) + " " + (-pad+bounds.origin.y) + " " + (bounds.size.width+pad*2) + " " + (bounds.size.height+pad*2));

		[this.backgroundLayer, this.faceLayer, this.junctionLayer, this.sectorLayer, this.edgeLayer, this.boundaryLayer, this.nodeLayer].forEach(function(layer){
			while (layer.lastChild) {
				layer.removeChild(layer.lastChild);
			}
		},this);

		var pointsString = this.cp.boundary.nodes().reduce(function(prev,curr){
			return prev + curr.x + "," + curr.y + " ";
		},"");
		
		var backgroundPolygon = document.createElementNS(svgNS, "polygon");
		backgroundPolygon.setAttributeNS(null, 'class', 'paper');
		backgroundPolygon.setAttributeNS(null, 'points', pointsString);
		this.backgroundLayer.appendChild(backgroundPolygon);

		var boundaryPolygon = document.createElementNS(svgNS, "polygon");
		boundaryPolygon.setAttributeNS(null, 'class', 'boundary');
		boundaryPolygon.setAttributeNS(null, 'points', pointsString);
		this.boundaryLayer.appendChild(boundaryPolygon);

		// this.cp.nodes.forEach(function(node){ this.addNode(node); },this);
		this.cp.edges.forEach(function(edge){ this.addEdge(edge); },this);
	}

	OrigamiPaper.prototype.update = function(){
		// better system, put everything inside of <g id="mountain">
		// iterate over all child elements, look them up from their ids
		// for(var i = 0; i < this.cp.edges.length; i++){
		// 	var edge = document.getElementById("edge-" + i);
		// 	if(edge != undefined){
		// 		edge.setAttributeNS(null, 'class', CreaseTypeString[this.cp.edges[i].orientation]);
		// 	}
		// }
		this.edgeLayer.childNodes.forEach(function(edge,i){
			if(this.cp.edges[i] != undefined){
				// console.log( CreaseTypeString[this.cp.edges[i].orientation] );
				edge.setAttributeNS(null, 'class', CreaseTypeString[this.cp.edges[i].orientation]);
			}
		},this);
	}

	OrigamiPaper.prototype.addEdge = function(edge){
		var line = document.createElementNS(svgNS,"line");
		line.setAttributeNS(null, 'x1', edge.nodes[0].x);
		line.setAttributeNS(null, 'y1', edge.nodes[0].y);
		line.setAttributeNS(null, 'x2', edge.nodes[1].x);
		line.setAttributeNS(null, 'y2', edge.nodes[1].y);
		line.setAttributeNS(null, 'class', CreaseTypeString[edge.orientation]);
		line.setAttributeNS(null, 'id', 'edge-' + edge.index);
		this.edgeLayer.appendChild(line);
	}

	OrigamiPaper.prototype.onResize = function(event){ }
	OrigamiPaper.prototype.onFrame = function(event){ }
	OrigamiPaper.prototype.onMouseDown = function(event){ }
	OrigamiPaper.prototype.onMouseUp = function(event){ }
	OrigamiPaper.prototype.onMouseMove = function(event){ }
	OrigamiPaper.prototype.onMouseDidBeginDrag = function(event){ }


	OrigamiPaper.prototype.importSVG = function(xml){
		// console.log(xml);
		var properties = ['x', 'y', 'width', 'height'];
		var values = properties.map(function(prop){
				return xml.attributes[prop] == undefined ? "" : xml.attributes[prop].nodeValue;
			},this)
			.map(function(string){ return parseFloat(string); },this);
		var viewBoxString = xml.attributes['viewBox'] == undefined ? "" :  xml.attributes['viewBox'].nodeValue;
		var viewBoxValues = viewBoxString.split(' ').map(function(el){ return parseFloat(el); },this);

		//import all lines, rects, we have to skip curved lines or convert them into tiny straight lines.

		var bounds = {'origin':{'x':values[0], 'y':values[1]}, 'size':{'width':values[2], 'height':values[3]} };
		if(isNaN(bounds.size.width)){ bounds.size.width = viewBoxValues[2]; }
		if(isNaN(bounds.size.height)){ bounds.size.height = viewBoxValues[3]; }

		// re-sizing down to 1 x aspect size
		var min = bounds.size.height; if(bounds.size.width < bounds.size.height){ min = bounds.size.width; }
		// var mat = new paper.Matrix(1/min, 0, 0, 1/min, 0, 0);
		// svgLayer.matrix = mat;
		var cp = new CreasePattern();//.rectangle(w,h);
		// erase boundary, to be set later by convex hull
		cp.nodes = [];
		cp.edges = [];
		// cp.boundary = new PlanarGraph();


		function parseColor(input) {
			if (input.substr(0,1)=="#") {
				var collen=(input.length-1)/3;
				var fact=[17,1,0.062272][collen-1];
				return [
					Math.round(parseInt(input.substr(1,collen),16)*fact),
					Math.round(parseInt(input.substr(1+collen,collen),16)*fact),
					Math.round(parseInt(input.substr(1+2*collen,collen),16)*fact)
					];
			}
			else return input.split("(")[1].split(")")[0].split(",").map(Math.round);
		}
		function styleCreaseWithColor(crease, hexString){
			var colors = parseColor(hexString);
			if(Math.abs(colors[2]-colors[1]) < 10 && Math.abs(colors[1] - colors[0]) < 10 ){ crease.mark(); }
			else if(colors[0] > colors[2]){ crease.mountain(); }
			else if(colors[2] > colors[0]){ crease.valley(); }
		}

		function depthFirstAddElement(children){
			var childrenArray = [];
			for(var i = 0; i < children.length; i++){ childrenArray.push(children[i]); }
			childrenArray.forEach(function(node){
				// console.log(node.nodeName);
				switch(node.nodeName){
					case '#text':
						// can be the <style>, often just a carriage return
						break;
					case 'line':
						var vals = ['x1', 'y1', 'x2', 'y2'].map(function(el){
							return node.attributes[el].nodeValue;
						},this);
						var crease = cp.newCrease(vals[0] / h, vals[1] / h, vals[2] / h, vals[3] / h);
						styleCreaseWithColor(crease, node.attributes.stroke.nodeValue);
						break;
					case 'rect':
						var x = parseFloat(node.attributes.x.nodeValue) / bounds.size.height;
						var y = parseFloat(node.attributes.y.nodeValue) / bounds.size.height;
						var width = parseFloat(node.attributes.width.nodeValue) / bounds.size.height;
						var height = parseFloat(node.attributes.height.nodeValue) / bounds.size.height;
						var rectArray = [ [x, y], [x+width, y], [x+width, y+height], [x, y+height] ];
						rectArray.forEach(function(el,i){
							var nextEl = rectArray[ (i+1)%rectArray.length ];
							cp.newCrease(el[0], el[1], nextEl[0], nextEl[1]);
						},this);
						break;
					case 'path':
						var P_RESOLUTION = 64;
						var pathLength = node.getTotalLength();
						var closed = node.attributes.d.nodeValue.lastIndexOf('z') != -1 ||
						             node.attributes.d.nodeValue.lastIndexOf('Z') != -1 ?
						             true : false;
						var pathPoints = [];
						for(var i = 0; i < P_RESOLUTION; i++){
							pathPoints.push(node.getPointAtLength(i * pathLength / P_RESOLUTION));
						}
						pathPoints.forEach(function(point, i){
							if(i == pathPoints.length-1 && !closed){ return; }
							var nextPoint = pathPoints[ (i+1)%pathPoints.length ];
							cp.newCrease(point.x / bounds.size.height, point.y / bounds.size.height, nextPoint.x / bounds.size.height, nextPoint.y / bounds.size.height);
						},this);
						break;
					case 'circle':
						var C_RESOLUTION = 64;
						var x = parseFloat(node.attributes.cx.nodeValue);
						var y = parseFloat(node.attributes.cy.nodeValue);
						var r = parseFloat(node.attributes.r.nodeValue);
						var circlePts = [];
						for(var i = 0; i < C_RESOLUTION; i++){
							circlePts.push([ x + r*Math.cos(i*2*Math.PI/C_RESOLUTION), y + r*Math.sin(i*2*Math.PI/C_RESOLUTION) ]);
						}
						circlePts.forEach(function(point, i){
							var nextPoint = circlePts[ (i+1)%circlePts.length ];
							cp.newCrease(point[0] / bounds.size.height, point[1] / bounds.size.height, nextPoint[0] / bounds.size.height, nextPoint[1] / bounds.size.height);
						},this);
						break;
					case 'polygon':
					case 'polyline':
						var closed = (node.nodeName == 'polygon') ? true : false;
						var points = node.attributes.points.nodeValue
							.split(' ')
							.filter(function(el){ return el != ""; },this)
							.map(function(el){ return el.split(',').map(function(coord){ return parseFloat(coord); },this) },this);
						points.forEach(function(point, i){
								if(i == points.length-1 && !closed ){ return; }
								var nextPoint = points[ (i+1)%points.length ];
								cp.newCrease(point[0] / bounds.size.height, point[1] / bounds.size.height, nextPoint[0] / bounds.size.height, nextPoint[1] / bounds.size.height);
							},this);
						break;
					default:
						if (node.childNodes !== undefined && node.childNodes.length > 0){
							depthFirstAddElement(node.childNodes);
						}
					break;
				}
			},this);

		}
		depthFirstAddElement(xml.children);
		// cp is populated
		// find the convex hull of the CP, set it to the boundary
		// cp.setBoundary(cp.nodes);
		// bypassing calling cp.setBoundary() directly to avoid flattening
		var points = cp.nodes.map(function(p){ return gimme1XY(p); },this);
		cp.boundary.convexHull(points);
		// cp.boundary.edges.forEach(function(el){
		// 	cp.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y).border();
		// },this);
		// cp.cleanBoundary();
		// cp.cleanDuplicateNodes();
		cp.clean();
		// cleanup
//		xml.removeChildren();
//		xml.remove();
		return cp;
	}

	OrigamiPaper.prototype.stringNumberToNumber = function(string){ return parseFloat(string); }

	OrigamiPaper.prototype.load = function(path){
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
					// console.log(data.childNodes);
					var svg = data.getElementsByTagName('svg')[0];
					that.cp = that.importSVG(svg);
					that.draw();
					// that.cp.edges.forEach(function(el, i){
					// 	console.log(i, el.orientation);
					// });
					// that.svg.childNodes.for
					// console.log(that.cp);
					// console.log(that.svg);
					// var result = string.slice(0, string.indexOf("<svg"));
					// console.log(result);
				});
			break;
		}

	}

	return OrigamiPaper;
}());

// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="hannover-svg-icons">
// 	<symbol viewBox="0 0 16 16" id="down-arrow">
// 		<polygon points="11,6 7.5,9.5 4,6 3,7 7.5,11.5 12,7"></polygon>
// 	</symbol>
// </svg>
