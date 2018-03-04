var interiorAnglesCallback = undefined;


var red = {hue:0.04*360, saturation:0.87, brightness:0.90 };
var yellow = {hue:0.12*360, saturation:0.88, brightness:0.93 };
var blue = {hue:0.53*360, saturation:0.82, brightness:0.28 };
var black = {hue:0, saturation:0, brightness:0 };

var colors = [red,yellow,blue];


var projectInAngles = new OrigamiPaper("canvas-interior-angles", new CreasePattern().setBoundary([new XY(-1.0,-1.0),new XY(1.0,-1.0),new XY(1.0,1.0),new XY(-1.0,1.0)]));
projectInAngles.style.mountain.strokeWidth = 0.02;
projectInAngles.style.mountain.strokeColor = { gray:0.0, alpha:1.0 };
projectInAngles.cp.edges = projectInAngles.cp.edges.filter(function(el){ return el.orientation !== CreaseDirection.border});
projectInAngles.style.selectedNode.fillColor = yellow;
projectInAngles.style.selectedNode.radius = 0.04;


projectInAngles.validNodes = [];
projectInAngles.centerNode = undefined;
projectInAngles.draggingNode = undefined;
projectInAngles.arcLayer = new projectInAngles.scope.Layer();
projectInAngles.arcLayer.sendToBack();
projectInAngles.backgroundLayer.sendToBack();

projectInAngles.updateAngles = function(){
	this.arcLayer.activate();
	this.arcLayer.removeChildren();

	var i = 0;
	var radiuses = [0.35, 0.3, 0.25];

	var eventData = {edgeAngles:[], interiorAngles:[]};
	
	this.centerNode.junction().joints
		.sort(function(a,b){ return a.angle() < b.angle(); })
		.forEach(function(el){
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
			eventData.interiorAngles.push(el.angle());
			eventData.edgeAngles.push(el.edges[0].absoluteAngle(el.node));
		},this);

	eventData.edgeAngles.forEach(function(el,i){if(el < 0){eventData.edgeAngles[i]+=Math.PI*2;}});
	eventData.interiorAngles.forEach(function(el,i){if(el < 0){interiorAngles[i]+=Math.PI*2;}});
	eventData.edgeAngles.sort();
	eventData.interiorAngles.sort();
	if(interiorAnglesCallback !== undefined){
		interiorAnglesCallback(eventData);
	}
}

projectInAngles.reset = function(){	
	this.selectNearestNode = true;
	var creases = [
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain(),
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain(),
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random()*2-1.0, Math.random()*2-1.0)).mountain()
	];
	this.cp.clean();
	this.validNodes = [
		creases[0].uncommonNodeWithEdge(creases[1]),
		creases[1].uncommonNodeWithEdge(creases[0]),
		creases[2].uncommonNodeWithEdge(creases[0])
	];
	this.centerNode = creases[0].commonNodeWithEdge(creases[1]);
	this.draw();
	this.updateAngles();
}
projectInAngles.reset();

projectInAngles.onFrame = function(event) { }
projectInAngles.onResize = function(event) { }
projectInAngles.onMouseDown = function(event){
	if(this.validNodes.contains(this.nearestNode)){
		this.draggingNode = this.nearestNode;
	}
}
projectInAngles.onMouseUp = function(event){
	this.draggingNode = undefined;
}
projectInAngles.onMouseMove = function(event){
	paper = this.scope;
	if(this.draggingNode !== undefined){
		this.draggingNode.x = event.point.x;
		this.draggingNode.y = event.point.y;
	}
	this.update();
	this.updateAngles();
}
projectInAngles.onMouseDidBeginDrag = function(event){ }
