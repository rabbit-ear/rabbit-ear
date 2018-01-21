var voronoiInterpCallback = undefined;

var voronoiInterp = new OrigamiPaper("canvas-voronoi-interpolate");
voronoiInterp.setPadding(0.05);

// keep track of voronoi nodes in a separate graph
var input = new PlanarGraph();
var voronoiAlgorithm; // global D3 algorithm implementation

var vInterpolation = 0.5;

voronoiInterp.reset = function(){
	this.cp.clear();
	this.draw();
	voronoiAlgorithm = d3.voronoi().extent( this.cp.boundingBox_array() );
	for(var i = 0; i < 4; i++){
		var x = map(Math.random(), 0, 1, 0.1, 0.9);
		var y = map(Math.random(), 0, 1, 0.1, 0.9);
		input.newPlanarNode(x, y);
	}
}
voronoiInterp.reset();

voronoiInterp.redraw = function(){

	var nodes = input.nodes.map(function(el){return el.values();});
	var v = voronoiAlgorithm( nodes );

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.voronoi(v, vInterpolation);
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
	this.draw();
	// this.update();

	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.01, fillColor:this.style.valley.strokeColor});
		nodeCircle.position = nodes[i];
	}
}

voronoiInterp.onResize = function(){
	voronoiAlgorithm = d3.voronoi().extent( this.cp.boundingBox_array() );
}

voronoiInterp.onMouseDown = function(event){
	if(this.cp.pointInside(event.point)){ input.newPlanarNode(event.point.x, event.point.y); }
	if(input.nodes.length < 2) return;
	this.redraw();
}
voronoiInterp.onMouseUp = function(event){ }
voronoiInterp.onMouseMove = function(event) { }
voronoiInterp.onFrame = function(event){
	vInterpolation = map( Math.sin(event.time*0.75), -1, 1, 0.4, 0.8 );
	if(voronoiInterpCallback !== undefined){
		voronoiInterpCallback(vInterpolation);
	}
	this.redraw();
}
