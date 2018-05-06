var project = new OrigamiPaper("canvas");
project.updateWeights(0.002, 0.001);
project.cp.rectangle(1,0.5);


var mouseVector = {x:1.0, y:0.0};

var lastMousePosition = undefined;

var count = 150;
for(var i = 0; i < count; i++){
	var angle = Math.PI*i/count;
	var topCenter = {x:0.5, y:0.0};
	var v = {x:topCenter.x + Math.cos(angle), y:topCenter.y + Math.sin(angle)};
	project.cp.creaseThroughPoints(topCenter, v);
}

resetCP = project.cp.copy();

project.draw();

project.onFrame = function(event){
	mouseVector = {x:Math.cos(event.time), y:Math.sin(event.time)};
	if(lastMousePosition !== undefined && resetCP !== undefined && this.cp.contains(lastMousePosition)){
		this.cp = resetCP.copy();
		var creases = this.cp.creaseRayRepeat(new XY(lastMousePosition.x, lastMousePosition.y), mouseVector);
		creases.forEach(function(el){ if(el !== undefined) el.valley(); })
		// this.cp.clean();
		this.draw();
	} else{
		// this.draw();
	}
}

project.onMouseMove = function(event){
	lastMousePosition = event.point;
	// console.log(event.point);
	// if(resetCP !== undefined && this.cp.contains(event.point)){
	// 	this.cp = resetCP.copy();
	// 	var creases = this.cp.creaseRayRepeat(new XY(event.point.x, event.point.y), mouseVector);
	// 	creases.forEach(function(el){ if(el !== undefined) el.valley(); })
	// 	// this.cp.clean();
	// 	this.draw();
	// } else{
	// 	this.cp = refCP
	// 	this.draw();
	// }
}

