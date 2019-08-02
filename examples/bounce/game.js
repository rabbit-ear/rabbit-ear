const Game = function() {
	let _this = {};

	let origami = RabbitEar.Origami({folding:true, padding:0.1, autofit:false});
	origami.drawLayer = origami.group();
	var ball = Ball();

	origami.ballCircle = RabbitEar.svg.circle(0,0,0.02);
	origami.appendChild(origami.ballCircle);

	origami.animate = function(event) {
		let boundary = origami.boundary;
		ball.update(boundary);

		// origami.drawLayer.removeChildren();
		// let edgePoints = boundary.edges
		// 	.map(edge => edge.nearestPoint(ball.position.x, ball.position.y));
		// edgePoints.forEach(p => origami.drawLayer.circle(p[0], p[1], 0.02));

		origami.ballCircle.setAttribute("cx", ball.position.x);
		origami.ballCircle.setAttribute("cy", ball.position.y);


	return _this;
}

