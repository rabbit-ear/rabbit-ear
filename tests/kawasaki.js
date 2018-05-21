var kawasakiCallback = undefined;

var projectKawasaki = new OrigamiPaper("canvas-kawasaki", new CreasePattern().setBoundary([[-1,-1],[1,-1],[1,1],[-1,1]]));

projectKawasaki.style.node.radius = 0.03;
projectKawasaki.style.node.fillColor = Object.assign({alpha:0.0}, projectKawasaki.styles.byrne.yellow);
projectKawasaki.style.mountain = {strokeColor: { gray:0.0, alpha:1.0 }, strokeWidth:0.02};
projectKawasaki.show.nodes = true;
projectKawasaki.show.boundary = false;

projectKawasaki.validNodes = [];
projectKawasaki.draggingNode = undefined;

projectKawasaki.arcLayer = new projectKawasaki.scope.Layer();
projectKawasaki.arcLayer.sendToBack();
projectKawasaki.backgroundLayer.sendToBack();

projectKawasaki.drawSectors = function(){

	this.cp.flatten();
	var kawasakis = this.centerNode.junction().kawasakiSolution();
	kawasakis.forEach(function(el){
		el['angles'] = el.sectors.map(function(sector){ return sector.angle(); });
	},this)

	// is the joint flat-foldable? set colors accordingly
	this.fillColors = (this.centerNode.kawasakiRating() < 0.015) ? 
	                   [this.styles.byrne.yellow, this.styles.byrne.yellow] : 
	                   [this.styles.byrne.red, this.styles.byrne.darkBlue];

	this.arcLayer.activate();
	this.arcLayer.removeChildren();
	// calculate points to build sector arcs with diameters according to how flat-foldable
	var arcpoints = kawasakis.map(function(el,j){
		return el.sectors.map(function(sector){
			var a = new XY(sector.endPoints[0].x, sector.endPoints[0].y);
			var c = new XY(sector.endPoints[1].x, sector.endPoints[1].y);
			var b = sector.bisect();
			var arcPts = [a,b,c];
			var arcRadius = 0.35 + el.difference*0.1;
			for(var p = 0; p < 3; p++){ arcPts[p] = arcPts[p].normalize().scale(arcRadius); }
			return arcPts;
		},this);
	},this);

	// draw sector arcs
	arcpoints.forEach(function(arcspoints,j){
		arcspoints.forEach(function(arcpts){
			var arc = new this.scope.Path.Arc(arcpts[0], arcpts[1], arcpts[2]);
			arc.add(new this.scope.Point(0.0, 0.0));
			arc.fillColor = this.fillColors[j%2];
			arc.closed = true;			
		},this)
	},this);

	if(kawasakiCallback != undefined){ kawasakiCallback(kawasakis); }
}

projectKawasaki.reset = function(){
	var numLines = 8;
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];

	var creases = [];
	for(var i = 0; i < numLines; i++){
		var r = Math.random()*0.5 + 0.5;
		var a = Math.random()*Math.PI*2;
		creases.push(this.cp.crease(new XY(0.0, 0.0), new XY(r*Math.cos(a), r*Math.sin(a))).mountain());
	}
	this.cp.clean();
	this.validNodes = [creases[0].uncommonNodeWithEdge(creases[1])];
	for(var i = 1; i < numLines; i++){
		this.validNodes.push(creases[i].uncommonNodeWithEdge(creases[0]));
	}
	this.centerNode = creases[0].commonNodeWithEdge(creases[1]);
	this.draw();
	this.drawSectors();
}
projectKawasaki.reset();

projectKawasaki.onFrame = function(event) { }
projectKawasaki.onResize = function(event) { }
projectKawasaki.onMouseDown = function(event){
	if(this.validNodes.filter(function(e){return e===this.nearestNode;},this).length > 0){
		this.draggingNode = this.nearestNode;
	}
}
projectKawasaki.onMouseUp = function(event){ this.draggingNode = undefined; }
projectKawasaki.onMouseMove = function(event){
	if(this.draggingNode !== undefined){
		this.draggingNode.x = event.point.x;
		this.draggingNode.y = event.point.y;
	} else{
		this.nearestNode = this.cp.nearest(event.point).node;
	}
	this.update();
	this.drawSectors();
	if(this.nearestNode != undefined && this.nearestNode !== this.centerNode){
		this.nodes[ this.nearestNode.index ].fillColor.alpha = 1.0;
	}
}
projectKawasaki.onMouseDidBeginDrag = function(event){ }
