// this generates an SVG rendering of a CreasePattern object

var canvasSize = 1;
var strokeWidth = 0.002;
var svgNS = "http://www.w3.org/2000/svg";

var CreaseTypeString = {
	// CreaseDirection.mark : "mark"
	// CreaseDirection.border : "border",
	// CreaseDirection.mountain : "mountain",
	// CreaseDirection.valley : "valley",
	0 : "mark",
	1 : "border",
	2 : "mountain",
	3 : "valley",
}

	
function addEdge(svg, edge){
	var line = document.createElementNS(svgNS,"line");
	line.setAttributeNS(null, "x1", edge.nodes[0].x);
	line.setAttributeNS(null, "y1", edge.nodes[0].y);
	line.setAttributeNS(null, "x2", edge.nodes[1].x);
	line.setAttributeNS(null, "y2", edge.nodes[1].y);
	line.setAttributeNS(null, 'class', CreaseTypeString[edge.orientation]);
	console.log()
	console.log(edge.orientation);
	svg.appendChild(line);
}

function createCircle(svg){
	var circle = document.createElementNS(svgNS,"circle");
	circle.setAttributeNS(null,"id","mycircle");
	circle.setAttributeNS(null,"cx",0);
	circle.setAttributeNS(null,"cy",0);
	circle.setAttributeNS(null,"r",0.5);
	circle.setAttributeNS(null,"fill","none");
	circle.setAttributeNS(null,"stroke","black");
    circle.setAttributeNS(null,'stroke-width', strokeWidth);

	svg.appendChild(circle);
}
function preliminaryBase(svg){
	// var myCircle = document.createElementNS(svgNS,"rectangle");
	// myCircle.setAttributeNS(null,"id","mycircle");
	var line1 = document.createElementNS(svgNS,"line");
	line1.setAttributeNS(null, "x1", 0);
	line1.setAttributeNS(null, "y1", 0);
	line1.setAttributeNS(null, "x2", canvasSize);
	line1.setAttributeNS(null, "y2", canvasSize);
	line1.setAttributeNS(null, "fill", "none");
	line1.setAttributeNS(null, "stroke", "black");
    line1.setAttributeNS(null, 'stroke-width', strokeWidth);

	var line2 = document.createElementNS(svgNS,"line");
	line2.setAttributeNS(null, "x1", 0);
	line2.setAttributeNS(null, "y1", canvasSize);
	line2.setAttributeNS(null, "x2", canvasSize);
	line2.setAttributeNS(null, "y2", 0);
	line2.setAttributeNS(null, "fill", "none");
	line2.setAttributeNS(null, "stroke", "black");
    line2.setAttributeNS(null, 'stroke-width', strokeWidth);

	svg.appendChild(line1);
	svg.appendChild(line2);

	// addEdge(svg, 0, 0.5, 1, 0.5);
}  


var OrigamiPaper = (function(){

	this.svg;

	// function OrigamiPaper(svg, creasePattern) {
	function OrigamiPaper(creasePattern) {
		// if(svg == undefined){
			this.svg = this.createNewSVG();
			document.body.appendChild(this.svg);
		// }
		// if(typeof canvas === "string"){ 
		// 	this.canvas = document.getElementById(canvas);
		// 	// if canvas string isn't found, try the generic case id="canvas"
		// 	if(this.canvas === null){ this.canvas = document.getElementById("canvas"); }
		// }
		// else{ this.canvas = canvas; }

		// createCircle(svg);
		// preliminaryBase(svg);

		if (creasePattern != undefined){
			this.cp = creasePattern;
			for(var i = 0; i < cp.edges.length; i++){
				addEdge(this.svg, cp.edges[i]);
			}
		}

		that = this;
		this.svg.addEventListener('mousemove', function(event){
			var point = that.SVGCoordinates(event);
			console.log( point );

		});

		this.cp = creasePattern;
		if(this.cp == undefined){ this.cp = new CreasePattern(); }
		this.draw();
	}
	OrigamiPaper.prototype.SVGCoordinates = function(event){
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

		var boundaryRect = document.createElementNS(svgNS, "rect");
		boundaryRect.setAttributeNS(null, "x", 0);
		boundaryRect.setAttributeNS(null, "y", 0);
		boundaryRect.setAttributeNS(null, "width", canvasSize);
		boundaryRect.setAttributeNS(null, "height", canvasSize);
		boundaryRect.setAttributeNS(null, "fill", "none");
		boundaryRect.setAttributeNS(null, "stroke", "black");
    	boundaryRect.setAttributeNS(null, 'stroke-width', strokeWidth);
    	svg.appendChild(boundaryRect);

		return svg;
	}
	OrigamiPaper.prototype.draw = function(){

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

	return OrigamiPaper;
}());

// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="hannover-svg-icons">
// 	<symbol viewBox="0 0 16 16" id="down-arrow">
// 		<polygon points="11,6 7.5,9.5 4,6 3,7 7.5,11.5 12,7"></polygon>
// 	</symbol>
// </svg>
