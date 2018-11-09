var div = document.getElementsByClassName('row')[0];

var cp = RabbitEar.bases.test;

var folded = RabbitEar.View(div, cp);
var origami = RabbitEar.View(div, cp);

// folded.cp = folded.flattenFrame(origami.cp, 1);
// console.log(folded.cp);
folded.setFrame(1);

let origamiDrawLayer = RabbitEar.svg.group(null, "marks");
origami.svg.appendChild(origamiDrawLayer);

let foldedDrawLayer = RabbitEar.svg.group(null, "marks");
folded.svg.appendChild(foldedDrawLayer);


origami.onMouseMove = function(mouse){
	RabbitEar.svg.removeChildren(origamiDrawLayer);
	// RabbitEar.svg.circle(mouse.x, mouse.y, 0.01, "node", null, origamiDrawLayer);

	if(mouse.isPressed){

		// RabbitEar.svg.circle(mouse.pressed.x, mouse.pressed.y, 0.01, "node", null, origamiDrawLayer);

		var line = {
			point: mouse.pressed,
			direction: mouse.drag
		};

		let fishClone = RabbitEar.fold.clone(RabbitEar.bases.test);
		// let migration = RabbitEar.fold.clip_edges_with_line(fishClone, line.point, line.direction);
		// console.log(migration);
		// origami.cp = fishClone;
		// folded.cp = fishClone;

		let result = RabbitEar.fold.crease_through_layers(fishClone, line.point, line.direction);
		origami.cp = result;
		folded.cp = result;

	}
}


// folded.onMouseMove = function(mouse){
// 	RabbitEar.svg.removeChildren(foldedDrawLayer);
// 	// folded.paint.circle(event.position.x, event.position.y, 0.02, "node", null, foldedDrawLayer);
// 	if(mouse.isPressed){
// 		// folded.math.
// 		var line = {
// 			point: mouse.pressed,
// 			direction: mouse.drag
// 		};
// 		let fishClone = RabbitEar.fold.clone(RabbitEar.bases.fish);
// 		// let result = RabbitEar.fold.clip_edges_with_line(fishClone, line.point, line.direction);
// 		let result = RabbitEar.fold.crease_through_layers(fishClone, line.point, line.direction);
// 		let foldedResult = RabbitEar.fold.flattenFrame(result, 0);//result.file_frames.length);
// 		folded.cp = foldedResult;
// 		folded.draw();
// 		// folded.draw(result);
// 	}
// 	// folded.draw(origami.cp);
// }

