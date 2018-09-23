var container = document.getElementById("folding-sequence");
var prevCP, STEPS = 5;

for(var i = 0; i < STEPS; i++){
	// grab the crease pattern from the previous step if it exists
	var cp = (prevCP != undefined) ? prevCP.copy() : new CreasePattern();
	
	// generate the geometry for a random crease line
	var origin = { x:Math.random(), y:Math.random() };
	var angle = Math.random()*Math.PI*2;
	var vecA = { x:Math.cos(angle), y:Math.sin(angle) };
	var vecB = { x:-vecA.x, y:-vecA.y };

	// crease origami paper
	cp.creaseAndReflect(origin, vecA).forEach(function(c){c.valley(); },this);
	cp.creaseAndReflect(origin, vecB).forEach(function(c){c.valley(); },this);
	cp.clean();

	// create html components
	var lineHeader = document.createElement("h2");
	lineHeader.innerHTML = (i+1) + ".";
	container.appendChild(lineHeader);
	var row = document.createElement("div");
	row.className = "row";
	container.appendChild(row)

	// new svgs, fill them with the crease pattern
	var origami = new OrigamiPaper(row, cp);
	var fold = new OrigamiFold(row, cp);
	prevCP = cp;
}
