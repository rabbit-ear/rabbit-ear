// OrigamiPaper
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

var OrigamiPaper = (function () {

	function OrigamiPaper(canvas, creasePattern) {
		if(canvas === undefined) { throw "OrigamiPaper() needs to be initialized with an HTML canvas"; }
		if(typeof canvas === "string"){ this.canvas = document.getElementById(canvas); }
		else this.canvas = canvas;

		// data model
		this.cp = creasePattern;
		if(this.cp === undefined){ this.cp = new CreasePattern(); }
		
		// PAPER JS
		this.scope = new paper.PaperScope();
		this.scope.setup(canvas);
		this.zoomToFit();

		// the order of the following sets the z index order too
		this.faceLayer = new this.scope.Layer();
		this.edgeLayer = new this.scope.Layer();
		this.boundaryLayer = new this.scope.Layer();
		this.nodeLayer = new this.scope.Layer();
				
		// setting these true causes this to highlight parts
		this.selectNearestNode = false;
		this.selectNearestEdge = false;
		this.selectNearestFace = false;

		this.style = this.defaultStyleTemplate();

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
			if(that.selectNearestNode){ that.highlightNearestNode(event.point); }
			if(that.selectNearestEdge){ that.highlightNearestEdge(event.point); }
			if(that.selectNearestFace){ that.highlightNearestFace(event.point); }
			that.onMouseMove(event);
		}
		this.scope.view.onResize = function(event){    
			paper = that.scope; 
			that.zoomToFit(); 
			that.onResize(event); 
		}
		
		this.initialize();
    }
    OrigamiPaper.prototype.initialize = function(){
		// on-screen drawn elements
		this.nodes = [];
		this.edges = [];
		this.faces = [];

		this.boundaryLayer.removeChildren();
		this.nodeLayer.removeChildren();
		this.edgeLayer.removeChildren();
		this.faceLayer.removeChildren();

		// user interaction
		this.mouseDown = false;
		this.nearestNode = undefined;
		this.nearestEdge = undefined;
		this.nearestFace = undefined;
		this.selected = { nodes:[], edges:[], faces:[] };

		// draw paper edge
		if(this.cp === undefined){ return; }
		if(this.cp.boundary !== undefined){
			this.boundaryLayer.activate();
			var boundarySegments = [];
			for(var i = 0; i < this.cp.boundary.edges.length; i++){
				boundarySegments = boundarySegments.concat(this.cp.boundary.edges[i].nodes);
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
			var face = new this.scope.Path({segments:this.cp.faces[i].nodes,closed:true});
			var color = 100 + 200 * i/this.cp.faces.length;
			face.fillColor = { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 };
			this.faces.push( face );
		}
		this.zoomToFit();
    }

    OrigamiPaper.prototype.update = function () {
		for(var i = 0; i < this.cp.nodes.length; i++){ 
			this.nodes[i].position = this.cp.nodes[i]; 
			Object.assign(this.nodes[i], this.style.nodes);
		}
		for(var i = 0; i < this.cp.edges.length; i++){ 
			this.edges[i].segments = this.cp.edges[i].nodes; 
			Object.assign(this.edges[i], this.styleForCrease(this.cp.edges[i].orientation));
		}
		for(var i = 0; i < this.cp.faces.length; i++){ 
			this.faces[i].segments = this.cp.faces[i].nodes; 
		}
		// update user-selected
		for(var i = 0; i < this.selected.nodes.length; i++){
			Object.assign(this.nodes[this.selected.nodes[i].index], this.style.selectedNode);
		}
		for(var i = 0; i < this.selected.edges.length; i++){
			Object.assign(this.edges[this.selected.edges[i].index], this.style.selectedEdge);
		}	
	};

	OrigamiPaper.prototype.zoomToFit = function(padding){
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
		var cpAspect = cpWidth / cpHeight;
		var cpMin = cpWidth;
		if(cpHeight < cpWidth){ cpMin = cpHeight; }
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
		mat.translate(-cpWidth*0.5, -cpHeight*0.5);
		this.scope.view.matrix = mat;

		lineWeight = 0.01 * cpMin;
		return mat;
	};

	///////////////////////////////////////////////////
	// USER INTERACTION
	///////////////////////////////////////////////////

	OrigamiPaper.prototype.onResize = function(event){ }
	OrigamiPaper.prototype.onFrame = function(event){ }
	OrigamiPaper.prototype.onMouseDown = function(event){ }
	OrigamiPaper.prototype.onMouseUp = function(event){ }
	OrigamiPaper.prototype.onMouseMove = function(event){ }

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

	var lineWeight = 0.01;

	OrigamiPaper.prototype.styleForCrease = function(orientation){
		if   (orientation === CreaseDirection.mountain){ return this.style.mountain; }
		else if(orientation === CreaseDirection.valley){ return this.style.valley; }
		else if(orientation === CreaseDirection.border){ return this.style.border; }
		return this.style.mark;
	};

	OrigamiPaper.prototype.defaultStyleTemplate = function(){
		return {
			selectedNode: {
				radius: 0.02, 
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
				radius: 0.015, 
				visible: false,
				fillColor: { hue:25, saturation:0.7, brightness:1.0 }//{ hue:20, saturation:0.6, brightness:1 }
			},
			mountain: {
				strokeColor: { gray:0.666 },//{ hue:340, saturation:0.75, brightness:0.9 },
				// dashArray: [lineWeight*2, lineWeight*1.5, lineWeight*.1, lineWeight*1.5],
				dashArray: undefined,
				strokeWidth: lineWeight,
				strokeCap : 'round'
			},
			valley: {
				strokeColor: { hue:220, saturation:0.6, brightness:1 },
				dashArray: [lineWeight*2, lineWeight*2],
				// dashArray: undefined,
				strokeWidth: lineWeight,
				strokeCap : 'round'
			},
			border: {
				strokeColor: { gray:0.0, alpha:1.0 },
				dashArray: undefined,
				strokeWidth: lineWeight
			},
			mark: {
				strokeColor: { gray:0.75, alpha:1.0 },
				dashArray: undefined,
				strokeWidth: lineWeight*0.66666,
				strokeCap : 'round'
			},
			face: {
				fillColor: { gray:0.0, alpha:0.2 }
			}
		}
	};

	return OrigamiPaper;
}());


// callback returns the crease pattern as an argument
function loadSVG(path, callback, epsilon){
	paper.project.importSVG(path, function(e){
		var svgLayer = e;
		var w = svgLayer.bounds.size.width;
		var h = svgLayer.bounds.size.height;
		// no longer re-sizing down to 1 x aspect size
		// var mat = new paper.Matrix(1/w, 0, 0, 1/h, 0, 0);
		// svgLayer.matrix = mat;
		var cp = new CreasePattern().rectangle(w,h);
		function recurseAndAdd(childrenArray){
			for(var i = 0; i < childrenArray.length; i++){
				if(childrenArray[i].segments != undefined){ // found a line
					var numSegments = childrenArray[i].segments.length-1;
					if(childrenArray[i].closed === true){
						numSegments = childrenArray[i].segments.length;
					}
					for(var j = 0; j < numSegments; j++){
						var next = (j+1)%childrenArray[i].segments.length;
						cp.newCrease(childrenArray[i].segments[j].point.x,
						             childrenArray[i].segments[j].point.y, 
						             childrenArray[i].segments[next].point.x,
						             childrenArray[i].segments[next].point.y);
					}
				} else if (childrenArray[i].children != undefined){
					recurseAndAdd(childrenArray[i].children);
				}
			}
		}
		recurseAndAdd(svgLayer.children);
		svgLayer.removeChildren();
		svgLayer.remove();
		// cp.clean();
		var eps = epsilon;
		if(eps !== undefined){ eps = EPSILON; } //EPSILON_FILE_IMPORT; }
		cp.cleanDuplicateNodes(eps);
		// cp.fragment();
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
