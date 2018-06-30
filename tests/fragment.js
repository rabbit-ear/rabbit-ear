
fragment_sketch_callback = undefined;

var fragmentSketch = new OrigamiPaper("canvas-fragment").setPadding(0.025);
fragmentSketch.show.nodes = true;
fragmentSketch.show.boundary = false;
fragmentSketch.style.node.fillColor = fragmentSketch.styles.byrne.blue;
// fragmentSketch.numLines = 8;
fragmentSketch.numLines = 30;
fragmentSketch.selectEdges = true;

fragmentSketch.reset = function(numLines){
	if(numLines != undefined){ this.numLines = numLines; }
	var aspect = this.canvas.width / this.canvas.height;
	this.cp.rectangle(aspect, 1.0);
	this.cp.clear();
	this.cp.crease(0.499, 0.499, 0.5, 0.5);
	for(var i = 0; i < this.numLines; i++){
		var angle = Math.random()*Math.PI*2;
		this.cp.creaseRay(new XY(Math.random() * aspect, Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	var report = this.cp.fragment();
	var intersections = report.nodes.fragment;
	this.draw();
	this.cp.nodes.filter(function(node){ return node.degree() < 2; },this)
	             .forEach(function(node){this.nodes[node.index].fillColor = {alpha:0.0};},this)
	if(fragment_sketch_callback != undefined){ fragment_sketch_callback(intersections); }
	// console.log(report);
	// console.log(intersections);
}
fragmentSketch.reset();

// fragmentSketch.reset = function(numLines){
// 	var deets = [[0.60419437170478, 0.14686996875831926, 3.9568286630141176],
// 	[0.6610256546337476, 0.5778742333458071, 1.9525580006566994],
// 	[0.26203423277048743, 0.8906852089046491, 1.4141598680656493],
// 	[0.6133555506182051, 0.9790907619705194, 2.3643212888638234]]
// 	if(numLines != undefined){ this.numLines = numLines; }
// 	var aspect = this.canvas.width / this.canvas.height;
// 	this.cp.rectangle(aspect, 1.0);
// 	this.cp.clear();
// 	for(var i = 0; i < 4; i++){
// 		var a = deets[i][0];
// 		var b = deets[i][1];
// 		var angle = deets[i][2];
// 		this.cp.creaseRay(new XY(a, b), new XY(Math.cos(angle), Math.sin(angle)));
// 	}
// 	console.log("++++++++++++++++++++++");
// 	var report = this.cp.fragment();
// 	console.log(report);
// 	var intersections = report.nodes.fragment;
// 	this.draw();
// 	this.cp.nodes.filter(function(node){ return node.degree() < 2; },this)
// 	             .forEach(function(node){this.nodes[node.index].fillColor = {alpha:0.0};},this)
// 	if(fragment_sketch_callback != undefined){ fragment_sketch_callback(intersections); }
// }
// fragmentSketch.reset();


// fragmentSketch.reset = function(numLines){
// 	if(numLines != undefined){ this.numLines = numLines; }
// 	var aspect = this.canvas.width / this.canvas.height;
// 	this.cp.rectangle(aspect, 1.0);
// 	this.cp.clear();
// 	this.cp.clean();
// 	this.cp.fragment();
// 	this.cp.crease(new XY(Math.random()*0.5, Math.random()*.2+0.4), new XY(Math.random()*0.5+0.5, Math.random()*0.2+0.4));
// 	this.cp.crease(new XY(Math.random()*0.2+0.4, Math.random()*0.5), new XY(Math.random()*0.2+0.4, Math.random()*0.5+0.5));
// 	// this.cp.crease(new XY(Math.random()*0.2+0.4, Math.random()*0.5), new XY(Math.random()*0.2+0.4, Math.random()*0.5+0.5));
// 	console.log("++++++++++++++++++++++");
// 	var report = this.cp.fragment();
// 	console.log(report);
// 	var intersections = report.nodes.fragment;
// 	this.draw();
// 	this.cp.nodes.filter(function(node){ return node.degree() < 2; },this)
// 	             .forEach(function(node){this.nodes[node.index].fillColor = {alpha:0.0};},this)
// 	if(fragment_sketch_callback != undefined){ fragment_sketch_callback(intersections); }
// }
// fragmentSketch.reset();

fragmentSketch.onFrame = function(event){ }
fragmentSketch.onResize = function(event){ }
fragmentSketch.onMouseDown = function(event){ this.reset(); }
fragmentSketch.onMouseUp = function(event){ }
fragmentSketch.onMouseMove = function(event){
	if(!this.selectEdges){ return; }
	this.update();
	this.cp.nodes.filter(function(node){ return node.degree() < 2; },this)
	             .forEach(function(node){this.nodes[node.index].fillColor = {alpha:0.0};},this)
	var nearest = this.cp.nearest(event.point);
	if(nearest.edge){
		this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.yellow;
		this.nodes[ nearest.edge.nodes[0].index ].fillColor = this.styles.byrne.red;
		this.nodes[ nearest.edge.nodes[1].index ].fillColor = this.styles.byrne.red;
	}
}
