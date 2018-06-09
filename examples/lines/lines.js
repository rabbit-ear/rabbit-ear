var project = new OrigamiPaper("canvas");

project.style.mountain.strokeColor = {gray:0.0};

project.clearCP = function(){
	this.cp.clear();
}

project.redraw = function(){
	this.clearCP();
	for(var i = 0; i < this.touchPoints.length; i += 2){
		var center = this.touchPoints[i].position;
		var dir = this.touchPoints[i+1].position;
		var vec = {x: dir.x-center.x,y: dir.y-center.y};
		var line = new Line(center, vec);
		this.cp.creaseAndReflect(line).forEach(function(crease){crease.mountain();},this);

	}
	this.draw();
}

project.onMouseDown = function(event){
	if(this.selected == undefined){
		var pointColors = [this.styles.byrne.blue, this.styles.byrne.yellow];
		var touchPoints = [event.point, {x:event.point.x, y:Math.abs(event.point.y - 0.1)}].map(function(point, i){
			return this.makeTouchPoint(point, {strokeColor:pointColors[i]});
		},this);
		this.selected = touchPoints[0];
	}
}

project.onMouseMove = function(event){
	this.redraw();
}