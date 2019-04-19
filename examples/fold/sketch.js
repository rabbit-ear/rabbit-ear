let origami = RabbitEar.Origami({folding:true});
origami.folded = true;
let cpView = RabbitEar.Origami(document.querySelectorAll('.corner')[0]);

origami.setViewBox(-0.1, -0.1, 1.2, 1.2);
cpView.setViewBox(-0.1, -0.1, 1.2, 1.2);
origami.preferences.autofit = false;
cpView.preferences.autofit = false;

origami.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		cpView.cp = RabbitEar.CreasePattern(origami.cp.json);
		cpView.folded = false;
		cpView.cp.frame = 0;
	}
}

cpView.onMouseUp = function(mouse) {
	origami.cp = RabbitEar.CreasePattern(RabbitEar.bases.square);
	cpView.cp = RabbitEar.CreasePattern(RabbitEar.bases.square);
	origami.folded = true;
	cpView.folded = false;
}