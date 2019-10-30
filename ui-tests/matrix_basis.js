let basisVecSketchCallback;
let basisVec;

let aspect = window.innerHeight / window.innerWidth;

basisVec = RabbitEar.svg("canvas-matrix-basis", function (){
	if (basisVec != null) {
		basisVec.setViewBox(-0.5*6, -aspect/2*6, 1*6, aspect*6);
		basisVec.reset();
		basisVec.update();
	}
});

basisVec.setViewBox(-0.5*6, -aspect/2*6, 1*6, aspect*6);

basisVec.gridLayer = basisVec.group();
basisVec.drawLayer = basisVec.group();
basisVec.basisColors = ["#ecb233", "#e44f2a"];

basisVec.touches = RabbitEar.svg.controls(basisVec, 2, {radius: 0.04, fill: "#e44f2a"});
basisVec.touches.forEach((t,i) => t.circle.setAttribute("fill", basisVec.basisColors[i]));

basisVec.reset = function () {
	for (let i = 0; i < 2; i++) {
		var angle = Math.random() * Math.PI * 2;
		basisVec.touches[i].position = [
			Math.cos(angle),
			Math.sin(angle)
		];
	}
	basisVec.touches[0].position = [1, 0];
	basisVec.touches[1].position = [0, 1];

}
basisVec.recalc = function () {
	let center = [0, 0];
	basisVec.vectors = basisVec.touches
		.map(t => RabbitEar.vector(t.position));
	basisVec.normalized = basisVec.vectors.map(v => v.normalize());
	basisVec.cross = basisVec.normalized[0].cross(basisVec.normalized[1]);
	basisVec.dot0_1 = basisVec.normalized[0].dot(basisVec.normalized[1]);
	basisVec.dot1_0 = basisVec.normalized[1].dot(basisVec.normalized[0]);
}
basisVec.redraw = function () {

	basisVec.gridLayer.removeChildren();

	let GRIDS = 4;
	for (let i = -4; i <= 4; i++) {
		let linea = basisVec.gridLayer.line(i, -GRIDS*1.0, i, GRIDS*1.0);
		let lineb = basisVec.gridLayer.line(-GRIDS*1.0, i, GRIDS*1.0, i);
		linea.setAttribute("stroke", "#eee");
		linea.setAttribute("stroke-width", 0.01);
		lineb.setAttribute("stroke", "#eee");
		lineb.setAttribute("stroke-width", 0.01);
	}

	let xBasis = basisVec.touches[0].position;
	let yBasis = basisVec.touches[1].position;
	for (let i = -4; i <= 4; i++) {
		let linea = basisVec.gridLayer.line(
			xBasis[0] * i - GRIDS*yBasis[0], xBasis[1] * i - GRIDS*yBasis[1],
			xBasis[0] * i + GRIDS*yBasis[0] , xBasis[1] * i + GRIDS*yBasis[1],
		);
		linea.setAttribute("stroke", "#ccc");
		linea.setAttribute("stroke-width", 0.01);

		let lineb = basisVec.gridLayer.line(
			yBasis[0] * i - GRIDS*xBasis[0], yBasis[1] * i - GRIDS*xBasis[1],
			yBasis[0] * i + GRIDS*xBasis[0] , yBasis[1] * i + GRIDS*xBasis[1],
		);
		lineb.setAttribute("stroke", "#ccc");
		lineb.setAttribute("stroke-width", 0.01);
	}

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
	poly.setAttribute("opacity", 0.3)

	let basisLines = basisVec.touches
		.map(t => t.position)
		.map(p => basisVec.drawLayer.line(0, 0, p[0], p[1]))
		.forEach((l, i) => {
			l.setAttribute("stroke", basisVec.basisColors[i]);
			l.setAttribute("stroke-width", 0.03);
		});
		
	// dot product
	let dotLine = basisVec.drawLayer.line(0, 0, basisVec.dot0_1[0], basisVec.dot0_1[1]);
	dotLine.setAttribute("stroke", "#ecb233");
	dotLine.setAttribute("stroke-width", 0.01);
	dotLine.setAttribute("stroke-linecap", "round");

	let originDot = basisVec.drawLayer.circle(0, 0, 0.015);
	originDot.setAttribute("fill", "black");

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
	// let crossLine = basisVec.drawLayer.line(0, 0, basisVec.cross[0], basisVec.cross[1]);
	// crossLine.setAttribute("stroke", "#195783");
	// crossLine.setAttribute("stroke-width", 8);
	// crossLine.setAttribute("stroke-linecap", "round");
	// crossLine.setAttribute("stroke-dasharray", "10 17");
	// let crossDot = basisVec.drawLayer.circle(basisVec.cross[0], basisVec.cross[1], 8);
	// crossDot.setAttribute("fill", "#195783");

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

	if (basisVecSketchCallback != null) {
		let axes = [
			basisVec.touches[0].position,
			basisVec.touches[1].position
		];
		basisVecSketchCallback({axes: axes});
	}
}

basisVec.update = function () {
	basisVec.recalc();
	basisVec.redraw();
}

basisVec.onMouseDown = function (mouse) {
	basisVec.selected = 0;
};

basisVec.onMouseMove = function (mouse) {
	// console.log(mouse);
	// if(mouse.isPressed && basisVec.selected != null){
	// 	basisVec.touches[basisVec.selected].pos = mouse.position;
	// 	basisVec.update();
	// }
	if (mouse.isPressed) {
		basisVec.update();
	}
};

basisVec.reset();
basisVec.update();
