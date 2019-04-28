let vecTextSketchCallback;
let vecText;

vecText = RabbitEar.svg.image("canvas-vector-labels", window.innerWidth, window.innerHeight, function(){
	if (vecText != null) {
		vecText.setViewBox(-window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
		vecText.reset();
		vecText.update();
	}
});
vecText.gridLayer = vecText.group();
vecText.drawLayer = vecText.group();
vecText.dotLayer = vecText.group();

vecText.reset = function(){
	vecText.gridLayer.removeChildren();
	for (let i = -4; i <= 4; i++) {
		let s = i * 200;
		vecText.gridLayer.line(s, -vecText.h, s, vecText.h).setAttribute("stroke", "#ccc");
		vecText.gridLayer.line(-vecText.w, s, vecText.w, s).setAttribute("stroke", "#ccc");
	}

	vecText.dotLayer.removeChildren();
	var randAngle = Math.random() * Math.PI * 2;
	vecText.touches = [
		{pos: [Math.cos(randAngle) * 220,
		       Math.sin(randAngle) * 220],
		 svg: RabbitEar.svg.circle(0, 0, 12)}
	];
	vecText.touches.forEach(p => {
		p.svg.setAttribute("fill", "#e44f2a");
		vecText.dotLayer.appendChild(p.svg);
	});
}
vecText.recalc = function(){
	let center = [0, 0];
	let vecpts = vecText.touches[0].pos.map((v,i) => v - center[i]);
	vecText.v = RabbitEar.Vector(vecpts);
	vecText.normalized = vecText.v.normalize().scale(200);
	vecText.cross = vecText.v.cross([0,0,1]);
	vecText.rot90 = vecText.v.rotateZ90();
	vecText.dotX = vecText.v.dot([1,0,0]);
	vecText.dotY = vecText.v.dot([0,1,0]);
}
vecText.redraw = function(){

	vecText.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});

	vecText.drawLayer.removeChildren();

	// dot product
	let dotXLine = RabbitEar.svg.line(0, 0, vecText.dotX, 0);
	let dotYLine = RabbitEar.svg.line(0, 0, 0, vecText.dotY);
	dotXLine.setAttribute("stroke", "#ecb233");
	dotYLine.setAttribute("stroke", "#ecb233");
	dotXLine.setAttribute("stroke-width", 8);
	dotYLine.setAttribute("stroke-width", 8);
	dotXLine.setAttribute("stroke-linecap", "round");
	dotYLine.setAttribute("stroke-linecap", "round");
	vecText.drawLayer.appendChild(dotXLine);
	vecText.drawLayer.appendChild(dotYLine);

	let dotXdash = RabbitEar.svg.line(vecText.v.x, vecText.v.y, vecText.dotX, 0);
	let dotYdash = RabbitEar.svg.line(vecText.v.x, vecText.v.y, 0, vecText.dotY);
	dotXdash.setAttribute("stroke", "#ecb233");
	dotYdash.setAttribute("stroke", "#ecb233");
	dotXdash.setAttribute("stroke-width", 8);
	dotYdash.setAttribute("stroke-width", 8);
	dotXdash.setAttribute("stroke-linecap", "round");
	dotYdash.setAttribute("stroke-linecap", "round");
	dotXdash.setAttribute("stroke-dasharray", "0.01 17");
	dotYdash.setAttribute("stroke-dasharray", "0.01 17");
	vecText.drawLayer.appendChild(dotXdash);
	vecText.drawLayer.appendChild(dotYdash);	

	// cross product
	let crossLine = RabbitEar.svg.line(0, 0, vecText.rot90.x, vecText.rot90.y);
	crossLine.setAttribute("stroke", "#195783");
	crossLine.setAttribute("stroke-width", 8);
	crossLine.setAttribute("stroke-linecap", "round");
	crossLine.setAttribute("stroke-dasharray", "10 17");
	vecText.drawLayer.appendChild(crossLine);
	let crossDot = RabbitEar.svg.circle(vecText.rot90.x, vecText.rot90.y, 8);
	crossDot.setAttribute("fill", "#195783");
	vecText.drawLayer.appendChild(crossDot);

	let crossLen = vecText.rot90.magnitude;
	let crossAngle = Math.atan2(vecText.rot90.y, vecText.rot90.x);
	let crossA = 0, crossB = 0;
	if (vecText.rot90.x > 0 && vecText.rot90.y > 0){ crossA = 0;  crossB = crossAngle; }
	if (vecText.rot90.x > 0 && vecText.rot90.y < 0){ crossA = crossAngle;  crossB = 0; }
	if (vecText.rot90.x < 0 && vecText.rot90.y > 0){ crossA = crossAngle;  crossB = Math.PI; }
	if (vecText.rot90.x < 0 && vecText.rot90.y < 0){ crossA = Math.PI;  crossB = crossAngle; }

	let crossArc1 = RabbitEar.svg.arc(0, 0, crossLen, crossA, crossB);
	crossArc1.setAttribute("stroke", "#195783");
	crossArc1.setAttribute("fill", "none");
	crossArc1.setAttribute("stroke-width", 8);
	crossArc1.setAttribute("stroke-linecap", "round");
	crossArc1.setAttribute("stroke-dasharray", "0.01 17");
	vecText.drawLayer.appendChild(crossArc1);



	let lineV = RabbitEar.svg.line(0, 0, vecText.v.x, vecText.v.y);
	lineV.setAttribute("stroke", "#e44f2a");
	lineV.setAttribute("stroke-width", 8);
	lineV.setAttribute("stroke-dasharray", "0.01 17");
	lineV.setAttribute("stroke-linecap", "round");
	vecText.drawLayer.appendChild(lineV);

	let line = RabbitEar.svg.line(0, 0, vecText.normalized.x, vecText.normalized.y);
	line.setAttribute("stroke", "#e44f2a");
	line.setAttribute("stroke-width", 8);
	line.setAttribute("stroke-linecap", "round");
	vecText.drawLayer.appendChild(line);

	let normLen = vecText.normalized.magnitude;
	let normAngle = Math.atan2(vecText.normalized.y, vecText.normalized.x);
	let nA = 0, nB = 0;
	if (vecText.normalized.x > 0 && vecText.normalized.y > 0){ nA = 0;  nB = normAngle; }
	if (vecText.normalized.x > 0 && vecText.normalized.y < 0){ nA = normAngle;  nB = 0; }
	if (vecText.normalized.x < 0 && vecText.normalized.y > 0){ nA = normAngle;  nB = Math.PI; }
	if (vecText.normalized.x < 0 && vecText.normalized.y < 0){ nA = Math.PI;  nB = normAngle; }

	let normArc = RabbitEar.svg.arc(0, 0, normLen, nA, nB);
	normArc.setAttribute("stroke", "#e44f2a");
	normArc.setAttribute("fill", "none");
	normArc.setAttribute("stroke-width", 8);
	normArc.setAttribute("stroke-linecap", "round");
	normArc.setAttribute("stroke-dasharray", "10 17");
	vecText.drawLayer.appendChild(normArc);

	// text
	let dotXString = "X: " + (vecText.dotX/200).toFixed(1);
	let dotYString = "Y: " + (vecText.dotY/200).toFixed(1);
	let dotXText = textLarge(dotXString, vecText.dotX, -15, vecText.drawLayer);
	let dotYText = textLarge(dotYString, 0, vecText.dotY-15, vecText.drawLayer);
	dotXText.setAttribute("fill", "#ecb233");
	dotYText.setAttribute("fill", "#ecb233");
	// let dotXEquationText = textSmall("x", vecText.dotX, -45, vecText.drawLayer);
	// let dotYEquationText = textSmall("y", 0, vecText.dotY-45, vecText.drawLayer);
	// dotXEquationText.setAttribute("fill", "#ecb233");
	// dotYEquationText.setAttribute("fill", "#ecb233");

	let crossString = "("+(vecText.rot90.x/200).toFixed(1) + ", " + (vecText.rot90.y/200).toFixed(1)+")";
	let crossText = textLarge(crossString, vecText.rot90.x, vecText.rot90.y-25, vecText.drawLayer);
	crossText.setAttribute("fill", "#195783");
	let crossEquationString = "+90 degrees"
	let crossEquationText = textSmall(crossEquationString, vecText.rot90.x, vecText.rot90.y-55, vecText.drawLayer);
	crossEquationText.setAttribute("fill", "#195783");

	let printableNorm = vecText.normalized.map(p => p / 200.0);
	let normString = "("+printableNorm[0].toFixed(1) + ", " + printableNorm[1].toFixed(1)+")";
	let normText = textLarge(normString, vecText.normalized.x, vecText.normalized.y-25, vecText.drawLayer);
	normText.setAttribute("fill", "#e44f2a");

	// let printableVec = vecText.touches[0].pos.map(p => p / 200.0);
	// let vecString = "("+printableVec[0].toFixed(1) + ", " + printableVec[1].toFixed(1)+")";
	// let vectorText = textLarge(vecString, vecText.touches[0].pos[0], vecText.touches[0].pos[1]-25, vecText.drawLayer);
	// vectorText.setAttribute("fill", "#e44f2a");

	if(vecTextSketchCallback != null){
		let readableVec = vecText.touches[0].pos.map(p => p / 200.0)
		let readableNorm = vecText.normalized.map(p => p / 200.0)
		vecTextSketchCallback({vector: readableVec, normalized: readableNorm});
	}
}

function textSmall(string, x, y, parent) {
	let textStyle = "font-family:Helvetica; font-weight:700; font-size:18px; text-anchor:middle; user-select:none;";
	return textBox(string, x, y, textStyle, parent);
}
function textLarge(string, x, y, parent) {
	let textStyle = "font-family:Helvetica; font-weight:700; font-size:32px; text-anchor:middle; user-select:none;";
	return textBox(string, x, y, textStyle, parent);
}

function textBox(string, x, y, style, parent) {
	let text = RabbitEar.svg.text(string, x, y);
	text.setAttribute("style", style);
	parent.appendChild(text);

	SVGRect = text.getBBox();
	var rect = RabbitEar.svg.rect(SVGRect.x, SVGRect.y, SVGRect.width, SVGRect.height);
	rect.setAttribute("fill", "white");
	rect.setAttribute("opacity", 0.8);
	parent.insertBefore(rect, text);
	return text;
}

vecText.update = function(){
	vecText.recalc();
	vecText.redraw();
}

vecText.onMouseDown = function(mouse){
	// console.log(mouse);
	// console.log(vecText.touches[0].pos);
	// let ep = vecText.width / 5;
	// console.log(ep);
	// let down = vecText.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	// let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	// vecText.selected = found;
	// console.log(vecText.selected);
	vecText.selected = 0;
};

vecText.onMouseMove = function(mouse){
	// console.log(mouse);
	if(mouse.isPressed && vecText.selected != null){
		vecText.touches[vecText.selected].pos = mouse.position;
		vecText.update();
	}
};

vecText.setViewBox(-window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
vecText.reset();
vecText.update();
