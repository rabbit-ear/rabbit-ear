
chop_sketch_callback = undefined;

var chop_sketch = new OrigamiPaper("canvas-chop").setPadding(0.025);
chop_sketch.show.nodes = true;
chop_sketch.style.node.fillColor = chop_sketch.styles.byrne.blue;

chop_sketch.reset = function(numLines){
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
	if(chop_sketch_callback != undefined){ chop_sketch_callback(intersections); }
}
chop_sketch.reset();

chop_sketch.onFrame = function(event){ }
chop_sketch.onResize = function(event){ }
chop_sketch.onMouseDown = function(event){ this.reset(); }
chop_sketch.onMouseUp = function(event){ }
chop_sketch.onMouseMove = function(event){
	this.update();
	this.cp.nodes.filter(function(node){ return node.degree() < 2; },this)
	             .forEach(function(node){this.nodes[node.index].fillColor = {alpha:0.0};},this)
	var nearest = this.cp.nearest(event.point);
	if(nearest.edge){ this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.yellow; }
}
