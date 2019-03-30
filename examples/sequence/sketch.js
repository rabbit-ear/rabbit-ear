var container = document.getElementById("folding-sequence");
var prevCP, STEPS = 5;

for(var i = 0; i < STEPS; i++){
	console.log("============================ ROUND " + i);
	// grab the crease pattern from the previous step if it exists
	var cp = (prevCP != null) ? prevCP.copy() : RabbitEar.CreasePattern();
	
	// generate the geometry for a random crease line
	var point = [Math.random(), Math.random()];
	var angle = Math.random()*Math.PI*2;
	var vector = [Math.cos(angle), Math.sin(angle)];

	// crease origami paper
	cp.valleyFold(point, vector);

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

	let notMoving = cp["re:faces_to_move"].indexOf(false) !== -1
		? cp["re:faces_to_move"].indexOf(false) : 0;
	fold.fold(notMoving);

	prevCP = cp;
}
