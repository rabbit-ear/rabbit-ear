var div = document.getElementsByClassName('row')[0];

var cp = RabbitEar.bases.fish;

var origami = RabbitEar.View(div, cp);
var folded = RabbitEar.View(div, cp);

// folded.cp = folded.flattenFrame(origami.cp, 1);
// console.log(folded.cp);
folded.setFrame(1);
// folded.draw();

let origamiDrawLayer = RabbitEar.svg.group(null, "marks");
origami.svg.appendChild(origamiDrawLayer);

let foldedDrawLayer = RabbitEar.svg.group(null, "marks");
folded.svg.appendChild(foldedDrawLayer);


origami.onMouseMove = function(event){
	RabbitEar.removeChildren(origamiDrawLayer);
	// origami.paint.circle(event.position.x, event.position.y, 0.02, "node", null, origamiDrawLayer);
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


folded.onMouseMove = function(event){
	RabbitEar.removeChildren(foldedDrawLayer);
	// folded.paint.circle(event.position.x, event.position.y, 0.02, "node", null, foldedDrawLayer);
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

