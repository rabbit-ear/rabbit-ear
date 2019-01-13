
var div = document.getElementsByClassName('row')[0];
var canvas1 = RabbitEar.View(div, RabbitEar.bases.frog);
let unfolded = canvas1.cp;

for(var i = 0; i < 100; i++){
	let folded_frame = RabbitEar.fold.make_folded_frame(unfolded, 0, 1);
	unfolded.file_frames = [folded_frame];
	var folded = RabbitEar.fold.flatten_frame(unfolded, 1);

	let unfolded_frame = RabbitEar.fold.make_unfolded_frame(folded, 0, 1);
	folded.file_frames = [unfolded_frame];
	unfolded = RabbitEar.fold.flatten_frame(folded, 1);
}

var canvas2 = RabbitEar.View(div, unfolded);

console.log(canvas1.cp.vertices_coords);
console.log(canvas2.cp.vertices_coords);
