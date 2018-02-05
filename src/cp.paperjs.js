// OrigamiPaper
// render and style a crease pattern into an HTML canvas using PaperJS
// reimplement methods for interaction

// documentation
// this.mouseDown - mouse pressed state
// this.mouseDidDrag - mouse did drag during being pressed

try {
	var cp = new CreasePattern();
} catch(err) {
	console.log(err.message);
	throw "cp.paper.js requires the crease pattern js library github.com/robbykraft/Origami, and to be included before this file"
}

var EPSILON_FILE_IMPORT = 0.005;

function pointsSimilar(p1, p2, epsilon){
	if(epsilon == undefined) epsilon = 0.02;
	if( Math.abs(p1.x-p2.x) < epsilon && Math.abs(p1.y-p2.y) < epsilon ) return true;
	return false;
}


///////////////////////////////////////////////
//  RENDER FLAT ORIGAMI CREASE PATTERN
///////////////////////////////////////////////


var OrigamiPaper = (function(){

	function OrigamiPaper(canvas, creasePattern) {
		if(canvas === undefined) { throw "OrigamiPaper() needs to be initialized with an HTML canvas"; }
		if(typeof canvas === "string"){ 
			this.canvas = document.getElementById(canvas);
			// if canvas string isn't found, try the generic case id="canvas"
			if(this.canvas === null){
				this.canvas = document.getElementById("canvas");
			}
		}
		else{ this.canvas = canvas; }

		this.epsilon = EPSILON;

		// data model
		this.cp = creasePattern;
		// this needs some updating
		if(this.cp === undefined){ this.cp = new CreasePattern(); }
		
		// PAPER JS
		this.scope = new paper.PaperScope();
		this.scope.setup(this.canvas);
		this.cpMin = 1.0; // thickness of lines based on this
		this.style = this.defaultStyleTemplate();
		this.padding = 0.0075; // padding inside the canvas
		this.buildViewMatrix();

		// the order of the following sets the z index order too
		this.backgroundLayer = new this.scope.Layer();
		this.faceLayer = new this.scope.Layer();
		this.edgeLayer = new this.scope.Layer();
		this.boundaryLayer = new this.scope.Layer();
		this.nodeLayer = new this.scope.Layer();

		// user interaction
		this.mouseDown = false;
		this.mouseDownLocation = new XY(0,0);
		// user interaction layers
		this.mouseDragLayer = new this.scope.Layer();
				
		// setting these true causes this to highlight parts
		this.selectNearestNode = false;
		this.selectNearestEdge = false;
		this.selectNearestFace = false;

		var that = this;
		this.scope.view.onFrame = function(event){
			paper = that.scope;
			that.onFrame(event);
		}
		this.scope.view.onMouseDown = function(event){
			paper = that.scope;
			that.mouseDown = true;
			that.mouseDidDrag = false;
			that.mouseDownLocation = event.point;
			that.onMouseDown(event);
		}
		this.scope.view.onMouseUp = function(event){
			paper = that.scope;
			that.mouseDown = false;
			that.onMouseUp(event);
		}
		this.scope.view.onMouseMove = function(event){
			paper = that.scope;
			if(that.mouseDown){ 
				if(that.mouseDidDrag === false){
					that.onMouseDidBeginDrag(event);
				}
				that.mouseDidDrag = true;
			}
			if(that.selectNearestNode){ that.highlightNearestNode(event.point); }
			if(that.selectNearestEdge){ that.highlightNearestEdge(event.point); }
			if(that.selectNearestFace){ that.highlightNearestFace(event.point); }
			that.onMouseMove(event);
		}
		this.scope.view.onResize = function(event){
			paper = that.scope; 
			that.buildViewMatrix(); 
			that.onResize(event); 
		}
		this.draw();
	}
	OrigamiPaper.prototype.setCreasePattern = function(creasePattern){
		this.cp = creasePattern;
		// var width = this.cp.width();
		// var height = this.cp.height();
		this.draw();
	}

	OrigamiPaper.prototype.draw = function(){
		if(this.cp === undefined){ return; }

		// on-screen drawn elements
		this.nodes = [];
		this.edges = [];
		this.faces = [];

		this.backgroundLayer.removeChildren();
		this.boundaryLayer.removeChildren();
		this.nodeLayer.removeChildren();
		this.edgeLayer.removeChildren();
		this.faceLayer.removeChildren();

		// user interaction
		this.nearestNode = undefined;
		this.nearestEdge = undefined;
		this.nearestFace = undefined;
		this.selected = { nodes:[], edges:[], faces:[] };

		// draw paper
		if(this.cp.boundary !== undefined){
			var boundarySegments = [];
			for(var i = 0; i < this.cp.boundary.edges.length; i++){
				boundarySegments = boundarySegments.concat(this.cp.boundary.edges[i].nodes);
			}
			// paper color
			this.backgroundLayer.activate();
			var paperBackground = new paper.Path({segments: boundarySegments, closed: true });
			paperBackground.fillColor = this.style.backgroundColor;
			paperBackground.strokeWidth = 0;
			// boundary color
			this.boundaryLayer.activate();
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
			var face = new this.scope.Path({segments:this.cp.faces[i].nodes,closed:true});
			var color = 100 + 200 * i/this.cp.faces.length;
			face.fillColor = { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 };
			this.faces.push( face );
		}
		this.buildViewMatrix();
	}

	OrigamiPaper.prototype.load = function(svg, callback, epsilon){
		var that = this;
		this.scope.project.importSVG(svg, function(e){
			var cp = paperPathToCP(e);
			if(epsilon === undefined){ epsilon = EPSILON_FILE_IMPORT; }
			cp.clean(epsilon);
			that.setCreasePattern( cp );
			if(callback != undefined){
				callback(this.cp);
			}
		});
	}

	OrigamiPaper.prototype.loadUnclean = function(svg, callback){
		var that = this;
		this.scope.project.importSVG(svg, function(e){
			that.setCreasePattern( paperPathToCP(e) );
			if(callback != undefined){
				callback(this.cp);
			}
		});
	}

	OrigamiPaper.prototype.updatePositions = function () {
		for(var i = 0; i < this.nodes.length; i++){ this.nodes[i].position = this.cp.nodes[i]; }
		for(var i = 0; i < this.cp.edges.length; i++){ this.edges[i].segments = this.cp.edges[i].nodes; }
		for(var i = 0; i < this.cp.faces.length; i++){ this.faces[i].segments = this.cp.faces[i].nodes; }
	};

	OrigamiPaper.prototype.updateStyles = function () {
		for(var i = 0; i < this.nodes.length; i++){ 
			Object.assign(this.nodes[i], this.style.nodes); }
		for(var i = 0; i < this.cp.edges.length; i++){ 
			Object.assign(this.edges[i], this.styleForCrease(this.cp.edges[i].orientation)); }
		for(var i = 0; i < this.cp.faces.length; i++){ 
			Object.assign(this.faces[i], this.style.face); }

		if(this.boundaryLayer !== undefined){
			for(var i = 0; i < this.boundaryLayer.children.length; i++){
				Object.assign(this.boundaryLayer.children[i], this.styleForCrease(CreaseDirection.border));
			}
		}
		// update user-selected
		if(this.selected !== undefined){
			for(var i = 0; i < this.selected.nodes.length; i++){
				Object.assign(this.nodes[this.selected.nodes[i].index], this.style.selectedNode);
			}
			for(var i = 0; i < this.selected.edges.length; i++){
				Object.assign(this.edges[this.selected.edges[i].index], this.style.selectedEdge);
			}
		}
	};

	OrigamiPaper.prototype.update = function () {
		paper = this.scope;
		if(this.cp === undefined){ return; }
		if(this.nodes!==undefined&&this.cp.nodes!=undefined&&this.cp.nodes.length!==this.nodes.length){return;}
		if(this.edges!==undefined&&this.cp.edges!=undefined&&this.cp.edges.length!==this.edges.length){return;}
		if(this.faces!==undefined&&this.cp.faces!=undefined&&this.cp.faces.length!==this.faces.length){return;}
		this.updatePositions();
		this.updateStyles();
	};

	OrigamiPaper.prototype.setPadding = function(padding){
		this.buildViewMatrix(padding);
	}
	OrigamiPaper.prototype.buildViewMatrix = function(padding){
		paper = this.scope;
		if(padding !== undefined && !isNaN(padding)){ this.padding = padding; }
		var paperWindowScale = 1.0 - this.padding*2;
		var pixelScale = 1.0;
		if(isRetina){ pixelScale = 0.5; }
		// crease pattern size
		var cpWidth = 1.0; 
		var cpHeight = 1.0;
		if(this.cp.width !== undefined){ cpWidth = this.cp.width(); }
		if(this.cp.height !== undefined){ cpHeight = this.cp.height(); }
		var cpBounds = this.cp.bounds();
		var cpAspect = cpWidth / cpHeight;
		this.cpMin = cpWidth;
		if(cpHeight < cpWidth){ this.cpMin = cpHeight; }
		// canvas size
		var canvasWidth = this.canvas.width;
		var canvasHeight = this.canvas.height;
		var canvasAspect = canvasWidth / canvasHeight;
		// cp to canvas ratio
		var cpCanvasRatio = canvasHeight / cpHeight;
		if(cpAspect > canvasAspect) { cpCanvasRatio = canvasWidth / cpWidth; }
		// matrix
		var mat = new this.scope.Matrix(1, 0, 0, 1, 0, 0);
		mat.translate(canvasWidth * 0.5 * pixelScale, canvasHeight * 0.5 * pixelScale); 
		mat.scale(cpCanvasRatio*paperWindowScale*pixelScale, 
				  cpCanvasRatio*paperWindowScale*pixelScale);
		// mat.translate(-cpBounds.origin.x-cpWidth*0.5, -cpBounds.origin.y-cpHeight*0.5);
		mat.translate(-cpWidth*0.5 - cpBounds.origin.x, -cpHeight*0.5 - cpBounds.origin.y);
		this.scope.view.matrix = mat;
		// don't call this!
		// this.updateWeights();
		return mat;
	};

	///////////////////////////////////////////////////
	// USER INTERACTION
	///////////////////////////////////////////////////

	// OrigamiPaper.prototype.setup = function(event){ }
	// OrigamiPaper.prototype.update = function(event){ }
	// OrigamiPaper.prototype.draw = function(event){ }
	OrigamiPaper.prototype.onResize = function(event){ }
	OrigamiPaper.prototype.onFrame = function(event){ }
	OrigamiPaper.prototype.onMouseDown = function(event){ }
	OrigamiPaper.prototype.onMouseUp = function(event){ }
	OrigamiPaper.prototype.onMouseMove = function(event){ }
	OrigamiPaper.prototype.onMouseDidBeginDrag = function(event){ }

	OrigamiPaper.prototype.highlightNearestNode = function(position){
		var node = this.cp.getNearestNode( position );
		if(node === undefined) return;
		if(this.nearestNode !== node){
			// first, undo the last selected node
			this.selected.nodes = this.selected.nodes.filter(function(el){ return el.index !== this.nearestNode.index; },this);
			// set newest nearest to a style
			this.nearestNode = node;
			this.selected.nodes.push(this.nodes[this.nearestNode.index]);
			this.update();
		}
	};

	OrigamiPaper.prototype.highlightNearestEdge = function(position){
		var edge = this.cp.getNearestEdge( position.x, position.y ).edge;
		if(edge === undefined) return;
		if(this.nearestEdge !== edge){
			// first, undo the last selected node
			this.selected.edges = this.selected.edges.filter(function(el){ return el.index !== this.nearestEdge.index; },this);
			// set newest nearest to a style
			this.nearestEdge = edge;
			this.selected.edges.push(this.edges[this.nearestEdge.index]);
			this.update();
		}
	};

	///////////////////////////////////////////////////
	// STYLE
	///////////////////////////////////////////////////


	OrigamiPaper.prototype.styleForCrease = function(orientation){
		if   (orientation === CreaseDirection.mountain){ return this.style.mountain; }
		else if(orientation === CreaseDirection.valley){ return this.style.valley; }
		else if(orientation === CreaseDirection.border){ return this.style.border; }
		return this.style.mark;
	};

	// todo get rid of this
	OrigamiPaper.prototype.updateWeights = function(strokeFraction, circleFraction){
		if(this.style === undefined){ return; }
		if(strokeFraction === undefined){ strokeFraction = 0.01; }
		if(circleFraction === undefined){ circleFraction = 0.015; }
		var strokeWeight = this.cpMin * strokeFraction;
		var circleRadius = this.cpMin * circleFraction;
		this.style.nodes.radius = circleRadius;
		this.style.selectedNode.radius = circleRadius / 0.75;
		this.style.mountain.strokeWidth = strokeWeight;
		this.style.valley.strokeWidth = strokeWeight;
		this.style.valley.dashArray = [strokeWeight*2, strokeWeight*2];
		this.style.border.strokeWidth = strokeWeight;
		this.style.mark.strokeWidth = strokeWeight*0.66666;
	}
	OrigamiPaper.prototype.defaultStyleTemplate = function(){
		if(this.style === undefined){ this.style = {}; }
		var strokeWidth = 0.01;
		var circleRadius = 0.015;
		return {
			backgroundColor: { gray:1.0, alpha:1.0 },
			selectedNode: {
				radius: circleRadius / 0.75, 
				fillColor: { hue:0, saturation:0.8, brightness:1 },
				visible: true
			},
			selectedEdge: {
				strokeColor: { hue:0, saturation:0.8, brightness:1 }
			},
			selectedFace: {
				fillColor: { hue:0, saturation:0.8, brightness:1 }
			},
			nodes: {
				radius: circleRadius, 
				visible: false,
				// fillColor: { hue:25, saturation:0.7, brightness:1.0 }//{ hue:20, saturation:0.6, brightness:1 }
			},
			mountain: {
				// strokeColor: { hue:0, saturation:0.9, brightness:1.0 },
				strokeColor: { gray:0.66 },
				// dashArray: [this.style.strokeWidth*2, this.style.strokeWidth*1.5, this.style.strokeWidth*.1, this.style.strokeWidth*1.5],
				dashArray: undefined,
				strokeWidth: strokeWidth,
				strokeCap : 'round'
			},
			valley: {
				strokeColor: { hue:220, saturation:0.6, brightness:1 },
				dashArray: [strokeWidth*2, strokeWidth*2],
				// dashArray: undefined,
				strokeWidth: strokeWidth,
				strokeCap : 'round'
			},
			border: {
				strokeColor: { gray:0.0, alpha:1.0 },
				dashArray: undefined,
				strokeWidth: strokeWidth
			},
			mark: {
				strokeColor: { gray:0.75, alpha:1.0 },
				dashArray: undefined,
				strokeWidth: strokeWidth*0.66666,
				strokeCap : 'round'
			},
			face: {
				// fillColor: { gray:0.0, alpha:0.2 }
			}
		}
	};
	return OrigamiPaper;
}());



///////////////////////////////////////////////
//  RENDER SIMULATED FLAT-FOLDING OF ORIGAMI 
///////////////////////////////////////////////

var OrigamiFold = (function(){

	OrigamiFold.prototype.onResize = function(event){ }
	OrigamiFold.prototype.onFrame = function(event){ }
	OrigamiFold.prototype.onMouseDown = function(event){ }
	OrigamiFold.prototype.onMouseUp = function(event){ }
	OrigamiFold.prototype.onMouseMove = function(event){ }

	function OrigamiFold(canvas, creasePattern) {
		if(canvas === undefined) { throw "OrigamiFold() needs to be initialized with an HTML canvas"; }
		if(typeof canvas === "string"){
			this.canvas = document.getElementById(canvas);
			if(this.canvas === null){
				this.canvas = document.getElementById("canvas");
			}
		}
		else{ this.canvas = canvas; }

		// data model
		this.cp = creasePattern;
		if(this.cp === undefined){ this.cp = new CreasePattern(); }
		
		// PAPER JS
		this.scope = new paper.PaperScope();
		this.scope.setup(canvas);
		this.style = { face:{ fillColor:{ gray:1.0, alpha:0.1 } } };
		this.buildViewMatrix();

		this.customZoom = 0.6;

		// the order of the following sets the z index order too
		this.foldedLayer = new this.scope.Layer();
				
		var that = this;
		this.scope.view.onFrame = function(event){
			paper = that.scope; 
			that.onFrame(event); 
		}
		this.scope.view.onMouseDown = function(event){
			paper = that.scope; 
			that.mouseDown = true; 
			that.onMouseDown(event);
		}
		this.scope.view.onMouseUp = function(event){
			paper = that.scope;
			that.mouseDown = false;
			that.onMouseUp(event);
		}
		this.scope.view.onMouseMove = function(event){
			paper = that.scope;
			that.onMouseMove(event);
		}
		this.scope.view.onResize = function(event){
			paper = that.scope; 
			that.buildViewMatrix(); 
			that.onResize(event); 
		}
		this.draw();
	}
	OrigamiFold.prototype.draw = function(){
		this.foldedLayer.removeChildren();
		if(this.cp === undefined){ return; }
		this.cp.generateFaces();
		this.fold();
		this.buildViewMatrix();
	}

	OrigamiFold.prototype.update = function () {
		paper = this.scope;
		if(this.faces === undefined){ return; }
		for(var i = 0; i < this.faces.length; i++){
			this.faces[i].fillColor = this.style.face.fillColor;
		}
	};

	OrigamiFold.prototype.load = function(svg, callback, epsilon){
		var that = this;
		this.scope.project.importSVG(svg, function(e){
			var cp = paperPathToCP(e);
			if(epsilon === undefined){ epsilon = EPSILON_FILE_IMPORT; }
			cp.clean(epsilon);
			that.cp = cp;
			that.draw();
			// that.setCreasePattern( cp );
			if(callback != undefined){
				callback(this.cp);
			}
		});
	}

	OrigamiFold.prototype.fold = function(){
		paper = this.scope;
		// find a face near the middle
		if(this.cp === undefined){ return; }

		var centerFace = this.cp.getNearestFace(this.cp.width() * 0.5, this.cp.height()*0.5);
		if(centerFace === undefined){ return; }
		var foldTree = this.cp.adjacentFaceTree(centerFace);

		this.foldedLayer.removeChildren();
		this.foldedLayer.activate();
		this.faces = [];

		for(var i = 0; i < foldTree.faces.length; i++){
			if(foldTree.faces[i] !== undefined){
				var face = foldTree.faces[i].face;
				var matrix = foldTree.faces[i].global;
				var segments = [];
				for(var p = 0; p < face.nodes.length; p++){
					segments.push( new XY(face.nodes[p].x, face.nodes[p].y ).transform(matrix) );
				}
				var faceShape = new this.scope.Path({segments:segments,closed:true});
				faceShape.fillColor = this.style.face.fillColor;
				this.faces.push( faceShape );
			}
		}
		// this.cp.faces = [];
	};

	OrigamiFold.prototype.buildViewMatrix = function(padding){
		paper = this.scope;
		// store padding for future calls
		if(padding !== undefined){ this.padding = padding; }
		// use stored padding if we can
		var paperWindowScale = 1.0 - .015;
		if(this.padding !== undefined){ paperWindowScale = 1.0 - this.padding*2; }
		var pixelScale = 1.0;
		if(isRetina){ pixelScale = 0.5; }
		// crease pattern size
		var cpWidth = 1.0; 
		var cpHeight = 1.0;
		if(this.cp.width !== undefined){ cpWidth = this.cp.width(); }
		if(this.cp.height !== undefined){ cpHeight = this.cp.height(); }
		var cpBounds = this.cp.bounds();
		var cpAspect = cpWidth / cpHeight;
		this.cpMin = cpWidth;
		if(cpHeight < cpWidth){ this.cpMin = cpHeight; }
		// canvas size
		var canvasWidth = this.canvas.width;
		var canvasHeight = this.canvas.height;
		var canvasAspect = canvasWidth / canvasHeight;
		// cp to canvas ratio
		var cpCanvasRatio = canvasHeight / cpHeight;
		if(cpAspect > canvasAspect) { cpCanvasRatio = canvasWidth / cpWidth; }
		// matrix
		var mat = new this.scope.Matrix(1, 0, 0, 1, 0, 0);
		mat.scale(this.customZoom, this.customZoom);  // scale a bit
		mat.translate(canvasWidth * 0.5 * pixelScale, canvasHeight * 0.5 * pixelScale);
		mat.scale(cpCanvasRatio*paperWindowScale*pixelScale, 
				  cpCanvasRatio*paperWindowScale*pixelScale);
		mat.translate(-cpBounds.origin.x-cpWidth*0.5, -cpBounds.origin.y-cpHeight*0.5);
		mat.translate((1.0-this.customZoom), (1.0-this.customZoom));  // scale a bit - translate to center
		this.scope.view.matrix = mat;
		return mat;
	};

	return OrigamiFold;
}());



function paperPathToCP(paperPath){
	console.time("paperPathToCP");
	var svgLayer = paperPath;
	var w = svgLayer.bounds.size.width;
	var h = svgLayer.bounds.size.height;
	// re-sizing down to 1 x aspect size
	var min = h; if(w < h){ min = w; }
	var mat = new paper.Matrix(1/min, 0, 0, 1/min, 0, 0);
	// var mat = new paper.Matrix(1,0,0,1,0,0);
	svgLayer.matrix = mat;
	var cp = new CreasePattern();//.rectangle(w,h);
	// erase boundary, to be set later by convex hull
	cp.nodes = [];
	cp.edges = [];
	// cp.boundary = new PlanarGraph();
	function recurseAndAdd(childrenArray){
		for(var i = 0; i < childrenArray.length; i++){
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
				recurseAndAdd(childrenArray[i].children);
			}
		}
	}
	recurseAndAdd(svgLayer.children);
	// cp is filled
	// find the convex hull of the CP, set it to the boundary
	var hull = convexHull(cp.nodes);
	cp.setBoundary(hull);
	// cleanup
	svgLayer.removeChildren();
	svgLayer.remove();
	console.timeEnd("paperPathToCP");
	return cp;
}


// callback returns the crease pattern as an argument
function loadSVG(path, callback, epsilon){
	// console.log("load svg epsilon");
	// console.log(epsilon);
	// var newScope = new paper.PaperScope();
	paper.project.importSVG(path, function(e){
		var cp = paperPathToCP(e);
		var width = cp.width();
		var height = cp.height();
		// todo: 
		var eps = epsilon;
		if(eps === undefined){ eps = EPSILON_FILE_IMPORT; } //EPSILON_FILE_IMPORT; } EPSILON
		cp.cleanDuplicateNodes(eps);
		cp.fragment();
		cp.cleanDuplicateNodes(eps);
		if(callback != undefined){
			callback(cp);
		}
	});
}

function loadSVGUnclean(path, callback, epsilon){
	// var newScope = new paper.PaperScope();
	paper.project.importSVG(path, function(e){
		var cp = paperPathToCP(e);
		var eps = EPSILON_FILE_IMPORT;
		if(eps !== undefined){ eps = EPSILON_FILE_IMPORT; } //EPSILON_FILE_IMPORT; }
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
