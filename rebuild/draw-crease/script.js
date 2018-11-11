var div = document.getElementsByClassName('row')[0];

var cp = RabbitEar.bases.test;

var folded = RabbitEar.View(div, cp);
var origami = RabbitEar.View(div, cp);

folded.setFrame(1);

origami.onMouseMove = function(mouse){

	if(mouse.isPressed){

		var line = {
			point: mouse.pressed,
			direction: mouse.drag
		};

		let cpClone = RabbitEar.fold.clone(cp);
		let result = RabbitEar.fold.crease_through_layers(cpClone, line.point, line.direction);


		// console.log(result);
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

