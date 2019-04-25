let origamiFold = RabbitEar.Origami("canvas-origami-fold");
origamiFold.setViewBox(-0.1, -0.1, 1.2, 1.2);
origamiFold.preferences.autofit = false;
origamiFold.preferences.folding = true;
origamiFold.fold();

let origamiCP = RabbitEar.Origami("canvas-origami-cp");
origamiCP.setViewBox(-0.1, -0.1, 1.2, 1.2);
origamiCP.preferences.autofit = false;

origamiFold.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		origamiCP.cp = origamiFold.cp.copy();
	}
}