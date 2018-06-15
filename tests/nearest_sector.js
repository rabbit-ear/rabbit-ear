var nearSectorCallback;

// var nearSector = new OrigamiPaper("canvas-nearest-angle", new PlanarGraph());
var nearSector = new OrigamiPaper("canvas-nearest-sector");
nearSector.show.sectors = true;
nearSector.show.boundary = false;
nearSector.style.sector.fillColors = [{gray:1.0},{gray:1.0}];
nearSector.style.mark.strokeColor = {gray:0.0};
nearSector.style.sector.scale = 1.0;
var centerNode;

nearSector.reset = function(){
	this.cp.nodes = [];
	this.cp.edges = [];
	var center = new XY(0.5, 0.5);
	var angle = 0;
	while(angle < Math.PI*2){
		var len = 0.5;
		this.cp.newPlanarEdge(0.5, 0.5, 0.5+len*Math.cos(angle), 0.5+len*Math.sin(angle) );
		angle += Math.PI / 64 + Math.random() * Math.PI / 6;
	}
	this.cp.flatten();
	centerNode = this.cp.nearest(center).node;
	this.draw();
}
nearSector.reset();
nearSector.onFrame = function(event){ }
nearSector.onResize = function(event){ }
nearSector.onMouseDown = function(event){  this.reset();  }
nearSector.onMouseUp = function(event){ }
nearSector.onMouseMove = function(event) {
	this.updateStyles();
	var nearest = this.cp.nearest(event.point.x, event.point.y);
	var junction = nearest.junction;
	var sector = nearest.sector;
	var indexIn = junction.sectors.indexOf(sector);
	if(sector !== undefined){
		this.sectors[ sector.index ].style.fillColor = this.styles.byrne.red;
		this.sectors[ sector.index ].bringToFront();
	}
	if(nearSectorCallback != undefined){ nearSectorCallback({point:event.point, index:indexIn}); }
}
