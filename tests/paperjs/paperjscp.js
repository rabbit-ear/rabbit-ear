
function zoomView(paperjs){
	var paperSize, paperWindowScale = 0.8;
	if(window.innerWidth < window.innerHeight){ paperSize = window.innerWidth * paperWindowScale;  } 
	else                                      { paperSize = window.innerHeight * paperWindowScale; }
	var mat = new paperjs.Matrix(1, 0, 0, 1, 0, 0);
	mat.translate(window.innerWidth * 0.5, window.innerHeight * 0.5);
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
// 	if(window.innerWidth < window.innerHeight){ mat.translate(window.innerWidth * 0.5, window.innerWidth * 0.5);}
// 	else                                      { mat.translate(window.innerHeight * 0.5, window.innerHeight * 0.5); }
// 	mat.scale(paperSize, paperSize);
// 	mat.translate(-0.5, -0.5);	
// 	paperjs.view.matrix = mat;
// 	return mat;
// }


var PaperCreasePattern = (function () {

	function mountainPath(lineWeight){
		return new paper.Path({
			strokeColor: { gray:0.5, alpha:1.0 },//{ hue:350, saturation:1, brightness:1 },
			strokeWidth: lineWeight,
			closed: false
		});
	}
	function valleyPath(lineWeight){
		return new paper.Path({
			strokeColor: { hue:130, saturation:0.8, brightness:0.7 },//{ hue:230, saturation:1, brightness:1 },
			dashArray: [lineWeight*3, lineWeight],
			strokeWidth: lineWeight,
			closed: false
		});
	}
	function borderPath(lineWeight){
		return new paper.Path({
			strokeColor: { gray:0.0, alpha:1.0 },//{ hue:0, saturation:1, brightness:0 },
			strokeWidth: lineWeight,
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
		this.cpLayer = new this.myPaperJS.Layer();
		// drawing options
		this.lineWeight = .0075;

		this.initialize();
    }
    PaperCreasePattern.prototype.initialize = function(){
		// on-screen drawn elements
		this.points = [];
		this.edges = [];
		this.faces = [];
		// drawing layer
		this.cpLayer.activate();
		this.cpLayer.removeChildren();
		for(var i = 0; i < this.cp.nodes.length; i++){
			var p = new this.myPaperJS.Point(this.cp.nodes[ i ].x, this.cp.nodes[ i ].y);
			this.points.push( p );
		}
		for(var i = 0; i < this.cp.edges.length; i++){
			var path;
			if(     this.cp.edges[i].orientation == CreaseDirection.mountain){ path = mountainPath(this.lineWeight); }
			else if(this.cp.edges[i].orientation == CreaseDirection.valley){ path = valleyPath(this.lineWeight); }
			else { path = borderPath(this.lineWeight); }
			path.segments = [ this.points[this.cp.edges[i].node[0] ], this.points[this.cp.edges[i].node[1] ] ];
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
			this.edges[i].segments[0].point = this.points[ this.cp.edges[i].node[0] ];
			this.edges[i].segments[1].point = this.points[ this.cp.edges[i].node[1] ];
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
