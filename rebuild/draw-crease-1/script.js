var div = document.getElementsByClassName('row')[0];

var testCP = RabbitEar.fold.clone(RabbitEar.bases.test);

var folded = RabbitEar.View(div, testCP);
var origami = RabbitEar.View(div, testCP);

let origamiDrawLayer = RabbitEar.svg.group(null, "marks");
origami.svg.appendChild(origamiDrawLayer);

let foldedDrawLayer = RabbitEar.svg.group(null, "marks");
folded.svg.appendChild(foldedDrawLayer);
folded.setFrame(1);

origami.onMouseMove = function(mouse){
	RabbitEar.svg.removeChildren(origamiDrawLayer);
	RabbitEar.svg.circle(mouse.x, mouse.y, 0.01, "node", null, origamiDrawLayer);
	if(mouse.isPressed){
		var line = { point: mouse.pressed, direction: mouse.drag };
		RabbitEar.svg.circle(mouse.pressed.x, mouse.pressed.y, 0.01, "node", null, origamiDrawLayer);
		let cpClone = RabbitEar.fold.clone(origami.cp);
		let folded_frame = RabbitEar.fold.make_folded_frame(cpClone, 0, 1);

		cpClone.file_frames = [folded_frame];
		folded.cp = cpClone;
	}
}
