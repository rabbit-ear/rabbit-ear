
let origami = RabbitEar.Origami("crease-pattern", {padding:0.1});
let folded = RabbitEar.Origami("folded", {padding:0.1, folding:true});

function fileDidLoad(blob, mimeType, fileExtension) {
	origami.load(blob, function(){
		folded.cp = origami.cp.copy();
		folded.cp.file_frames = [];
		folded.fold();
	});
}

folded.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		origami.cp = folded.cp.copy();
	}
}