const RE = RabbitEar;

let Spiral = function() {

	let container = document.querySelector("#container");

	let origami = RabbitEar.Origami(container);
	let folded = RabbitEar.Origami(container);

	const pleatPage = function(cp, angle, pleatCount, crease_direction) {
		let creases = [];
		let vec = RE.math.Vector(Math.cos(angle), Math.sin(angle));
		for (var i = pleatCount-1; i >= 0; i--) {
			let point = RE.math.Vector(i/pleatCount, 0);
			creases.push(cp.axiom1(point, point.add(vec)));
			if (crease_direction === "M") { creases[creases.length-1].mountain(); }
			if (crease_direction === "V") { creases[creases.length-1].valley(); }
		}
		let rise = (vec.y / vec.x) / pleatCount;
		let verticalTimes = Math.ceil(1 / rise);
		for(var i = 1; i < verticalTimes; i++) {
			let point = RE.math.Vector(0, i*rise);
			creases.push(cp.axiom1(point, point.add(vec)));
			if (crease_direction === "M") { creases[creases.length-1].mountain(); }
			if (crease_direction === "V") { creases[creases.length-1].valley(); }
		}
		return creases;
	}

	const rebuild = function() {
		origami.cp = RE.CreasePattern();
		let angle2 = this.angle * (1.0 - this.innerAngle);
		let vecA = RE.math.Vector(Math.cos(this.angle), Math.sin(this.angle));
		let vecB = RE.math.Vector(Math.cos(angle2), Math.sin(angle2));
		let sides = 8;
		pleatPage(origami.cp, this.angle, sides, "M");
		pleatPage(origami.cp, angle2, sides, "V");
		let yintersect = RE.math.Ray(0, 0, vecB.x, vecB.y).intersect(RE.math.Ray(1/sides, 0, vecA.x, vecA.y));
		if (yintersect != null) {
			let horizPleatCount = Math.ceil(1/yintersect[1]);
			for(var i = 0; i < horizPleatCount; i++) {
				origami.cp.axiom1(0, yintersect[1]*i, 1, yintersect[1]*i).mountain();
			}
		}

		let faces = origami.cp.faces;
		let faces_layer = faces
			.map((f,i) => ({center:f.centroid, i:i}))
			.sort((a,b) => {
				if(Math.abs(a.center[1] - b.center[1]) < 0.01){
					return b.center[0] - a.center[0];
				}
				return a.center[1] - b.center[1];
			}).map((el,i) => ({sorted: i, i: el.i}))
			.sort((a,b) => a.i - b.i)
			.map(el => el.sorted);
		origami.cp["re:faces_layer"] = faces_layer;

		let topLeftFace = origami.nearest(1/sides/2, 0.01).face.index;
		origami.cp["re:faces_coloring"] = RabbitEar.fold.graph.faces_coloring(origami.cp, topLeftFace);
		folded.cp = origami.cp;
		folded.fold(topLeftFace);
	}

	return {
		rebuild,
		angle: Math.PI/4,
		innerAngle: 0.5,  // between 0 and 1
	};
}

let spiral = Spiral();
spiral.rebuild();

document.querySelector("#slider1").oninput = function(event) {
	let val = parseFloat(event.target.value) / 1000.0;
	spiral.angle = Math.PI/2 - Math.PI/2*val;
	spiral.rebuild();
}

document.querySelector("#slider2").oninput = function(event) {
	let val = parseFloat(event.target.value) / 1000.0;
	if(val <= 0) { val = 0.01; }
	if(val >= 1) { val = 0.99; }
	spiral.innerAngle = val;
	spiral.rebuild();
}

// let count = 0;
// setInterval(function(){
// 	count += 1;
// 	let wave = 0.201 - 0.2*Math.cos(count/100);
// 	spiral.innerAngle = wave;

// 	let wave2 = Math.PI/4 + 0.5*Math.sin(count/100);
// 	spiral.angle = wave2;

// 	spiral.rebuild();
// }, 20);

