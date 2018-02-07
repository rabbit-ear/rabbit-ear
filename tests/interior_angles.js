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
var centerNode = undefined;
var draggingNode = undefined;
project.arcLayer = new project.scope.Layer();
project.arcLayer.sendToBack();
project.backgroundLayer.sendToBack();
// project.edgeLayer.bringToFront();
// project.mouseDragLayer.bringToFront();

project.updateAngles = function(){
	this.arcLayer.activate();
	this.arcLayer.removeChildren();

	// var interior = centerNode.interiorAngles();
	// console.log(interior);
	// var clockwiseAngles = interior.map(function(el){ return el.angle(); });
	// console.log(clockwiseAngles);

	var interior = centerNode.interiorAngles().sort(function(a,b){ return a.angle() < b.angle(); });

	// var vectors = interior.map(function(el){return el.vectors();});

	colors = [red,yellow,blue];

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



	// var nodes = validNodes.map(function(el){return new XY(el.x, el.y);});
	// var bisections = bisect(nodes[0], nodes[1]);
	// var small = bisections[0];
	// var large = bisections[1];
	// // bisect smaller angle
	// var arc1Pts = [ new XY(validNodes[0].x, validNodes[0].y), small, new XY(validNodes[1].x, validNodes[1].y) ];
	// for(var i = 0; i < 3; i++){ arc1Pts[i] = arc1Pts[i].normalize().scale(0.25); }
	// // bisect larger angle
	// var arc2Pts = [ new XY(validNodes[0].x, validNodes[0].y), large, new XY(validNodes[1].x, validNodes[1].y) ];
	// for(var i = 0; i < 3; i++){ arc2Pts[i] = arc2Pts[i].normalize().scale(0.3); }
	// // draw things
	// var smallArc = new this.scope.Path.Arc(arc1Pts[0], arc1Pts[1], arc1Pts[2]);
	// smallArc.add(new this.scope.Point(0.0, 0.0));
	// smallArc.closed = true;
	// var largeArc = new this.scope.Path.Arc(arc2Pts[0], arc2Pts[1], arc2Pts[2]);
	// largeArc.add(new this.scope.Point(0.0, 0.0));
	// largeArc.closed = true;
	// var smallLine = new this.scope.Path({segments:[[0.0, 0.0], [small.x,small.y]], closed:true});
	// var largeLine = new this.scope.Path({segments:[[0.0, 0.0], [large.x,large.y]], closed:true});

	// Object.assign(smallLine, this.style.mountain);
	// Object.assign(largeLine, this.style.mountain);
	// Object.assign(smallLine, {strokeColor:yellow});
	// Object.assign(largeLine, {strokeColor:blue});
	// Object.assign(smallArc, this.style.mountain);
	// Object.assign(largeArc, this.style.mountain);
	// Object.assign(smallArc, {strokeColor:null, fillColor:blue});
	// Object.assign(largeArc, {strokeColor:null, fillColor:red});
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
