var flat_foldable_nodes_callback;

var ffSketch = new OrigamiPaper("canvas-flat-foldable-nodes");
ffSketch.setPadding(0.05);

loadSVG("/files/svg/sea-turtle-errors.svg", function(e){ 
	ffSketch.cp = e;
	ffSketch.draw();
	ffSketch.nodeLayer.visible = true;
	ffSketch.colorNodesFlatFoldable();
	for(var i = 0; i < ffSketch.nodes.length; i++){ 
		ffSketch.nodes[i].visible = true;
		ffSketch.nodes[i].radius = 0.02; 
	}
});

ffSketch.colorNodesFlatFoldable = function(){
	for(var i = 0; i < ffSketch.cp.nodes.length; i++){
		var color = { hue:130, saturation:0.8, brightness:0.7, alpha:0.5 }
		if( !ffSketch.cp.nodes[i].flatFoldable() ){ color = { hue:0, saturation:0.8, brightness:1, alpha:0.5 } }
		ffSketch.nodes[i].fillColor = color;
	}
}

ffSketch.selectNearestEdge = true;

ffSketch.reset = function(){
	paper = this.scope; 
	ffSketch.cp.clear();
	ffSketch.draw();
	for(var i = 0; i < ffSketch.nodes.length; i++){ 
		ffSketch.nodes[i].visible = true;
	}
}
ffSketch.reset();

ffSketch.onFrame = function(event) { }
ffSketch.onResize = function(event) { }
ffSketch.onMouseDown = function(event){ }
ffSketch.onMouseUp = function(event){ }
ffSketch.onMouseMove = function(event) { }
