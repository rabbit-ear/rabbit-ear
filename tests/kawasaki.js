var red = {hue:0.04*360, saturation:0.87, brightness:0.90 };
var yellow = {hue:0.12*360, saturation:0.88, brightness:0.93 };
var blue = {hue:0.53*360, saturation:0.82, brightness:0.28 };
var black = {hue:0, saturation:0, brightness:0 };

var project = new OrigamiPaper("canvas", new CreasePattern().setBoundary([new XY(-1.0,-1.0),new XY(1.0,-1.0),new XY(1.0,1.0),new XY(-1.0,1.0)]));
project.style.mountain.strokeWidth = 0.02;
project.style.mountain.strokeColor = { gray:0.0, alpha:1.0 };
project.cp.edges = project.cp.edges.filter(function(el){ return el.orientation !== CreaseDirection.border});
project.style.selectedNode.fillColor = yellow;
project.style.selectedNode.radius = 0.04;

var validNodes = [];
var draggingNode = undefined;
project.arcLayer = new project.scope.Layer();
project.arcLayer.sendToBack();
project.backgroundLayer.sendToBack();

project.updateAngles = function(){
	this.arcLayer.activate();
	this.arcLayer.removeChildren();
	var rating = this.centerNode.kawasakiRating();

	var junction = this.centerNode.junction();
	var kawasakis = this.centerNode.junction().kawasakiSolution();

	kawasakis.forEach(function(el, j){
		var joints = el.joints;
		var difference = el.difference;
		for(var i = 0; i < joints.length; i++){
			var a = joints[i].endNodes[0].xy();
			var c = joints[i].endNodes[1].xy();
			var b = joints[i].bisect();
			var arcPts = [a,b,c];
			var arcRadius = 0.35 + difference*0.1;
			for(var p = 0; p < 3; p++){ arcPts[p] = arcPts[p].normalize().scale(arcRadius); }
			var arc = new this.scope.Path.Arc(arcPts[0], arcPts[1], arcPts[2]);
			arc.add(new this.scope.Point(0.0, 0.0));
			arc.fillColor = ([red,blue])[j%2];
			if(Math.abs(difference) < 0.015){ arc.fillColor = yellow; }
			arc.closed = true;
		}
	},this);

}

project.reset = function(){
	this.selectNearestNode = true;
	var creases = [
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain(),
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain(),
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain(),
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain()
	];
	this.cp.clean();
	validNodes = [
		creases[0].uncommonNodeWithEdge(creases[1]),
		creases[1].uncommonNodeWithEdge(creases[0]),
		creases[2].uncommonNodeWithEdge(creases[0]),
		creases[3].uncommonNodeWithEdge(creases[0])
	];
	this.centerNode = creases[0].commonNodeWithEdge(creases[1]);
	this.draw();
	this.updateAngles();
}
project.reset();

project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){
	if(validNodes.contains(this.nearestNode)){
		draggingNode = this.nearestNode;
	}
}
project.onMouseUp = function(event){
	draggingNode = undefined;
}
project.onMouseMove = function(event){
	if(draggingNode !== undefined){
		draggingNode.x = event.point.x;
		draggingNode.y = event.point.y;
	}
	this.update();
	this.updateAngles();
}
project.onMouseDidBeginDrag = function(event){ }
