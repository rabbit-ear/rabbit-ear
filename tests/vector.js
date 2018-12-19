let vecSketchCallback;

let vec = RabbitEar.svg.View("canvas-vector", 500, 500, function(){
	vec.setViewBox(-250,-250,500,500);
	vec.reset();
	vec.update();
});
vec.drawLayer = RabbitEar.svg.group();
vec.dotLayer = RabbitEar.svg.group();
vec.svg.appendChild(vec.drawLayer);
vec.svg.appendChild(vec.dotLayer);

vec.reset = function(){
	var randAngle = Math.random() * Math.PI * 2;
	vec.touches = [
		{pos: [Math.cos(randAngle) * 220,
		       Math.sin(randAngle) * 220],
		 svg: RabbitEar.svg.circle(0, 0, 12)}
	];
	vec.touches.forEach(p => {
		p.svg.setAttribute("fill", "#e44f2a");
		vec.dotLayer.appendChild(p.svg);
	});
}
vec.recalc = function(){
	let center = [0, 0];
	let vecpts = vec.touches[0].pos.map((v,i) => v - center[i]);
	vec.v = RabbitEar.math.Vector(vecpts);
	vec.normalized = vec.v.normalize().scale(200);
	vec.cross = vec.v.cross([0,0,1]);
	vec.dotX = vec.v.dot([1,0,0]);
	vec.dotY = vec.v.dot([0,1,0]);
}
vec.redraw = function(){

	vec.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});

	RabbitEar.svg.removeChildren(vec.drawLayer);

	// dot product
	let dotXLine = RabbitEar.svg.line(0, 0, vec.dotX, 0);
	let dotYLine = RabbitEar.svg.line(0, 0, 0, vec.dotY);
	dotXLine.setAttribute("stroke", "#ecb233");
	dotYLine.setAttribute("stroke", "#ecb233");
	dotXLine.setAttribute("stroke-width", 8);
	dotYLine.setAttribute("stroke-width", 8);
	dotXLine.setAttribute("stroke-linecap", "round");
	dotYLine.setAttribute("stroke-linecap", "round");
	vec.drawLayer.appendChild(dotXLine);
	vec.drawLayer.appendChild(dotYLine);

	let dotXdash = RabbitEar.svg.line(vec.v.x, vec.v.y, vec.dotX, 0);
	let dotYdash = RabbitEar.svg.line(vec.v.x, vec.v.y, 0, vec.dotY);
	dotXdash.setAttribute("stroke", "#ecb233");
	dotYdash.setAttribute("stroke", "#ecb233");
	dotXdash.setAttribute("stroke-width", 8);
	dotYdash.setAttribute("stroke-width", 8);
	dotXdash.setAttribute("stroke-linecap", "round");
	dotYdash.setAttribute("stroke-linecap", "round");
	dotXdash.setAttribute("stroke-dasharray", "0.01 17");
	dotYdash.setAttribute("stroke-dasharray", "0.01 17");
	vec.drawLayer.appendChild(dotXdash);
	vec.drawLayer.appendChild(dotYdash);	

	// cross product
	let crossLine = RabbitEar.svg.line(0, 0, vec.cross.x, vec.cross.y);
	crossLine.setAttribute("stroke", "#195783");
	crossLine.setAttribute("stroke-width", 8);
	crossLine.setAttribute("stroke-linecap", "round");
	crossLine.setAttribute("stroke-dasharray", "10 17");
	vec.drawLayer.appendChild(crossLine);
	let crossDot = RabbitEar.svg.circle(vec.cross.x, vec.cross.y, 12);
	crossDot.setAttribute("fill", "#195783");
	vec.drawLayer.appendChild(crossDot);

	let crossLen = vec.cross.magnitude();
	let crossAngle = Math.atan2(vec.cross.y, vec.cross.x);
	let crossA = 0, crossB = 0;
	if (vec.cross.x > 0 && vec.cross.y > 0){ crossA = 0;  crossB = crossAngle; }
	if (vec.cross.x > 0 && vec.cross.y < 0){ crossA = crossAngle;  crossB = 0; }
	if (vec.cross.x < 0 && vec.cross.y > 0){ crossA = crossAngle;  crossB = Math.PI; }
	if (vec.cross.x < 0 && vec.cross.y < 0){ crossA = Math.PI;  crossB = crossAngle; }

	let crossArc1 = RabbitEar.svg.arc(0, 0, crossLen, crossA, crossB);
	crossArc1.setAttribute("stroke", "#195783");
	crossArc1.setAttribute("fill", "none");
	crossArc1.setAttribute("stroke-width", 8);
	crossArc1.setAttribute("stroke-linecap", "round");
	crossArc1.setAttribute("stroke-dasharray", "0.01 17");
	vec.drawLayer.appendChild(crossArc1);


	let line = RabbitEar.svg.line(0, 0, vec.normalized.x, vec.normalized.y);
	line.setAttribute("stroke", "#e44f2a");
	line.setAttribute("stroke-width", 8);
	line.setAttribute("stroke-linecap", "round");
	vec.drawLayer.appendChild(line);

	let normLen = vec.normalized.magnitude();
	let normAngle = Math.atan2(vec.normalized.y, vec.normalized.x);
	let nA = 0, nB = 0;
	if (vec.normalized.x > 0 && vec.normalized.y > 0){ nA = 0;  nB = normAngle; }
	if (vec.normalized.x > 0 && vec.normalized.y < 0){ nA = normAngle;  nB = 0; }
	if (vec.normalized.x < 0 && vec.normalized.y > 0){ nA = normAngle;  nB = Math.PI; }
	if (vec.normalized.x < 0 && vec.normalized.y < 0){ nA = Math.PI;  nB = normAngle; }

	let normArc = RabbitEar.svg.arc(0, 0, normLen, nA, nB);
	normArc.setAttribute("stroke", "#e44f2a");
	normArc.setAttribute("fill", "none");
	normArc.setAttribute("stroke-width", 8);
	normArc.setAttribute("stroke-linecap", "round");
	normArc.setAttribute("stroke-dasharray", "10 17");
	vec.drawLayer.appendChild(normArc);

	if(vecSketchCallback != null){
		let readable = vec.touches[0].pos.map(p => p / 200.0)
		vecSketchCallback({vector: readable});
	}
}

vec.update = function(){
	vec.recalc();
	vec.redraw();
}

vec.onMouseDown = function(mouse){
	let ep = vec.width / 50;
	let down = vec.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	vec.selected = found;
}

vec.onMouseMove = function(mouse){
	if(mouse.isPressed && vec.selected != null){
		vec.touches[vec.selected].pos = mouse.position;
		vec.update();
	}
}
