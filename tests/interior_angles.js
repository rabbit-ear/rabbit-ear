var red = {hue:0.04*360, saturation:0.87, brightness:0.90 };
var yellow = {hue:0.12*360, saturation:0.88, brightness:0.93 };
var blue = {hue:0.53*360, saturation:0.82, brightness:0.28 };
var black = {hue:0, saturation:0, brightness:0 };


var colors = [red,yellow,blue];


var project = new OrigamiPaper("canvas", new CreasePattern().setBoundary([new XY(-1.0,-1.0),new XY(1.0,-1.0),new XY(1.0,1.0),new XY(-1.0,1.0)]));
project.style.mountain.strokeWidth = 0.02;
project.style.mountain.strokeColor = { gray:0.0, alpha:1.0 };
project.cp.edges = project.cp.edges.filter(function(el){ return el.orientation !== CreaseDirection.border});
project.style.selectedNode.fillColor = yellow;
project.style.selectedNode.radius = 0.04;


var validNodes = [];
var centerNode = undefined;
var draggingNode = undefined;
project.arcLayer = new project.scope.Layer();
project.arcLayer.sendToBack();
project.backgroundLayer.sendToBack();

project.updateAngles = function(){
	this.arcLayer.activate();
	this.arcLayer.removeChildren();

	var interior = centerNode.interiorAngles().sort(function(a,b){ return a.angle() < b.angle(); });

	var i = 0;
	var radiuses = [0.35, 0.3, 0.25];
	interior.forEach(function(el){
		var vectors = el.vectors().map(function(el){return el.normalize().scale(radiuses[i%3]);})
		var arcCenter = el.bisect().scale(radiuses[i%3]);
		var dot = new this.scope.Path.Circle(arcCenter.normalize().scale(0.9), 0.04);
		dot.style.fillColor = { gray:0.0, alpha:1.0 };
		var arc = new this.scope.Path.Arc(vectors[0], arcCenter, vectors[1]);
		arc.add(new this.scope.Point(0.0, 0.0));
		arc.closed = true;
		Object.assign(arc, this.style.mountain);
		Object.assign(arc, {strokeColor:null, fillColor:colors[i%3]});
		i++;
	},this);

}

project.reset = function(){
	console.log("reset");
	this.selectNearestNode = true;
	var creases = [
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain(),
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain(),
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain()
	];
	this.cp.clean();
	validNodes = [
		creases[0].uncommonNodeWithEdge(creases[1]),
		creases[1].uncommonNodeWithEdge(creases[0]),
		creases[2].uncommonNodeWithEdge(creases[0])
	];
	centerNode = creases[0].commonNodeWithEdge(creases[1]);
	this.draw();
	this.updateAngles();
}
project.reset();

project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){
	if(validNodes.includes(this.nearestNode)){
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
