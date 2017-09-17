
var voronoiInterp = new OrigamiPaper("canvas-voronoi-interpolate");
voronoiInterp.updateWeights(0.005, 0.0025);
voronoiInterp.zoomToFit(0.05);
voronoiInterp.updateWeights(0.005, 0.0025);

var input = new PlanarGraph();
var voronoiAlgorithm; // global D3 algorithm implementation

voronoiInterp.style.mark.strokeWidth = 0.003;

var vInterpolation = 0.5;

function creaseVoronoi(cp, v, interp){
	if(interp === undefined){ interp = 0.5; }
	// traditional voronoi diagram lines
	for(var i = 0; i < v.edges.length; i++){
		var edge = v.edges[i];
		if(edge != undefined && edge[0] != undefined && edge[1] != undefined){
			var crease = cp.crease(edge[0][0], edge[0][1], edge[1][0], edge[1][1]);
			if(crease !== undefined){ crease.valley(); }
		}
	}
	// protection against null data inside array
	var vEdges = v.edges.filter(function(el){ return el !== undefined; });
	for(var e = 0; e < vEdges.length; e++){
		// for each edge, find the left and right cell center nodes
		//  make a copy interpolated toward the node
		var endpoints = [ {x:vEdges[e][0][0], y:vEdges[e][0][1]}, 
		                  {x:vEdges[e][1][0], y:vEdges[e][1][1]} ];
		if(vEdges[e].left !== undefined){
			var center = {'x':vEdges[e].left[0], 'y':vEdges[e].left[1] };
			var midpoints = [interpolate(endpoints[0], center, interp), 
			                 interpolate(endpoints[1], center, interp)];
			var crease = cp.crease(midpoints[0], midpoints[1]);
			if(crease !== undefined){ crease.mountain(); }
			var boundCrease1 = cp.crease(endpoints[0], midpoints[0]);
			var boundCrease2 = cp.crease(endpoints[1], midpoints[1]);
			if(boundCrease1 !== undefined){ boundCrease1.mountain(); }
			if(boundCrease2 !== undefined){ boundCrease2.mountain(); }
		}
		if(vEdges[e].right !== undefined){
			var center = {'x':vEdges[e].right[0], 'y':vEdges[e].right[1] };
			var midpoints = [interpolate(endpoints[0], center, interp), 
			                 interpolate(endpoints[1], center, interp)];
			var crease = cp.crease(midpoints[0], midpoints[1]);
			if(crease !== undefined){ crease.mountain(); }
			var boundCrease1 = cp.crease(endpoints[0], midpoints[0]);
			var boundCrease2 = cp.crease(endpoints[1], midpoints[1]);
			if(boundCrease1 !== undefined){ boundCrease1.mountain(); }
			if(boundCrease2 !== undefined){ boundCrease2.mountain(); }
		}
	}
}

voronoiInterp.reset = function(){
	this.cp.clear();
	this.init();
	voronoiAlgorithm = d3.voronoi().extent( this.cp.boundingBox_array() );
}
voronoiInterp.reset();

voronoiInterp.redraw = function(){

	var nodes = input.nodes.map(function(el){return el.values();});
	var v = voronoiAlgorithm( nodes );

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	creaseVoronoi(this.cp, v, vInterpolation);
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
	vInterpolation = map( Math.sin(event.time*0.5), -1, 1, 0.4, 0.9 );
	this.redraw();
}
