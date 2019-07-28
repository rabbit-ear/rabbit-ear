const Ball = function() {
	let _this = {};
	_this.position = RabbitEar.Vector(Math.random(), Math.random());
	let vMag = 0.02;
	_this.velocity = {
		x: Math.random()*vMag - vMag/2,
		y: Math.random()*vMag - vMag/2};
	_this.update = function(boundary) {
		_this.position = _this.position.add(_this.velocity);
		// boundary check
		if (!boundary.contains(_this.position.x, _this.position.y)) {
			let nearest = boundary.nearest(_this.position);
			let beyondVec = _this.position.subtract(nearest.point);
			let matrix = nearest.edge.reflection();
			matrix.m[4] = 0;
			matrix.m[5] = 0;
			_this.velocity = matrix.transform(_this.velocity);
			_this.position = nearest.point;
			_this.velocity.x += beyondVec.x*2;
			_this.velocity.y += beyondVec.y*2;
			_this.position.x += _this.velocity.x;
			_this.position.y += _this.velocity.y;
			// let dampen = beyondVec.scale(0.5);
			// console.log(beyondVec);
			// let mag1 = _this.velocity.magnitude;
			// let mag2 = beyondVec.magnitude;
			// console.log(mag1, mag2);
		}
	}
	_this.draw = function() {
		ellipse(_this.position.x, _this.position.y, 2);
	}
	return _this;
}
