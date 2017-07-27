
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

	faceFillColor = { gray:0.0, alpha:0.0 };

	function PaperCreasePattern(paperjs, creasePattern) {
		if(creasePattern == undefined) { throw "PaperCreasePattern() initializer requires valid crease pattern"; }
		// holds onto a pointer to the data model
		this.myPaperJS = paperjs
		this.cp = creasePattern;
		// layer for drawing
		this.paperEdgeLayer = new this.myPaperJS.Layer();
		this.cpLayer = new this.myPaperJS.Layer();
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
		// draw paper edge
		this.paperEdgeLayer.activate();
		this.paperEdgeLayer.removeChildren();
		for(var i = 0; i < this.cp.boundary.edges.length; i++){
			var path = this.newBorderPath(this.lineWeight);
			var endpoints = this.cp.boundary.edges[i].endPoints();
			path.segments = [ endpoints[0], endpoints[1] ];
		}

		// drawing layer
		this.nodeLayer.activate();
		this.nodeLayer.removeChildren();
		for(var i = 0; i < this.cp.nodes.length; i++){
			var p = new this.myPaperJS.Point(this.cp.nodes[i].x, this.cp.nodes[i].y);
			this.points.push( p );
			// new paper.Shape.Circle({
			// 		center: [p.x, p.y], 
			// 		radius: 0.02, 
			// 		//strokeWidth:0.01,
			// 		fillColor: { hue:220, saturation:0.6, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
			// 	});
		}
		this.cpLayer.activate();
		this.cpLayer.removeChildren();
		for(var i = 0; i < this.cp.edges.length; i++){
			var path = this.newPathForCrease(this.cp.edges[i]);
			path.segments = [ this.points[this.cp.edges[i].node[0].index ], this.points[this.cp.edges[i].node[1].index ] ];
			this.edges.push( path );
		}
		for(var i = 0; i < this.cp.faces.length; i++){
			var segmentArray = [];
			for(var j = 0; j < this.cp.faces[i].nodes.length; j++){
				segmentArray.push( this.points[ this.cp.faces[i].nodes[j].index ] );
			}
			this.faces.push(new this.myPaperJS.Path({
					fillColor: faceFillColor,
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
			this.edges[i].segments[0].point = this.points[ this.cp.edges[i].node[0].index ];
			this.edges[i].segments[1].point = this.points[ this.cp.edges[i].node[1].index ];
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
