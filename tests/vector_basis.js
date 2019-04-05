let basisVecSketchCallback;
let basisVec;

basisVec = RabbitEar.svg.image("canvas-vector-labels", window.innerWidth, window.innerHeight, function(){
	if (basisVec != null) {
		basisVec.setViewBox(-window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
		basisVec.reset();
		basisVec.update();
	}
});
basisVec.gridLayer = basisVec.group();
basisVec.drawLayer = basisVec.group();

basisVec.touches = RabbitEar.svg.controls(basisVec, 2, {radius: 12, fill: "#e44f2a"});

basisVec.reset = function(){
	for(let i = 0; i < 2; i++) {
		var angle = Math.random() * Math.PI * 2;
		basisVec.touches[i].position = [
			Math.cos(angle) * 220,
			Math.sin(angle) * 220
		];
	}
	basisVec.touches[0].position = [200, 0];
	basisVec.touches[1].position = [0, 200];

}
basisVec.recalc = function(){
	let center = [0, 0];
	// basisVec.vectors = basisVec.touches
	// 	.map(t => t.position.map((v,i) => v - center[i]))
	// 	.map(v => RabbitEar.math.Vector(v))
	basisVec.vectors = basisVec.touches
		.map(t => RabbitEar.math.Vector(t.position));
	basisVec.normalized = basisVec.vectors.map(v => v.normalize());
	basisVec.cross = basisVec.normalized[0].cross(basisVec.normalized[1]);
	basisVec.dot = basisVec.normalized[0].dot(basisVec.normalized[1]);
	console.log(basisVec.cross, basisVec.dot);
}
basisVec.redraw = function(){

	basisVec.gridLayer.removeChildren();

	let xBasis = basisVec.touches[0].position;
	let yBasis = basisVec.touches[1].position;
	let GRIDS = 4;
	for (let i = -4; i <= 4; i++) {
		basisVec.gridLayer.line(
			xBasis[0] * i - GRIDS*yBasis[0], xBasis[1] * i - GRIDS*yBasis[1],
			xBasis[0] * i + GRIDS*yBasis[0] , xBasis[1] * i + GRIDS*yBasis[1],
		).setAttribute("stroke", "#ccc");

		basisVec.gridLayer.line(
			yBasis[0] * i - GRIDS*xBasis[0], yBasis[1] * i - GRIDS*xBasis[1],
			yBasis[0] * i + GRIDS*xBasis[0] , yBasis[1] * i + GRIDS*xBasis[1],
		).setAttribute("stroke", "#ccc");
	}

	// basisVec.touches.forEach((p,i) => {
	// 	p.svg.setAttribute("cx", p.pos[0]);
	// 	p.svg.setAttribute("cy", p.pos[1]);
	// });

	basisVec.drawLayer.removeChildren();

	// rectangle
	let sum = basisVec.vectors[0].add(basisVec.vectors[1]);
	let poly = basisVec.drawLayer.polygon([
		[0,0],
		basisVec.vectors[0],
		sum,
		basisVec.vectors[1]
	]);
	if (basisVec.cross[2] > 0){
		poly.setAttribute("fill", "#ecb233");
	} else {
		poly.setAttribute("fill", "#e44f2a");
	}

	// dot product
	let dotLine = basisVec.drawLayer.line(0, 0, basisVec.dot[0], basisVec.dot[1]);
	dotLine.setAttribute("stroke", "#ecb233");
	dotLine.setAttribute("stroke-width", 8);
	dotLine.setAttribute("stroke-linecap", "round");

	// let dotXdash = RabbitEar.svg.line(basisVec.v.x, basisVec.v.y, basisVec.dotX, 0);
	// let dotYdash = RabbitEar.svg.line(basisVec.v.x, basisVec.v.y, 0, basisVec.dotY);
	// dotXdash.setAttribute("stroke", "#ecb233");
	// dotYdash.setAttribute("stroke", "#ecb233");
	// dotXdash.setAttribute("stroke-width", 8);
	// dotYdash.setAttribute("stroke-width", 8);
	// dotXdash.setAttribute("stroke-linecap", "round");
	// dotYdash.setAttribute("stroke-linecap", "round");
	// dotXdash.setAttribute("stroke-dasharray", "0.01 17");
	// dotYdash.setAttribute("stroke-dasharray", "0.01 17");
	// basisVec.drawLayer.appendChild(dotXdash);
	// basisVec.drawLayer.appendChild(dotYdash);	

	// cross product
	let crossLine = basisVec.drawLayer.line(0, 0, basisVec.cross[0], basisVec.cross[1]);
	crossLine.setAttribute("stroke", "#195783");
	crossLine.setAttribute("stroke-width", 8);
	crossLine.setAttribute("stroke-linecap", "round");
	crossLine.setAttribute("stroke-dasharray", "10 17");
	let crossDot = basisVec.drawLayer.circle(basisVec.cross[0], basisVec.cross[1], 8);
	crossDot.setAttribute("fill", "#195783");

	// let crossLen = basisVec.cross.magnitude;
	// let crossAngle = Math.atan2(basisVec.cross.y, basisVec.cross.x);
	// let crossA = 0, crossB = 0;
	// if (basisVec.cross.x > 0 && basisVec.cross.y > 0){ crossA = 0;  crossB = crossAngle; }
	// if (basisVec.cross.x > 0 && basisVec.cross.y < 0){ crossA = crossAngle;  crossB = 0; }
	// if (basisVec.cross.x < 0 && basisVec.cross.y > 0){ crossA = crossAngle;  crossB = Math.PI; }
	// if (basisVec.cross.x < 0 && basisVec.cross.y < 0){ crossA = Math.PI;  crossB = crossAngle; }

	// let crossArc1 = RabbitEar.svg.arc(0, 0, crossLen, crossA, crossB);
	// crossArc1.setAttribute("stroke", "#195783");
	// crossArc1.setAttribute("fill", "none");
	// crossArc1.setAttribute("stroke-width", 8);
	// crossArc1.setAttribute("stroke-linecap", "round");
	// crossArc1.setAttribute("stroke-dasharray", "0.01 17");
	// basisVec.drawLayer.appendChild(crossArc1);


	// let line = RabbitEar.svg.line(0, 0, basisVec.normalized.x, basisVec.normalized.y);
	// line.setAttribute("stroke", "#e44f2a");
	// line.setAttribute("stroke-width", 8);
	// line.setAttribute("stroke-linecap", "round");
	// basisVec.drawLayer.appendChild(line);

	// let normLen = basisVec.normalized.magnitude;
	// let normAngle = Math.atan2(basisVec.normalized.y, basisVec.normalized.x);
	// let nA = 0, nB = 0;
	// if (basisVec.normalized.x > 0 && basisVec.normalized.y > 0){ nA = 0;  nB = normAngle; }
	// if (basisVec.normalized.x > 0 && basisVec.normalized.y < 0){ nA = normAngle;  nB = 0; }
	// if (basisVec.normalized.x < 0 && basisVec.normalized.y > 0){ nA = normAngle;  nB = Math.PI; }
	// if (basisVec.normalized.x < 0 && basisVec.normalized.y < 0){ nA = Math.PI;  nB = normAngle; }

	// let normArc = RabbitEar.svg.arc(0, 0, normLen, nA, nB);
	// normArc.setAttribute("stroke", "#e44f2a");
	// normArc.setAttribute("fill", "none");
	// normArc.setAttribute("stroke-width", 8);
	// normArc.setAttribute("stroke-linecap", "round");
	// normArc.setAttribute("stroke-dasharray", "10 17");
	// basisVec.drawLayer.appendChild(normArc);

	if(basisVecSketchCallback != null){
		let readable = basisVec.touches[0].position.map(p => p / 200.0)
		basisVecSketchCallback({vector: readable});
	}
}

basisVec.update = function(){
	basisVec.recalc();
	basisVec.redraw();
}

basisVec.onMouseDown = function(mouse){
	basisVec.selected = 0;
};

basisVec.onMouseMove = function(mouse){
	// console.log(mouse);
	// if(mouse.isPressed && basisVec.selected != null){
	// 	basisVec.touches[basisVec.selected].pos = mouse.position;
	// 	basisVec.update();
	// }
	if (mouse.isPressed) {
		basisVec.update();
	}
};

basisVec.setViewBox(-window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
basisVec.reset();
basisVec.update();
