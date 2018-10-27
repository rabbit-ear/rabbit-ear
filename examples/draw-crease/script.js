var div = document.getElementsByClassName('row')[0];

var cp = RabbitEar.bases.fish;

var folded = RabbitEar.Origami(div, cp);
var origami = RabbitEar.Origami(div, cp);

// folded.cp = folded.flattenFrame(origami.cp, 1);
// console.log(folded.cp);
folded.setFrame(1);
// folded.draw();

origami.drawLayer = origami.paint.group(null, "marks");
origami.svg.appendChild(origami.drawLayer);

origami.event.onMouseMove = function(event){
	RabbitEar.removeChildren(origami.drawLayer);
	// origami.paint.circle(event.position.x, event.position.y, 0.02, "node", null, origami.drawLayer);
	if(origami.mouse.isPressed){
		// origami.math.
		var line = {
			point: origami.mouse.pressed,
			direction: origami.mouse.drag
		};
		// origami.cp = RabbitEar.fold.crease_through_layers(origami.cp, line);
		let newcp = RabbitEar.fold.clone(RabbitEar.bases.fish);
		let result = RabbitEar.fold.clip_edges_with_line(newcp, line.point, line.direction);
		// console.log("--------------");
		// console.log(newcp);
		// console.log(newCP);

		// origami.paint.line(origami.mouse.pressed[0],
		//                    origami.mouse.pressed[1],
		//                    event.position.x,
		//                    event.position.y,
		//                    "valley", 
		//                    null, 
		//                    origami.drawLayer);
		origami.draw(newcp);
	}
	// origami.draw(origami.cp);
}
origami.event.onMouseDown = function(event){ }
origami.event.onMouseUp = function(){ }
