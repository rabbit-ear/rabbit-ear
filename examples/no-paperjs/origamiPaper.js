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

// function createCircle(svg){
// 	var circle = document.createElementNS(svgNS,"circle");
// 	circle.setAttributeNS(null,"id","mycircle");
// 	circle.setAttributeNS(null,"cx",0);
// 	circle.setAttributeNS(null,"cy",0);
// 	circle.setAttributeNS(null,"r",0.5);
// 	circle.setAttributeNS(null,"fill","none");
// 	circle.setAttributeNS(null,"stroke","black");
//     circle.setAttributeNS(null,'stroke-width', strokeWidth);
// 	svg.appendChild(circle);
// }

// function preliminaryBase(svg){
// 	var line1 = document.createElementNS(svgNS,"line");
// 	line1.setAttributeNS(null, "x1", 0);
// 	line1.setAttributeNS(null, "y1", 0);
// 	line1.setAttributeNS(null, "x2", canvasSize);
// 	line1.setAttributeNS(null, "y2", canvasSize);
// 	line1.setAttributeNS(null, "fill", "none");
// 	line1.setAttributeNS(null, "stroke", "black");
//     line1.setAttributeNS(null, 'stroke-width', strokeWidth);

// 	var line2 = document.createElementNS(svgNS,"line");
// 	line2.setAttributeNS(null, "x1", 0);
// 	line2.setAttributeNS(null, "y1", canvasSize);
// 	line2.setAttributeNS(null, "x2", canvasSize);
// 	line2.setAttributeNS(null, "y2", 0);
// 	line2.setAttributeNS(null, "fill", "none");
// 	line2.setAttributeNS(null, "stroke", "black");
//     line2.setAttributeNS(null, 'stroke-width', strokeWidth);

// 	svg.appendChild(line1);
// 	svg.appendChild(line2);
// }  


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

	return OrigamiPaper;
}());

// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="hannover-svg-icons">
// 	<symbol viewBox="0 0 16 16" id="down-arrow">
// 		<polygon points="11,6 7.5,9.5 4,6 3,7 7.5,11.5 12,7"></polygon>
// 	</symbol>
// </svg>
