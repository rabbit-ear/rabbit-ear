let foldingRow = document.querySelectorAll('.row')[0];
let sequenceDiv = document.querySelector('#folding-sequence');
let origami = RabbitEar.Origami(foldingRow);
let folded = RabbitEar.Origami(foldingRow);
origami.setViewBox(-0.1, -0.1, 1.2, 1.2);
folded.setViewBox(-0.1, -0.1, 1.2, 1.2);
folded.preferences.autofit = false;
origami.preferences.autofit = false;
folded.fold();

let editMode = true;

let lastStep = JSON.parse(JSON.stringify(RabbitEar.bases.square));
folded.dotLayer = folded.group();

origami.onMouseUp = function(mouse) {
	lastStep = JSON.parse(JSON.stringify(RabbitEar.bases.square));
	origami.cp = RabbitEar.CreasePattern(lastStep);
	folded.cp = RabbitEar.CreasePattern(lastStep);
	folded.fold();
}

folded.stepNumber = 0;

folded.onMouseMove = function(mouse) {
	folded.dotLayer.removeChildren();
	// let c = folded.dotLayer.circle(mouse.x, mouse.y, 0.02);
	// c.setAttribute("fill", "red");
	// c.setAttribute("pointer-events", "none");
	if (mouse.isPressed) {
		origami.cp = RabbitEar.CreasePattern(lastStep);

		let points = [
			RabbitEar.math.Vector(mouse.pressed),
			RabbitEar.math.Vector(mouse.position)
		];
		let midpoint = points[0].midpoint(points[1]);
		let vector = points[1].subtract(points[0]);

		origami.cp.valleyFold(midpoint, vector.rotateZ90());
	}
	folded.cp = RabbitEar.CreasePattern(origami.cp.json);
	folded.fold();
}

folded.onMouseUp = function(mouse) {
	lastStep = JSON.parse(JSON.stringify(origami.cp));
	// folded.updateViewBox();
	folded.stepNumber++;
	let numberDiv = document.querySelectorAll(".top-corner")[0];
	numberDiv.innerHTML = folded.stepNumber;
	numberDiv.style.display = "block";
}

function fillSequence() {
	var container = document.getElementById("folding-sequence");
	var prevCP, STEPS = 5;
	while(sequenceDiv.children.length > 0) {
		sequenceDiv.children[0].remove();
	}

	for(var i = 0; i < STEPS; i++){
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
		lineHeader.innerHTML = (i+1);
		sequenceDiv.appendChild(lineHeader);
		var row = document.createElement("div");
		row.className = "row";
		sequenceDiv.appendChild(row)

		// new svgs, fill them with the crease pattern
		var origami = RabbitEar.Origami(row, cp);
		var fold = RabbitEar.Origami(row, cp);

		let notMoving = cp["re:faces_to_move"].indexOf(false) !== -1
			? cp["re:faces_to_move"].indexOf(false) : 0;
		fold.fold(notMoving);

		prevCP = cp;
	}

}

document.querySelectorAll(".top-corner")[0].onclick = function(event) {
	console.log(event);
	editMode = !editMode;
	if (editMode) {
		event.target.innerHTML = folded.stepNumber;
		foldingRow.style.display = "block";
		sequenceDiv.style.display = "none";
	} else {
		event.target.innerHTML = "back";
		foldingRow.style.display = "none";
		sequenceDiv.style.display = "block";
		fillSequence();
	}
}
