let interiorAngles = RabbitEar.origami("interior-angles");
interiorAngles.arcLayer = RabbitEar.svg.g();

interiorAngles.updateAngles = function(){
	interiorAngles.arcLayer.removeChildren();
	var i = 0;
	var radiuses = [0.35, 0.3, 0.25];
	var eventData = {edgeAngles:[], interiorAngles:[]};
	this.centerNode.junction().sectors
		.sort(function(a,b){ return a.angle() < b.angle(); })
		.forEach(function(el){
			var vectors = el.vectors().map(function(el){return el.normalize().scale(radiuses[i%3]);})
			var arcCenter = el.bisect().direction.scale(radiuses[i%3]);
			var dot = new this.scope.Path.Circle(arcCenter.normalize().scale(0.9), 0.04);
			dot.style.fillColor = { gray:0.0, alpha:1.0 };
			var arc = new this.scope.Path.Arc(vectors[0], arcCenter, vectors[1]);
			arc.add(new this.scope.Point(0.0, 0.0));
			arc.closed = true;
			Object.assign(arc, this.style.mountain);
			Object.assign(arc, {strokeColor:null, fillColor:this.style.myColors[i%3]});
			i++;
			eventData.interiorAngles.push(el.angle());
			var vec = el.edges[0].vector(el.node);
			eventData.edgeAngles.push(Math.atan2(vec.y, vec.x));
		},this);

	eventData.edgeAngles.forEach(function(el,i){if(el < 0){eventData.edgeAngles[i]+=Math.PI*2;}});
	eventData.interiorAngles.forEach(function(el,i){if(el < 0){interiorAngles[i]+=Math.PI*2;}});
	eventData.edgeAngles.sort();
	eventData.interiorAngles.sort();
	if(interiorAnglesCallback !== undefined){
		interiorAnglesCallback(eventData);
	}
}
interiorAngles.reset = function(){	
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
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
interiorAngles.reset();
