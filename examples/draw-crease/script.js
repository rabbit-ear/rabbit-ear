var div = document.getElementsByClassName('row')[0];

var cp = RabbitEar.bases.fish;

var origami = RabbitEar.Origami(div, cp);
var folded = RabbitEar.Origami(div, cp);

// folded.cp = folded.flattenFrame(origami.cp, 1);
// console.log(folded.cp);
folded.setFrame(1);
// folded.draw();

origami.drawLayer = origami.paint.group(null, "marks");
origami.svg.appendChild(origami.drawLayer);

folded.drawLayer = folded.paint.group(null, "marks");
folded.svg.appendChild(folded.drawLayer);


origami.event.onMouseMove = function(event){
	RabbitEar.removeChildren(origami.drawLayer);
	// origami.paint.circle(event.position.x, event.position.y, 0.02, "node", null, origami.drawLayer);
	if(origami.mouse.isPressed){
		// origami.math.
		var line = {
			point: origami.mouse.pressed,
			direction: origami.mouse.drag
		};
		let fishClone = RabbitEar.fold.clone(RabbitEar.bases.fish);
		// let result = RabbitEar.fold.clip_edges_with_line(fishClone, line.point, line.direction);
		let result = RabbitEar.fold.crease_through_layers(fishClone, line.point, line.direction);
		// let foldedResult = RabbitEar.fold.flattenFrame(result, 0);//result.file_frames.length);
		folded.draw(result);
		// origami.draw(result);
	}
	// origami.draw(origami.cp);
}


folded.event.onMouseMove = function(event){
	RabbitEar.removeChildren(folded.drawLayer);
	// folded.paint.circle(event.position.x, event.position.y, 0.02, "node", null, folded.drawLayer);
	if(folded.mouse.isPressed){
		// folded.math.
		var line = {
			point: folded.mouse.pressed,
			direction: folded.mouse.drag
		};
		let fishClone = RabbitEar.fold.clone(RabbitEar.bases.fish);
		// let result = RabbitEar.fold.clip_edges_with_line(fishClone, line.point, line.direction);
		let result = RabbitEar.fold.crease_through_layers(fishClone, line.point, line.direction);
		let foldedResult = RabbitEar.fold.flattenFrame(result, 0);//result.file_frames.length);
		folded.draw(foldedResult);
		// folded.draw(result);
	}
	// folded.draw(origami.cp);
}
