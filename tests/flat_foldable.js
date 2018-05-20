var ffSketch = new OrigamiPaper("canvas-flat-foldable").setPadding(0.05).mediumLines();
// ffSketch.show.nodes = true;
ffSketch.show.sectors = true;
ffSketch.style.sector.fillColors = [ffSketch.styles.byrne.red, ffSketch.styles.byrne.yellow];

ffSketch.load("/files/svg/sea-turtle-errors.svg", function(){ 
	ffSketch.colorNodesFlatFoldable();
	// for(var i = 0; i < ffSketch.nodes.length; i++){ 
	// 	ffSketch.nodes[i].visible = true;
	// 	ffSketch.nodes[i].radius = 0.02; 
	// }
});

ffSketch.colorNodesFlatFoldable = function(){
	// for(var i = 0; i < this.cp.nodes.length; i++){
	// 	var color = { hue:130, saturation:0.8, brightness:0.7, alpha:0.5 }
	// 	if(!this.cp.nodes[i].flatFoldable()){ color = {hue:0, saturation:0.8, brightness:1, alpha:0.5} }
	// 	this.nodes[i].fillColor = color;
	// }
}

ffSketch.select.edge = true;

ffSketch.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.draw();
}
ffSketch.reset();

ffSketch.onFrame = function(event) { }
ffSketch.onResize = function(event) { }
ffSketch.onMouseDown = function(event){ }
ffSketch.onMouseUp = function(event){ }
ffSketch.onMouseMove = function(event) { }
