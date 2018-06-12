var flat_foldable_single_callback;

var ffSingle = new OrigamiPaper("canvas-flat-foldable-single");
ffSingle.setPadding(0.05);
ffSingle.masterCP = new CreasePattern();

ffSingle.rebuild = function(){
	this.cp = this.masterCP.copy();
	this.cp.clean();
	this.draw();
}

ffSingle.reset = function(){
	paper = this.scope; 
	// make 3 fan lines with a good sized interior angle between them
	var center = new XY(0.5, 0.5);
	do{
		this.masterCP.clear();
		this.masterCP.nodes = [];
		this.masterCP.edges = [];
		for(var i = 0; i < 3; i++){
			var angle = Math.random()*Math.PI*2;
			this.masterCP.creaseRay(center, new XY(Math.cos(angle), Math.sin(angle))).valley();
		}
		this.masterCP.clean();
		this.masterCP.flatten();
		this.centerNode = this.masterCP.nearest(0.5, 0.5).node;
		interiorAngles = this.centerNode.junction().interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i] < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);
	this.masterCP.clean();
	this.masterCP.flatten();
	this.rebuild();
}
ffSingle.reset();

ffSingle.onFrame = function(event) { }
ffSingle.onResize = function(event) { }
ffSingle.onMouseDown = function(event){
	this.reset();
}
ffSingle.onMouseUp = function(event){ }
ffSingle.onMouseMove = function(event) {
	this.rebuild();
	var kawasakiSolution = undefined;
	var sector = undefined;
	if(event.point.x >= 0 && event.point.x <= 1 && event.point.y >= 0 && event.point.y <= 1){
		// sector = this.cp.nearest(event.point).sector;
		sector = this.centerNode.junction().sectors.filter(function(sector){
			return sector.contains(event.point);
		},this).shift();

		if(sector == undefined || sector.edges == undefined) return;
		if(sector.edges.length == 2){
			kawasakiSolution = sector.kawasakiCollapse();
			if(kawasakiSolution){ 
				this.cp.crease(kawasakiSolution).mountain();
			}			
		}
	}
	this.cp.clean();
	this.draw();

	if(flat_foldable_single_callback != undefined){
		flat_foldable_single_callback({'solution':kawasakiSolution, 'sector':sector});
	}
}
