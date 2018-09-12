// this generates an SVG rendering of a CreasePattern object

var canvasSize = 1;
var svgNS = "http://www.w3.org/2000/svg";

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
		var pad = 0.01
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute("width", "100vmin");
		svg.setAttribute("height", "100vmin");
		svg.setAttribute("viewBox", "-" + pad + " -" + pad + " " + (canvasSize+pad*2) + " " + (canvasSize+pad*2));

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

		return svg;
	}
	OrigamiPaper.prototype.draw = function(){
		for(var i = 0; i < this.cp.edges.length; i++){
			this.addEdge(this.cp.edges[i]);
		}
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
			edge.setAttributeNS(null, 'class', CreaseTypeString[this.cp.edges[i].orientation]);
		},this);
	}

	OrigamiPaper.prototype.styles = {
		'byrne':{
			'black':{hue:0, saturation:0, brightness:0 },
			'red':{hue:14.4, saturation:0.87, brightness:0.90 },
			'yellow':{hue:43.2, saturation:0.88, brightness:0.93 },
			'darkBlue':{hue:190.8, saturation:0.82, brightness:0.28 },
			'blue':{hue:205.2, saturation:0.74, brightness:0.61}
		},
		'lang':{
			'red':{hue:4, saturation:.76, brightness:.94},
			'brown':{hue:25, saturation:.36, brightness:.74},
			'green':{hue:120, saturation:.53, brightness:.72},
			'blue':{hue:230, saturation:.43, brightness:.72},
			'gray':{gray:.83},
			'darkBlue':{hue:234, saturation:.5, brightness:.38},
			'pink':{hue:341, saturation:.66, brightness:.93},
		}
	};

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
		var properties = ['x', 'y', 'width', 'height', 'viewBox'];
		var svgProp = properties.map(function(prop){
			return xml.attributes[prop].nodeValue;
		},this);
		console.log(svgProp);

		//import all lines, rects, we have to skip curved lines or convert them into tiny straight lines.

		var w = parseFloat(svgProp.width);
		var h = parseFloat(svgProp.height);
		// re-sizing down to 1 x aspect size
		var min = h; if(w < h){ min = w; }
		// var mat = new paper.Matrix(1/min, 0, 0, 1/min, 0, 0);
		// svgLayer.matrix = mat;
		var cp = new CreasePattern();//.rectangle(w,h);
		// erase boundary, to be set later by convex hull
		cp.nodes = [];
		cp.edges = [];
		// cp.boundary = new PlanarGraph();
		function recurseAndAdd(childrenArray){
			// console.log('childrenArray');
			// console.log(childrenArray);
			for(var i = 0; i < childrenArray.length; i++){

				if(childrenArray[i].nodeName == 'line'){
					var vals = ['x1', 'y1', 'x2', 'y2'].map(function(el){
						return childrenArray[i].attributes[el].nodeValue;
					},this);
					cp.newCrease(vals[0], vals[1], vals[2], vals[3]);
				}
				if(childrenArray[i].shape == "rectangle" && childrenArray[i].strokeColor != null){ // found a rectangle
					var left = childrenArray[i].strokeBounds.left;
					var top = childrenArray[i].strokeBounds.top;
					var width = childrenArray[i].strokeBounds.width;
					var height = childrenArray[i].strokeBounds.height;
					var rectArray = [ [left, top], [left+width, top], [left+width, top+height], [left, top+height] ];
					rectArray.forEach(function(el,i){
						var nextEl = rectArray[ (i+1)%rectArray.length ];
						cp.newCrease(el[0], el[1], nextEl[0], nextEl[1]);
					},this);
				}
				if(childrenArray[i].segments !== undefined){ // found a line
					var numSegments = childrenArray[i].segments.length-1;
					if(childrenArray[i].closed === true){
						numSegments = childrenArray[i].segments.length;
					}
					for(var j = 0; j < numSegments; j++){
						var next = (j+1)%childrenArray[i].segments.length;
						var crease = cp.newCrease(childrenArray[i].segments[j].point.x,
									 childrenArray[i].segments[j].point.y, 
									 childrenArray[i].segments[next].point.x,
									 childrenArray[i].segments[next].point.y);
						var color = childrenArray[i].strokeColor;
						if(color !== undefined && crease !== undefined){
							if(color.red > color.blue){crease.mountain();}
							if(color.red < color.blue){crease.valley();}
						}
					}
				} else if (childrenArray[i].children !== undefined){
					console.log("recursive call");
					console.log(childrenArray[i].children)
					recurseAndAdd(childrenArray[i].children);
				}
			}
		}
		recurseAndAdd(xml.children);
		console.log(xml.children);
		console.log(cp);
		// cp is populated
		// find the convex hull of the CP, set it to the boundary
		// cp.setBoundary(cp.nodes);
		// bypassing calling cp.setBoundary() directly to avoid flattening
//		var points = cp.nodes.map(function(p){ return gimme1XY(p); },this);
//		cp.boundary.convexHull(points);
		// cp.boundary.edges.forEach(function(el){
		// 	cp.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y).border();
		// },this);
//		cp.cleanDuplicateNodes();
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
					var data = (new window.DOMParser()).parseFromString(string, "text/xml")
					data.childNodes.forEach(function(el){ console.log(el); },this);
					that.importSVG(data.childNodes[1]);
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
