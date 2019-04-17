let origami = RabbitEar.Origami();
let cpView = RabbitEar.Origami(document.querySelectorAll('.corner')[0]);

origami.setViewBox(-0.1, -0.1, 1.2, 1.2);
cpView.setViewBox(-0.1, -0.1, 1.2, 1.2);
origami.preferences.autofit = false;
cpView.preferences.autofit = false;

origami.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		cpView.cp = RabbitEar.CreasePattern(origami.cp.getFOLD());
		cpView.cp.frame = 0;
	}
}
