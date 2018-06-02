
fragment_sketch_callback = undefined;

var fragmentSketch = new OrigamiPaper("canvas-fragment").setPadding(0.025);
fragmentSketch.show.nodes = true;
fragmentSketch.show.boundary = false;
fragmentSketch.style.node.fillColor = fragmentSketch.styles.byrne.blue;
fragmentSketch.numLines = 1;
// fragmentSketch.numLines = 30;
fragmentSketch.selectEdges = true;

fragmentSketch.reset = function(numLines){
	if(numLines != undefined){ this.numLines = numLines; }
	var aspect = this.canvas.width / this.canvas.height;
	this.cp.rectangle(aspect, 1.0);
	this.cp.clear();
	console.log(this.cp.clean());
	console.log(this.cp.fragment());
	for(var i = 0; i < this.numLines; i++){
		var angle = Math.random()*Math.PI*2;
		this.cp.creaseRay(new XY(Math.random() * aspect, Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	console.log("++++++++++++++++++++++");
	var report = this.cp.fragment();
	console.log(report);
	var intersections = report.nodes.fragment;
	this.draw();
	this.cp.nodes.filter(function(node){ return node.degree() < 2; },this)
	             .forEach(function(node){this.nodes[node.index].fillColor = {alpha:0.0};},this)
	if(fragment_sketch_callback != undefined){ fragment_sketch_callback(intersections); }
}
fragmentSketch.reset();


// fragmentSketch.reset = function(numLines){
// 	if(numLines != undefined){ this.numLines = numLines; }
// 	var aspect = this.canvas.width / this.canvas.height;
// 	this.cp.rectangle(aspect, 1.0);
// 	this.cp.clear();
// 	this.cp.clean();
// 	this.cp.fragment();
// 	this.cp.crease(new XY(Math.random()*0.5, Math.random()*.2+0.4), new XY(Math.random()*0.5+0.5, Math.random()*0.2+0.4));
// 	this.cp.crease(new XY(Math.random()*0.2+0.4, Math.random()*0.5), new XY(Math.random()*0.2+0.4, Math.random()*0.5+0.5));
// 	this.cp.crease(new XY(Math.random()*0.2+0.4, Math.random()*0.5), new XY(Math.random()*0.2+0.4, Math.random()*0.5+0.5));
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
