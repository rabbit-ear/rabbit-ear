// PaperCreasePattern
// render and style a crease pattern into an HTML canvas using PaperJS
// reimplement methods for interaction

try {
	var cp = new CreasePattern();
} catch(err) {
	console.log(err.message);
	throw "cp.paper.js requires the crease pattern js library github.com/robbykraft/Origami"
}

var EPSILON_FILE_IMPORT = 0.005;

function pointsSimilar(p1, p2, epsilon){
	if(epsilon == undefined) epsilon = 0.02;
	if( Math.abs(p1.x-p2.x) < epsilon && Math.abs(p1.y-p2.y) < epsilon ) return true;
	return false;
}

var PaperCreasePattern = (function () {

	PaperCreasePattern.prototype.onResize = function(event){ }
	PaperCreasePattern.prototype.onFrame = function(event){ }
	PaperCreasePattern.prototype.onMouseDown = function(event){ }
	PaperCreasePattern.prototype.onMouseUp = function(event){ }
	PaperCreasePattern.prototype.onMouseMove = function(event){ }

	function PaperCreasePattern(canvas, creasePattern) {
		if(canvas == undefined) { throw "PaperCreasePattern() init issue"; }
		if(typeof canvas === "string"){ this.canvas = document.getElementById(canvas); }
		else this.canvas = canvas;

		this.cp = creasePattern;
		if(this.cp === undefined) { this.cp = new CreasePattern(); }
		

		this.scope = new paper.PaperScope();
		this.scope.setup(canvas);

		var that = this;
		this.scope.view.onFrame = function(event){     paper = that.scope; that.onFrame(event); }
		this.scope.view.onMouseDown = function(event){ paper = that.scope; that.onMouseDown(event); }
		this.scope.view.onMouseUp = function(event){   paper = that.scope; that.onMouseUp(event); }
		this.scope.view.onMouseMove = function(event){ 
			paper = that.scope;
			if(that.nearestNodeColor != undefined){ that.highlightNearestNode(event.point); }
			if(that.nearestEdgeColor != undefined){ that.highlightNearestEdge(event.point); }
			if(that.nearestFaceColor != undefined){ that.highlightNearestFace(event.point); }
			that.onMouseMove(event);
		}
		this.scope.view.onResize = function(event){    
			paper = that.scope; 
			that.zoomToFit(); 
			that.onResize(event); 
		}

		// the order of the following sets the z index order too
		this.faceLayer = new this.scope.Layer();
		this.edgeLayer = new this.scope.Layer();
		this.boundaryLayer = new this.scope.Layer();
		this.nodeLayer = new this.scope.Layer();
		
		this.nodeLayer.visible = false;

		// set these to a color (paperjs color object) for automatic nearest calculation
		this.nearestNodeColor = undefined;
		this.nearestEdgeColor = undefined;
		this.nearestFaceColor = undefined;
		this.nearestNode = undefined;
		this.nearestEdge = undefined;
		this.nearestFace = undefined;

		this.mouseNodeLayer = new this.scope.Layer();
		this.nearestNodeCircle = new this.scope.Shape.Circle({
			center: [0, 0],
			radius: 0.02,
			visible: false,
			fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
		});
		
		this.zoomToFit();

		this.initialize();
    }
    PaperCreasePattern.prototype.initialize = function(){
		// on-screen drawn elements
		this.nodes = [];
		this.edges = [];
		this.faces = [];

		this.boundaryLayer.removeChildren();
		this.nodeLayer.removeChildren();
		this.edgeLayer.removeChildren();
		this.faceLayer.removeChildren();

		// draw paper edge
		if(this.cp == undefined){ return; }
		if(this.cp.boundary != undefined){
			this.boundaryLayer.activate();
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
			circle.strokeCap = 'round';
			this.nodes.push( circle );
		}
		this.edgeLayer.activate();
		for(var i = 0; i < this.cp.edges.length; i++){
			var path = new paper.Path({segments: this.cp.edges[i].nodes, closed: false });
			Object.assign(path, this.styleForCrease(this.cp.edges[i].orientation));
			path.strokeCap = 'round';
			this.edges.push( path );
		}
		this.faceLayer.activate();
		for(var i = 0; i < this.cp.faces.length; i++){
			var face = new this.scope.Path({segments:this.cp.faces[i].nodes,closed:true});
			var color = 100 + 200 * i/this.cp.faces.length;
			face.fillColor = { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 };
			this.faces.push( face );
		}
    }

    PaperCreasePattern.prototype.update = function () {
		for(var i = 0; i < this.cp.nodes.length; i++){ this.nodes[i].position = this.cp.nodes[i]; }
		for(var i = 0; i < this.cp.edges.length; i++){ this.edges[i].segments = this.cp.edges[i].nodes; }
		for(var i = 0; i < this.cp.faces.length; i++){ this.faces[i].segments = this.cp.faces[i].nodes; }
	};

	PaperCreasePattern.prototype.zoomToFit = function(padding){
		// store padding for future calls
		if(padding != undefined){ this.padding = padding; }
		// use stored padding if we can
		var paperWindowScale = 1.0 - .015;
		if(this.padding != undefined){ paperWindowScale = 1.0 - this.padding*2; }
		var pixelScale = 1.0;
		if(isRetina){ pixelScale = 0.5; }
		var w, h;
		if(this.canvas != undefined){
			w = this.canvas.width;
			h = this.canvas.height;
		} else { 
			w = window.innerWidth;
			h = window.innerHeight;
		}
		var paperSize;
		if(w < h){ paperSize = w * paperWindowScale * pixelScale; } 
		else     { paperSize = h * paperWindowScale * pixelScale; }
		var mat = new this.scope.Matrix(1, 0, 0, 1, 0, 0);
		if(w < h){ mat.translate(w * 0.5 * pixelScale, w * 0.5 * pixelScale); }
		else     { mat.translate(h * 0.5 * pixelScale, h * 0.5 * pixelScale); }
		mat.scale(paperSize, paperSize);
		mat.translate(-0.5, -0.5);
		this.scope.view.matrix = mat;
		return mat;
	}

	PaperCreasePattern.prototype.highlightNearestNode = function(position){
		var node = this.cp.getNearestNode( position.x, position.y );
		if(this.nearestNode !== node){
			this.nearestNodeCircle.visible = true;
			this.nearestNodeCircle.fillColor = this.nearestNodeColor;
			this.nearestNode = node;
			this.nearestNodeCircle.position = this.nearestNode;
		}
	}
	PaperCreasePattern.prototype.highlightNearestEdge = function(position){
		var edge = this.cp.getNearestEdge( position.x, position.y ).edge;
		if(this.nearestEdge !== edge){
			this.nearestEdge = edge;
			for(var i = 0; i < this.cp.edges.length; i++){
				if(this.nearestEdge != undefined && this.nearestEdge === this.cp.edges[i]){
					this.edges[i].strokeColor = this.nearestEdgeColor;
				} else{
					this.edges[i].strokeColor = this.styleForCrease(this.cp.edges[i].orientation).strokeColor;
				}
			}
		}
	}

	///////////////////////////////////////////////////
	// STYLE
	///////////////////////////////////////////////////

	var lineWeight = 0.01;

	PaperCreasePattern.prototype.styleForCrease = function(orientation){
		if   (orientation == CreaseDirection.mountain){ return this.style.mountain; }
		else if(orientation == CreaseDirection.valley){ return this.style.valley; }
		else if(orientation == CreaseDirection.border){ return this.style.border; }
		return this.style.mark;
	}

	PaperCreasePattern.prototype.style = {};
	PaperCreasePattern.prototype.style.nodes = {
		radius: 0.015, 
		fillColor: { hue:25, saturation:0.7, brightness:1.0 }//{ hue:20, saturation:0.6, brightness:1 }
	}
	PaperCreasePattern.prototype.style.mountain = {
		strokeColor: { gray:0.5 },//{ hue:340, saturation:0.75, brightness:0.9 },
		dashArray: [lineWeight*2, lineWeight*1.5, lineWeight*.1, lineWeight*1.5],
		// dashArray: [lineWeight*4, lineWeight, lineWeight, lineWeight],
		// dashArray: undefined,
		strokeWidth: lineWeight
	};
	PaperCreasePattern.prototype.style.valley = {
		strokeColor: { hue:220, saturation:0.6, brightness:1 },
		// dashArray: [lineWeight*3, lineWeight],
		dashArray: undefined,
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
