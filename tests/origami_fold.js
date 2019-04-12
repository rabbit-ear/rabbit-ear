let origamiFold = RabbitEar.Origami("canvas-origami-fold");
origamiFold.setViewBox(-0.1, -0.1, 1.2, 1.2);
origamiFold.preferences.autofit = false;
origamiFold.lastStep = RabbitEar.CreasePattern(JSON.parse(JSON.stringify(RabbitEar.bases.square)));
origamiFold.foldCP = RabbitEar.CreasePattern(JSON.parse(JSON.stringify(RabbitEar.bases.square)));

origamiFold.fold();

origamiFold.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		origamiFold.foldCP = RabbitEar.CreasePattern(origamiFold.lastStep);
		let points = [
			RabbitEar.math.Vector(mouse.pressed),
			RabbitEar.math.Vector(mouse.position)
		];
		let midpoint = points[0].midpoint(points[1]);
		let vector = points[1].subtract(points[0]);

		origamiFold.foldCP.valleyFold(midpoint, vector.rotateZ90());
	}
	origamiFold.cp = RabbitEar.CreasePattern(origamiFold.foldCP.getFOLD());
	origamiFold.fold();
}

origamiFold.onMouseUp = function(mouse) {
	origamiFold.lastStep =  RabbitEar.CreasePattern(JSON.parse(JSON.stringify(origamiFold.foldCP)));
}

origamiFold.bootFold = function() {
	origamiFold.foldCP = RabbitEar.CreasePattern(origamiFold.lastStep);
	let points = [
		RabbitEar.math.Vector(1, 0),
		RabbitEar.math.Vector(0.7 - Math.random()*0.3, 0.2 + Math.random()*0.45)
	];
	let midpoint = points[0].midpoint(points[1]);
	let vector = points[1].subtract(points[0]);

	origamiFold.foldCP.valleyFold(midpoint, vector.rotateZ90());
	origamiFold.cp = RabbitEar.CreasePattern(origamiFold.foldCP.getFOLD());
	origamiFold.fold();
	origamiFold.lastStep =  RabbitEar.CreasePattern(JSON.parse(JSON.stringify(origamiFold.foldCP)));

}
origamiFold.bootFold();