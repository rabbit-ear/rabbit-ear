var kawasakiCallback = undefined;

var projectKawasaki = new OrigamiPaper("canvas-kawasaki", new CreasePattern().setBoundary([new XY(-1.0,-1.0),new XY(1.0,-1.0),new XY(1.0,1.0),new XY(-1.0,1.0)]));

projectKawasaki.style.mountain.strokeWidth = 0.02;
projectKawasaki.style.mountain.strokeColor = { gray:0.0, alpha:1.0 };
projectKawasaki.cp.edges = projectKawasaki.cp.edges.filter(function(el){ return el.orientation !== CreaseDirection.border});
projectKawasaki.style.selectedNode.fillColor = projectKawasaki.styles.byrne.yellow;
projectKawasaki.style.selectedNode.radius = 0.04;

projectKawasaki.validNodes = [];
var draggingNode = undefined;
projectKawasaki.arcLayer = new projectKawasaki.scope.Layer();
projectKawasaki.arcLayer.sendToBack();
projectKawasaki.backgroundLayer.sendToBack();

projectKawasaki.updateAngles = function(){
	this.arcLayer.activate();
	this.arcLayer.removeChildren();
	var rating = this.centerNode.kawasakiRating();

	var junction = this.centerNode.junction();
	var kawasakis = this.centerNode.junction().kawasakiSolution();

	kawasakis.forEach(function(el, j){
		var sectors = el.sectors;
		var difference = el.difference;
		for(var i = 0; i < sectors.length; i++){
			var a = new XY(sectors[i].endPoints[0].x, sectors[i].endPoints[0].y);
			var c = new XY(sectors[i].endPoints[1].x, sectors[i].endPoints[1].y);
			var b = sectors[i].bisect();
			var arcPts = [a,b,c];
			var arcRadius = 0.35 + difference*0.1;
			for(var p = 0; p < 3; p++){ arcPts[p] = arcPts[p].normalize().scale(arcRadius); }
			var arc = new this.scope.Path.Arc(arcPts[0], arcPts[1], arcPts[2]);
			arc.add(new this.scope.Point(0.0, 0.0));
			arc.fillColor = ([this.styles.byrne.red,this.styles.byrne.darkBlue])[j%2];
			if(Math.abs(difference) < 0.015){ arc.fillColor = this.styles.byrne.yellow; }
			arc.closed = true;
		}
	},this);

	if(kawasakiCallback != undefined){
		var event = kawasakis.map(function(el){
			el['angles'] = el.sectors.map(function(joint){ return joint.angle(); });
		});
		kawasakiCallback(kawasakis);
	}
}

projectKawasaki.reset = function(){

	var numNodes = 8;

	this.select.node = true;
	var creases = [];
	for(var i = 0; i < numNodes; i++){
		var r = Math.random()*0.5 + 0.5;
		var a = Math.random()*Math.PI*2;
		creases.push(this.cp.crease(new XY(0.0, 0.0), new XY(r*Math.cos(a), r*Math.sin(a))).mountain());
	}
	this.cp.clean();
	this.validNodes = [creases[0].uncommonNodeWithEdge(creases[1])];
	for(var i = 1; i < numNodes; i++){
		this.validNodes.push(creases[i].uncommonNodeWithEdge(creases[0]));
	}
	this.centerNode = creases[0].commonNodeWithEdge(creases[1]);
	this.draw();
	this.updateAngles();
}
projectKawasaki.reset();

projectKawasaki.onFrame = function(event) { }
projectKawasaki.onResize = function(event) { }
projectKawasaki.onMouseDown = function(event){
	if(this.validNodes.filter(function(e){return e===this.nearest.node;},this).length > 0){
		draggingNode = this.nearest.node;
	}
}
projectKawasaki.onMouseUp = function(event){
	draggingNode = undefined;
}
projectKawasaki.onMouseMove = function(event){
	if(draggingNode !== undefined){
		draggingNode.x = event.point.x;
		draggingNode.y = event.point.y;
	}
	this.update();
	this.updateAngles();
}
projectKawasaki.onMouseDidBeginDrag = function(event){ }
