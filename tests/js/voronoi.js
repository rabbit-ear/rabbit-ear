
var voronoiSketch = new OrigamiPaper("canvas-voronoi");
voronoiSketch.zoomToFit(0.05);

var input = new PlanarGraph();
var voronoi;

voronoiSketch.style.mark.strokeWidth = 0.003;

voronoiSketch.reset = function(){
	this.cp.clear();
	this.init();
	voronoi = d3.voronoi().extent( this.cp.boundingBox_array() );
}
voronoiSketch.reset();

voronoiSketch.onResize = function(){
	voronoi = d3.voronoi().extent( this.cp.boundingBox_array() );
}

voronoiSketch.onMouseDown = function(event){
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];

	if(this.cp.pointInside(event.point)){ input.newPlanarNode(event.point.x, event.point.y); }
	if(input.nodes.length < 2) return;

	var nodes = input.nodes.map(function(el){return el.values();});
	var v = voronoi( nodes );
	console.log(v);
	for(var i = 0; i < v.edges.length; i++){
		var edge = v.edges[i];
		if(edge != undefined && edge[0] != undefined && edge[1] != undefined){
			var crease = this.cp.crease(edge[0][0], edge[0][1], edge[1][0], edge[1][1]);
			if(crease !== undefined){ crease.valley(); }
		}
	}

	// for(var c = 0; c < v.cells.length; c++){
	// 	for(var e = 0; e < v.cells[c].halfedges.length; e++){
	// 		var center = v.cells[c].site;
	// 		var vEdge = v.edges[ v.cells[c].halfedges[e] ];
	// 	}
	// }

	for(var e = 0; e < v.edges.length; e++){
		var endpoints = [ v.edges[e][0], v.edges[e][1] ];
		if(v.edges[e].left !== undefined){
			
		}
		if(v.edges[e].right !== undefined){
			
		}
	}

	// var delaunay = voronoi.triangles( nodes );
	// for(var i = 0; i < delaunay.length; i++){
	// 	var triangle = delaunay[i];
	// 	for(var j = 0; j < triangle.length; j++){
	// 		var nextJ = (j+1)%3;
	// 		this.cp.crease(triangle[j][0], triangle[j][1], triangle[nextJ][0], triangle[nextJ][1]).mark();
	// 	}
	// }

	// console.log(v);
	// console.log(delaunay);

	this.cp.clean();
	this.cp.generateFaces();
	this.init();

	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.01, fillColor:this.style.valley.strokeColor});
		nodeCircle.position = nodes[i];
	}
}
voronoiSketch.onMouseUp = function(event){ }
voronoiSketch.onMouseMove = function(event) { }
