var ffSketch = new OrigamiPaper("canvas-flat-foldable").setPadding(0.05).mediumLines().blackAndWhite();
ffSketch.show.sectors = true;
ffSketch.style.sector.fillColors = [{alpha:0.0}, {alpha:0.0}];
ffSketch.errorColors = [ffSketch.styles.byrne.red, ffSketch.styles.byrne.yellow];

ffSketch.load("/files/errors/sea-turtle-errors.svg", function(){ 
	ffSketch.colorNodesFlatFoldable();
});

ffSketch.colorNodesFlatFoldable = function(epsilon){
	if(epsilon == undefined){ epsilon = 0.0001; }
	this.cp.junctions
		.map(function(j){ return { 'junction':j, 'foldable':j.flatFoldable(epsilon) }; },this)
		.filter(function(el){return !el.foldable; })
		.forEach(function(el){
			el.junction.sectors.forEach(function(sector, i){
				this.sectors[ sector.index ].fillColor = this.errorColors[i%2];
			},this);
		},this);
}

ffSketch.onFrame = function(event) { }
ffSketch.onResize = function(event) { }
ffSketch.onMouseDown = function(event){ }
ffSketch.onMouseUp = function(event){ }
ffSketch.onMouseMove = function(event) { }
