let origamiFold = RabbitEar.origami("canvas-origami-fold", {padding:0.1});
// origamiFold.setViewBox(-0.1, -0.1, 1.2, 1.2);
origamiFold.preferences.autofit = false;
origamiFold.preferences.folding = true;
origamiFold.fold();

let origamiCP = RabbitEar.origami("canvas-origami-cp", {padding:0.1});
// origamiCP.setViewBox(-0.1, -0.1, 1.2, 1.2);
origamiCP.preferences.autofit = false;

origamiFold.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		origamiCP.cp = origamiFold.cp.copy();
		origamiCP.setViewBox(-0.1, -0.1, 1.2, 1.2);
	}
}