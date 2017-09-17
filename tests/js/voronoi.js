
var voronoiSketch = new OrigamiPaper("canvas-voronoi");
voronoiSketch.updateWeights(0.005, 0.0025);
voronoiSketch.zoomToFit(0.05);
voronoiSketch.updateWeights(0.005, 0.0025);

var input = new PlanarGraph();
var voronoiAlgorithm; // global D3 algorithm implementation

var vInterpolation = 0.5;

voronoiSketch.reset = function(){
	this.cp.clear();
	this.init();
	voronoiAlgorithm = d3.voronoi().extent( this.cp.boundingBox_array() );
}
voronoiSketch.reset();

voronoiSketch.redraw = function(){

	var nodes = input.nodes.map(function(el){return el.values();});
	var v = voronoiAlgorithm( nodes );

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.creaseVoronoi(v, vInterpolation);
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

	// this.cp.clean();
	// // this.cp.generateFaces();
	this.updateWeights(0.005, 0.0025);
	this.init();
	// this.update();

	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.01, fillColor:this.style.valley.strokeColor});
		nodeCircle.position = nodes[i];
	}
}

voronoiSketch.onResize = function(){
	voronoiAlgorithm = d3.voronoi().extent( this.cp.boundingBox_array() );
}

voronoiSketch.onMouseDown = function(event){

	if(this.cp.pointInside(event.point)){ input.newPlanarNode(event.point.x, event.point.y); }
	if(input.nodes.length < 2) return;

	this.redraw();
}
voronoiSketch.onMouseUp = function(event){ }
voronoiSketch.onMouseMove = function(event) { }
voronoiSketch.onFrame = function(event){ }
