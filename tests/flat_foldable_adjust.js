var flat_foldable_adjust_callback;

var ffAdjust = new OrigamiPaper("canvas-flat-foldable-adjust").setPadding(0.05).mediumLines().blackAndWhite();
ffAdjust.show.sectors = true;
ffAdjust.show.nodes = true;
ffAdjust.style.sector.fillColors = [{alpha:0.0}, {alpha:0.0}];
ffAdjust.style.errorColors = [ffAdjust.styles.byrne.red, ffAdjust.styles.byrne.yellow];
// moving node
ffAdjust.nearestNode = undefined;
ffAdjust.movingNode = undefined;
ffAdjust.mNodeOriginalLocation = undefined;

ffAdjust.load("/files/svg/sea-turtle-errors.svg", function(){ 
	ffAdjust.colorNodesFlatFoldable();
});

ffAdjust.updateNodes = function(){
	for(var i=0;i<this.nodes.length;i++){Object.assign(this.nodes[i], this.style.node); }
	if(this.nearestNode != undefined){
		this.nodes[ this.nearestNode.index ].fillColor = this.styles.byrne.yellow;
	}
}

ffAdjust.colorNodesFlatFoldable = function(epsilon){
	if(epsilon == undefined){ epsilon = 0.01; }
	this.cp.junctions
		.map(function(j){ return { 'junction':j, 'foldable':j.flatFoldable(epsilon) }; },this)
		.filter(function(el){return !el.foldable; })
		.forEach(function(el){
			el.junction.sectors.forEach(function(sector, i){
				this.sectors[ sector.index ].fillColor = this.style.errorColors[i%2];
			},this);
		},this);
}

ffAdjust.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.draw();
}
ffAdjust.reset();

ffAdjust.onFrame = function(event){ }
ffAdjust.onResize = function(event){ }
ffAdjust.onMouseDown = function(event){ 
	this.movingNode = this.nearestNode;
	this.mNodeOriginalLocation = {x:this.movingNode.x, y:this.movingNode.y};
	this.colorNodesFlatFoldable();
}
ffAdjust.onMouseUp = function(event){ 
	if(this.movingNode != undefined && this.mNodeOriginalLocation != undefined){
		this.movingNode.x = this.mNodeOriginalLocation.x;
		this.movingNode.y = this.mNodeOriginalLocation.y;
		this.movingNode = undefined;
		this.mNodeOriginalLocation = undefined;
		this.draw();
		this.colorNodesFlatFoldable();
		this.updateNodes();
	}
}
ffAdjust.onMouseMove = function(event){
	if(this.movingNode != undefined){
		this.movingNode.x = event.point.x;
		this.movingNode.y = event.point.y;
		this.draw();
		this.colorNodesFlatFoldable();
	} else{
		this.nearestNode = this.cp.nearest( event.point.x, event.point.y ).node;
	}
	this.updateNodes();

	if(flat_foldable_adjust_callback != undefined){
		flat_foldable_adjust_callback({'point':event.point, 'node':this.nearestNode.index, 'valid':this.nearestNode.flatFoldable()});
	}
}
