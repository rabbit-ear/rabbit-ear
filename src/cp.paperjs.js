
var EPSILON_FILE_IMPORT = 0.005;
var pixelScale;

var isRetina = function(){
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
            (min--moz-device-pixel-ratio: 1.5),\
            (-o-min-device-pixel-ratio: 3/2),\
            (min-resolution: 1.5dppx)";
    if (window.devicePixelRatio > 1)
        return true;
    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
        return true;
    return false;
}();

function zoomView(paperjs, optionalWidth, optionalHeight, padding){
	if(padding == undefined){ padding = 0.1; }
	var paperWindowScale = 1.0 - padding*2;
	var pixelScale = 1.0;
	if(isRetina){ pixelScale = 0.5; }
	var w = optionalWidth;
	var h = optionalHeight;
	if(optionalWidth == undefined)  { w = window.innerWidth;  }
	if(optionalHeight == undefined) { h = window.innerHeight; }
	var paperSize;
	if(w < h){ paperSize = w * paperWindowScale * pixelScale; } 
	else     { paperSize = h * paperWindowScale * pixelScale; }
	var mat = new paperjs.Matrix(1, 0, 0, 1, 0, 0);
	if(w < h){ mat.translate(w * 0.5 * pixelScale, w * 0.5 * pixelScale); }
	else     { mat.translate(h * 0.5 * pixelScale, h * 0.5 * pixelScale); }
	mat.scale(paperSize, paperSize);
	mat.translate(-0.5, -0.5);
	paperjs.view.matrix = mat;
	return mat;
}

// function zoomView(paperjs){
// 	var paperSize, paperWindowScale = 0.8;
// 	if(window.innerWidth < window.innerHeight){ paperSize = window.innerWidth * paperWindowScale;  } 
// 	else                                      { paperSize = window.innerHeight * paperWindowScale; }
// 	var mat = new paperjs.Matrix(1, 0, 0, 1, 0, 0);
// 	mat.translate(window.innerWidth * 0.5, window.innerHeight * 0.5);
// 	mat.scale(paperSize, paperSize);
// 	mat.translate(-0.5, -0.5);	
// 	paperjs.view.matrix = mat;
// 	return mat;
// }

var PaperCreasePattern = (function () {

	var lineWeight = 0.01;

	PaperCreasePattern.prototype.style = {};
	PaperCreasePattern.prototype.style.nodes = {
		radius: 0.015, 
		fillColor: { hue:25, saturation:0.7, brightness:1.0 }//{ hue:20, saturation:0.6, brightness:1 }
	}
	PaperCreasePattern.prototype.style.mountain = {
		strokeColor: { hue:220, saturation:0.6, brightness:1 }, 
		dashArray: undefined,
		strokeWidth: lineWeight
	};
	PaperCreasePattern.prototype.style.valley = {
		strokeColor: { hue:350, saturation:0, brightness:0.6 },
		dashArray: [lineWeight*3, lineWeight],
		strokeWidth: lineWeight
	};
	PaperCreasePattern.prototype.style.border = {
		strokeColor: { gray:0.0, alpha:1.0 },
		dashArray: undefined,
		strokeWidth: lineWeight
	};
	PaperCreasePattern.prototype.style.mark = {
		strokeColor: { gray:0.75, alpha:1.0 },
		dashArray: undefined,
		strokeWidth: lineWeight*0.66666
	};
	PaperCreasePattern.prototype.style.face = {
		fillColor: { gray:0.0, alpha:0.2 }
	};

	PaperCreasePattern.prototype.styleForCrease = function(orientation){
		if   (orientation == CreaseDirection.mountain){ return this.style.mountain; }
		else if(orientation == CreaseDirection.valley){ return this.style.valley; }
		else if(orientation == CreaseDirection.border){ return this.style.border; }
		return this.style.mark;
	}

	function PaperCreasePattern(paperjs, creasePattern) {
		if(creasePattern == undefined || paperjs == undefined) { throw "PaperCreasePattern() init issue"; }
		// holds onto a pointer to the data model
		this.myPaperJS = paperjs
		this.cp = creasePattern;

		// the order of the following sets the z index order too
		this.faceLayer = new this.myPaperJS.Layer();
		this.edgeLayer = new this.myPaperJS.Layer();
		this.paperEdgeLayer = new this.myPaperJS.Layer();
		this.nodeLayer = new this.myPaperJS.Layer();

		this.initialize();
    }
    PaperCreasePattern.prototype.initialize = function(){
		// on-screen drawn elements
		this.nodes = [];
		this.edges = [];
		this.faces = [];

		this.nodeLayer.visible = false;

		this.paperEdgeLayer.removeChildren();
		this.nodeLayer.removeChildren();
		this.edgeLayer.removeChildren();
		this.faceLayer.removeChildren();

		// draw paper edge
		if(this.cp.boundary != undefined){
			this.paperEdgeLayer.activate();
			var boundarySegments = [];
			for(var i = 0; i < this.cp.boundary.edges.length; i++){
				var endpoints = this.cp.boundary.edges[i].nodes;
				boundarySegments.push(endpoints[0]);
				boundarySegments.push(endpoints[1]);
			}
			var boundaryPath = new paper.Path({segments: boundarySegments, closed: true });
			Object.assign(boundaryPath, this.styleForCrease(CreaseDirection.border));
		}

		this.nodeLayer.activate();
		for(var i = 0; i < this.cp.nodes.length; i++){
			var circle = new paper.Shape.Circle({ center: [this.cp.nodes[i].x, this.cp.nodes[i].y] });
			Object.assign(circle, this.style.nodes);
			this.nodes.push( circle );
		}
		this.edgeLayer.activate();
		for(var i = 0; i < this.cp.edges.length; i++){
			var path = new paper.Path({segments: this.cp.edges[i].nodes, closed: false });
			Object.assign(path, this.styleForCrease(this.cp.edges[i].orientation));
			this.edges.push( path );
		}
		this.faceLayer.activate();
		for(var i = 0; i < this.cp.faces.length; i++){
			var face = new this.myPaperJS.Path({segments:this.cp.faces[i].nodes,closed:true});
			var color = 100 + 200 * i/this.cp.faces.length;
			face.fillColor = { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 };
			var face = this.faces.push(face);
		}
    }

    PaperCreasePattern.prototype.update = function () {
		for(var i = 0; i < this.cp.nodes.length; i++){ this.nodes[i].position = this.cp.nodes[i]; }
		for(var i = 0; i < this.cp.edges.length; i++){ this.edges[i].segments = this.cp.edges[i].nodes; }
		for(var i = 0; i < this.cp.faces.length; i++){ this.faces[i].segments = this.cp.faces[i].nodes; }
	};

	return PaperCreasePattern;
}());


// callback returns the crease pattern as an argument
function loadSVG(path, callback){
	paper.project.importSVG(path, function(e){
		var svgLayer = e;
		// svgLayer.strokeWidth = 0.004;
		var w = svgLayer.bounds.size.width;
		var h = svgLayer.bounds.size.height;
		var mat = new paper.Matrix(1/w, 0, 0, 1/h, 0, 0);
		svgLayer.matrix = mat;

		var cp = new CreasePattern();
		function recurseAndAdd(childrenArray){
			for(var i = 0; i < childrenArray.length; i++){
				if(childrenArray[i].segments != undefined){ // found a line
					for(var j = 0; j < childrenArray[i].segments.length-1; j++){
						cp.creaseOnly(childrenArray[i].segments[j].point,
						              childrenArray[i].segments[j+1].point);
					}
				} else if (childrenArray[i].children != undefined){
					recurseAndAdd(childrenArray[i].children);
				}
			}
		}
		recurseAndAdd(svgLayer.children);
		svgLayer.removeChildren();
		svgLayer.remove();
		cp.clean();
		cp.cleanDuplicateNodes(EPSILON_FILE_IMPORT);
		cp.chop();
		if(callback != undefined){
			callback(cp);
		}
	});
}
