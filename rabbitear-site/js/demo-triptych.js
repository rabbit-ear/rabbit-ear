new OrigamiPaper("canvas-one");

var cp = new CreasePattern();
cp.pleat(3, cp.edges[0], cp.edges[1]).forEach(function(crease,i){ 
	if(i%2){ crease.valley(); }
	else { crease.mountain(); }
})

var origami2 = new OrigamiPaper("canvas-two", cp.copy());

origami2.cp.creaseAndReflect(new Ray(1, 1, -1, -1))
	.filter(function(crease){return crease != undefined;})
	.forEach(function(crease,i){
		if(i%2){ crease.valley(); }
		else { crease.mountain(); }
	},this);
origami2.draw();

var origami3 = new OrigamiFold("canvas-three", origami2.cp);
origami3.style.face.fillColor = {gray:1.0, alpha:0.5};
origami3.draw();

origami2.onMouseMove = function(event){
	this.cp = cp.copy();
	var ray = new Ray(1, 1, -1, -1)
	if(event.point){
		var direction = {x:event.point.x - 1, y:event.point.y - 1};
		if(direction.x && direction.y){
			ray.direction.x = direction.x;
			ray.direction.y = direction.y
		}
		document.getElementById("ray-numbers").innerHTML = "<n>" + direction.x.toFixed(2) + "</n>,<n>" + direction.y.toFixed(2) + "</n>"
	}
	origami2.cp.creaseAndReflect(ray)
		.filter(function(crease){return crease != undefined;})
		.forEach(function(crease,i){
			if(i%2){ crease.valley(); }
			else { crease.mountain(); }
		},this);
	origami2.draw();
	origami3.cp = origami2.cp;
	origami3.draw();
}
