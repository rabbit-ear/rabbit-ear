let circlePack;
let cirPPad = 6;
circlePack = RabbitEar.svg.image("canvas-circle-packing", 500, 500, function(){
	if (circlePack !== undefined) {
		circlePack.setViewBox(-cirPPad,-cirPPad,500+2*cirPPad,500+2*cirPPad);
	}
});
circlePack.setViewBox(-cirPPad,-cirPPad,500+2*cirPPad,500+2*cirPPad);

let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
circlePack.appendChild(defs);
let clipPath = 
	document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
defs.appendChild(clipPath);
clipPath.setAttribute("id", "page-clip");
let clipRect = RabbitEar.svg.rect(0, 0, 500, 500);
clipPath.appendChild(clipRect);

circlePack.circleLayer = circlePack.group();
let r = circlePack.rect(0, 0, circlePack.w, circlePack.h);
r.setAttribute("fill", "none");
r.setAttribute("stroke-width", 6);
r.setAttribute("stroke", "black");

circlePack.drawLayer = circlePack.group();

circlePack.circles = Array.from(Array(12))
	.map(_ => re.circle(0, 0, 0));
circlePack.circles
	.forEach(c => c.svg = circlePack.circleLayer.circle(0, 0, 0));

circlePack.theAnimatefunc = function(event) {
	if (circlePack.mouse.isPressed) {
		// circlePack.circles.forEach(c => c.radius *= 1.002);
	}
	let result = circlePack.analyze();
	let mag = result.magnitude;
	let stillCount = result.stillCount;
	let frameDiff = mag - circlePack.readings[event.frame%2];
	// if (Math.abs(frameDiff) < .02 && stillCount < 2) {
	if (Math.abs(frameDiff) < .05 && stillCount < 2) {
		circlePack.frozenCount++;
	}
	if (circlePack.frozenCount > 40) {
		circlePack.animate = undefined;
	}
	// console.log(circlePack.frozenCount, frameDiff);
	circlePack.readings[event.frame%2] = mag;
	if (mag > -50) {
		circlePack.circles.forEach(c => c.radius *= 1.003);//1.002);
	}
	else {
		circlePack.circles.forEach(c => c.radius *= 0.997);//0.998);
	}
	circlePack.update();
	// console.log(mag);
	// circlePack.increment();
}

circlePack.boot = function() {
	circlePack.circles.forEach(c => {
		c.origin[0] = Math.random()*circlePack.w; 
		c.origin[1] = Math.random()*circlePack.h;
		c.radius = 6 + Math.random()*60;
	})

	circlePack.circles.forEach(c => c.svg.setAttribute("fill", "#224c72"));
	circlePack.circles.forEach(c => c.svg.setAttribute("style", "clip-path: url(#page-clip)"));
	circlePack.readings = []
	circlePack.frozenCount = 0;
	circlePack.animate = circlePack.theAnimatefunc;

}
circlePack.boot();

circlePack.analyze = function() {
	let matrix = Array.from(Array(12)).map(_ => []);
	for (let i = 0; i < 12-1; i++) {
		for (let j = i+1; j < 12; j++) {
			matrix[i][j] = Math.sqrt(
				Math.pow(circlePack.circles[i].origin[0]-circlePack.circles[j].origin[0], 2) + 
				Math.pow(circlePack.circles[i].origin[1]-circlePack.circles[j].origin[1], 2)
			) - (circlePack.circles[i].radius + circlePack.circles[j].radius);
		}
	}

	circlePack.drawLayer.removeChildren();


	circlePack.vectors = Array.from(Array(12)).map(_ => re.vector(0,0));
	let pos_neg = [0,0];
	let global_negative = 0;
	for (let i = 0; i < 12; i++) {
		for (let v = 0; v < 12; v++) {
			let vec = [0,0];
			let d = matrix[v][i] || matrix[i][v];
			if (d != null) {
				if (d < 0) {
					global_negative += d;
				}
				pos_neg[((d < 0) ? 0 : 1)]++;
				let amp = (d < 0)
					? d * 0.001
					: d * 0;//0.000001;
				vec = [
					(circlePack.circles[i].origin[0] - circlePack.circles[v].origin[0]),
					(circlePack.circles[i].origin[1] - circlePack.circles[v].origin[1])
				];
				vec[0] *= amp;
				vec[1] *= amp;
			}
			circlePack.vectors[v][0] += vec[0];
			circlePack.vectors[v][1] += vec[1];
			circlePack.vectors[i][0] -= vec[0];
			circlePack.vectors[i][1] -= vec[1];
		}
	}
	// let moving = circlePack.vectors.map(a => a[0] !== 0 || a[1] !== 0);
	let stillCount = circlePack.vectors
		.map(a => a[0] === 0 && a[1] === 0)
		.map(a => a === true ? 1 : 0)
		.reduce((a,b) => a+b, 0);

	// console.log(stillCount);

	// console.log(global_negative);


	circlePack.circles.forEach((c,i) => {
		c.origin[0] += circlePack.vectors[i][0];
		c.origin[1] += circlePack.vectors[i][1];
	});

	circlePack.circles.forEach((c,i) => {
		if (c.origin[0] < 0 ) { c.origin[0] = 0; }
		if (c.origin[1] < 0 ) { c.origin[1] = 0; }
		if (c.origin[0] > circlePack.w ) { c.origin[0] = circlePack.w; }
		if (c.origin[1] > circlePack.h ) { c.origin[1] = circlePack.h; }
	});


	for (let i = 0; i < 12; i++) {
		for (let v = 0; v < 12; v++) {
			let d = matrix[v][i] || matrix[i][v];
			if (d != null && d < 5) {
				let opacity = (d-5)/5;
				if (opacity < 0) { opacity = 0; }
				let stroke_width = 3 - 3 * Math.pow(((d-5)/5),1);
				if (stroke_width < 0) { stroke_width = 0;}
				let l = circlePack.drawLayer.line(
					circlePack.circles[v].origin[0],
					circlePack.circles[v].origin[1],
					circlePack.circles[i].origin[0],
					circlePack.circles[i].origin[1]
				);
				l.setAttribute("stroke", "#ecb233");//e14929");
				l.setAttribute("stroke-width", stroke_width);
				l.setAttribute("stroke-linecap", "round");
				// l.setAttribute("opacity", opacity);
			}
		}
	}

	return {magnitude: global_negative, stillCount};
}

circlePack.onMouseDown = function(mouse) {
	circlePack.boot();
}

circlePack.increment = function() {
	circlePack.circles.forEach(c => c.radius += 1);
	circlePack.update();
}
circlePack.decrement = function() {
	circlePack.circles.forEach(c => c.radius -= 1);
	circlePack.update();
}

circlePack.update = function() {
	circlePack.circles.forEach(c => c.svg.setAttribute("cx", c.origin[0]));
	circlePack.circles.forEach(c => c.svg.setAttribute("cy", c.origin[1]));
	circlePack.circles.forEach(c => c.svg.setAttribute("r", c.radius));
}