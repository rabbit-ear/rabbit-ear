
fragment_sketch_callback = undefined;

var fragmentSketch = new OrigamiPaper("canvas-fragment").setPadding(0.025);
fragmentSketch.show.nodes = true;
fragmentSketch.style.node.fillColor = fragmentSketch.styles.byrne.blue;

fragmentSketch.reset = function(numLines){
	if(numLines == undefined){ numLines = 30; }
	var aspect = this.canvas.width / this.canvas.height;
	this.cp.rectangle(aspect, 1.0);
	this.cp.clear();
	for(var i = 0; i < numLines; i++){
		var angle = Math.random()*Math.PI*2;
		this.cp.creaseRay(new XY(Math.random() * aspect, Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	var report = this.cp.fragment();
	var intersections = report.nodes.fragment;
	this.draw();
	this.cp.nodes.filter(function(node){ return node.degree() < 2; },this)
	             .forEach(function(node){this.nodes[node.index].fillColor = {alpha:0.0};},this)
	if(fragment_sketch_callback != undefined){ fragment_sketch_callback(intersections); }
}
fragmentSketch.reset(30);

fragmentSketch.onFrame = function(event){ }
fragmentSketch.onResize = function(event){ }
fragmentSketch.onMouseDown = function(event){ this.reset(); }
fragmentSketch.onMouseUp = function(event){ }
fragmentSketch.onMouseMove = function(event){
	this.update();
	this.cp.nodes.filter(function(node){ return node.degree() < 2; },this)
	             .forEach(function(node){this.nodes[node.index].fillColor = {alpha:0.0};},this)
	var nearest = this.cp.nearest(event.point);
	if(nearest.edge){ this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.yellow; }	
}
