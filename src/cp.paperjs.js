
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

var EPSILON_FILE_IMPORT = 0.005;

function zoomView(paperjs, optionalWidth, optionalHeight, retinaScale){
	var pixelScale = retinaScale;
	if(retinaScale == undefined) { pixelScale = 1.0; }
	var w = optionalWidth;
	var h = optionalHeight;
	if(optionalWidth == undefined)  { w = window.innerWidth;  }
	if(optionalHeight == undefined) { h = window.innerHeight; }
	var paperSize, paperWindowScale = 0.8;
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


var PaperCreasePattern = (function () {

	PaperCreasePattern.prototype.newPathForCrease = function(crease){
		if( crease.orientation == CreaseDirection.mountain){ return this.newMountainPath(this.lineWeight); }
		else if(crease.orientation == CreaseDirection.valley){ return this.newValleyPath(this.lineWeight); }
		else if(crease.orientation == CreaseDirection.border){ return this.newBorderPath(this.lineWeight); }
		return this.newMarkPath(this.lineWeight);
	}

	PaperCreasePattern.prototype.colorForCrease = function(creaseOrientation){
		if( creaseOrientation == CreaseDirection.mountain){ 
			return { hue:220, saturation:0.6, brightness:1 };
			//{ gray:0.5, alpha:1.0 },//{ hue:350, saturation:1, brightness:1 },
		} else if(creaseOrientation == CreaseDirection.valley){ 
			return { hue:350, saturation:0, brightness:0.6 };
			//{ hue:130, saturation:0.8, brightness:0.7 },//{ hue:230, saturation:1, brightness:1 },
		} else if(creaseOrientation == CreaseDirection.border){ 
			return { gray:0.0, alpha:1.0 };//{ hue:0, saturation:1, brightness:0 }
		} return { gray:0.75, alpha:1.0 };
	}

	PaperCreasePattern.prototype.newMountainPath = function(lineWeight){
		return new paper.Path({
			strokeColor: this.colorForCrease(CreaseDirection.mountain),
			strokeWidth: lineWeight,
			closed: false
		});
	}
	PaperCreasePattern.prototype.newValleyPath = function(lineWeight){
		return new paper.Path({
			strokeColor: this.colorForCrease(CreaseDirection.valley),
			dashArray: [lineWeight*3, lineWeight],
			strokeWidth: lineWeight,
			closed: false
		});
	}
	PaperCreasePattern.prototype.newBorderPath = function(lineWeight){
		return new paper.Path({
			strokeColor: this.colorForCrease(CreaseDirection.border),
			strokeWidth: lineWeight,
			closed: false
		});
	}
	PaperCreasePattern.prototype.newMarkPath = function(lineWeight){
		return new paper.Path({
			strokeColor: this.colorForCrease(CreaseDirection.none),
			strokeWidth: lineWeight*0.66666,
			closed: false
		});
	}

	faceFillColor = { gray:0.0, alpha:0.1 };

	function PaperCreasePattern(paperjs, creasePattern) {
		if(creasePattern == undefined) { throw "PaperCreasePattern() initializer requires valid crease pattern"; }
		// holds onto a pointer to the data model
		this.myPaperJS = paperjs
		this.cp = creasePattern;
		// layer for drawing
		this.cpLayer = new this.myPaperJS.Layer();
		this.paperEdgeLayer = new this.myPaperJS.Layer();
		this.nodeLayer = new this.myPaperJS.Layer();
		// drawing options
		this.lineWeight = .01;

		this.initialize();
    }
    PaperCreasePattern.prototype.initialize = function(){
		// on-screen drawn elements
		this.points = [];
		this.edges = [];
		this.faces = [];

		this.paperEdgeLayer.removeChildren();
		this.nodeLayer.removeChildren();
		this.cpLayer.removeChildren();
		// draw paper edge
		this.paperEdgeLayer.activate();
		this.paperEdgeLayer.removeChildren();
		var boundaryPath = this.newBorderPath(this.lineWeight);
		var boundarySegments = [];
		for(var i = 0; i < this.cp.boundary.edges.length; i++){
			var endpoints = this.cp.boundary.edges[i].nodes;
			boundarySegments.push(endpoints[0]);
			boundarySegments.push(endpoints[1]);
		}
		boundaryPath.segments = boundarySegments;
		boundaryPath.closed = true;

		// drawing layer
		this.nodeLayer.activate();
		this.nodeLayer.removeChildren();
		for(var i = 0; i < this.cp.nodes.length; i++){
			var p = new this.myPaperJS.Point(this.cp.nodes[i].x, this.cp.nodes[i].y);
			this.points.push( p );
			new paper.Shape.Circle({
					center: [p.x, p.y], 
					radius: 0.01, 
					//strokeWidth:0.01,
					fillColor: { hue:220, saturation:0.6, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
				});
		}
		this.nodeLayer.visible = false;
		this.cpLayer.activate();
		this.cpLayer.removeChildren();
		for(var i = 0; i < this.cp.edges.length; i++){
			var path = this.newPathForCrease(this.cp.edges[i]);
			path.segments = [ this.points[this.cp.edges[i].nodes[0].index ], this.points[this.cp.edges[i].nodes[1].index ] ];
			this.edges.push( path );
		}
		for(var i = 0; i < this.cp.faces.length; i++){
			var segmentArray = [];
			for(var j = 0; j < this.cp.faces[i].nodes.length; j++){
				segmentArray.push( this.points[ this.cp.faces[i].nodes[j].index ] );
			}
			var color = 100 + 200 * i/this.cp.faces.length;
			this.faces.push(new this.myPaperJS.Path({
					// fillColor: faceFillColor,
					fillColor: { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 },
					segments: segmentArray,
					closed: true
				})
			);
		}

    }
    PaperCreasePattern.prototype.update = function () {
		for(var i = 0; i < this.cp.nodes.length; i++){
			this.points[i].x = this.cp.nodes[i].x;
			this.points[i].y = this.cp.nodes[i].y;
		}
		for(var i = 0; i < this.cp.edges.length; i++){
			this.edges[i].segments[0].point = this.points[ this.cp.edges[i].nodes[0].index ];
			this.edges[i].segments[1].point = this.points[ this.cp.edges[i].nodes[1].index ];
		}
		for(var i = 0; i < this.cp.faces.length; i++){
			var faceNodeArray = this.cp.faces[i].nodes;
			var segmentArray = [];
			for(var j = 0; j < faceNodeArray.length; j++){
				segmentArray.push( this.points[ faceNodeArray[j].index ] );
				this.faces[i].segments[j].point = this.points[ faceNodeArray[j].index ];
			}
		}
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
