var container = document.getElementById("folding-sequence");
var prevCP, STEPS = 5;

for(var i = 0; i < STEPS; i++){
	// grab the crease pattern from the previous step if it exists
	var cp = (prevCP != null) ? prevCP.copy() : RabbitEar.CreasePattern();
	
	// generate the geometry for a random crease line
	var origin = [Math.random(), Math.random()];
	var angle = Math.random()*Math.PI*2;
	var vecA = [Math.cos(angle), Math.sin(angle)];
	// var vecB = [-vecA.x, -vecA.y];

	// crease origami paper
	cp.creaseThroughLayers(origin, vecA);//.forEach((c) => c.valley());
	// cp.clean();

	// create html components
	var lineHeader = document.createElement("h2");
	lineHeader.innerHTML = (i+1) + ".";
	container.appendChild(lineHeader);
	var row = document.createElement("div");
	row.className = "row";
	container.appendChild(row)

	// new svgs, fill them with the crease pattern
	var origami = RabbitEar.Origami(row, cp);
	var fold = RabbitEar.Origami(row, cp);
	fold.fold();
	prevCP = cp;
}
