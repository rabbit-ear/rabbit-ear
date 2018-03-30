var miura = new OrigamiPaper("canvas");
miura.style.mountain.strokeWidth = 0.005;
miura.style.valley.strokeWidth = 0.005;
miura.style.mark.strokeWidth = 0.005;

// var param1 = 1.8424;
// var param2 = 0.4567;
// var param1 = 3.75323;
// var param2 = 0.46923;

// var param1 = 1.2808900671482248;
// var param2 = 0.44058841810836;
var param1 = 1.2665114844210112;
var param2 = 0.45592730740107135;

miura.reset = function(){
	this.cp.clear();
	// this.draw();
	var numBars = 12;
	var numZigzags = 8;
	var bounds = this.cp.bounds();
	for(var i = 1; i < numBars; i++){
		var step = bounds.size.width/numBars*i;
		this.cp.crease(step,0,step,bounds.size.height);
	}
	for(var i = 1; i < numZigzags; i+=2){
		var step = bounds.size.height/numZigzags*i;
		var angle = Math.sin(i/numZigzags*Math.PI*param1)*Math.PI*param2;
		var reflections = reflectRayRepeat(new Ray(new XY(0.0001,step), new XY(Math.cos(angle), Math.sin(angle))), this.cp.edges);
		reflections.forEach(function(el){
			if(i%2 == 0){ this.cp.crease(el).mountain(); }
			else        { this.cp.crease(el).valley(); }

		},this);
	}
	for(var i = 2; i < numZigzags; i+=2){
		var step = bounds.size.height/numZigzags*i;
		var angle = Math.sin(i/numZigzags*Math.PI*param1)*Math.PI*param2;
		var reflections = reflectRayRepeat(new Ray(new XY(0.0001,step), new XY(Math.cos(angle), Math.sin(angle))), this.cp.edges);
		reflections.forEach(function(el){
			if(i%2 == 0){ this.cp.crease(el).mountain(); }
			else        { this.cp.crease(el).valley(); }

		},this);
	}
	this.draw();
}
miura.reset();

miura.onFrame = function(event) { }
miura.onResize = function(event) { }
miura.onMouseDown = function(event){ }
miura.onMouseUp = function(event){ }
miura.onMouseMove = function(event) {
	param1 = event.point.x*10;
	param2 = event.point.y*2;
	console.log(param1, param2);
	this.reset();
}
