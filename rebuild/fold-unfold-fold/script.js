var div = document.getElementsByClassName('row')[0];

var canvas1 = RabbitEar.View(div, RabbitEar.bases.test);

let cp2 = RabbitEar.fold.clone(canvas1.cp);
let folded_frame = RabbitEar.fold.make_folded_frame(cp2, 0, 1);
cp2.file_frames = [folded_frame];
var newCP2 = RabbitEar.fold.flatten_frame(cp2, 1);
var canvas2 = RabbitEar.View(div, newCP2);
// canvas2.setFrame(1);


let cp3 = RabbitEar.fold.clone(canvas2.cp);
let unfolded_frame = RabbitEar.fold.make_unfolded_frame(cp3, 0, 1);
cp3.file_frames = [unfolded_frame];
var newCP3 = RabbitEar.fold.flatten_frame(cp3, 1);
var canvas3 = RabbitEar.View(div, newCP3);

