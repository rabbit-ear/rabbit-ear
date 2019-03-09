let chopReflect = RabbitEar.Origami("canvas-faces-chop");
let folded = RabbitEar.Origami("canvas-faces-chop-folded");
folded.isFolded = true;

chopReflect.masterCP = RabbitEar.bases.blintzDistorted;
chopReflect.cp = RabbitEar.CreasePattern(chopReflect.masterCP);

let drawLayer = RabbitEar.svg.group();
chopReflect.svg.appendChild(drawLayer)
let dot = RabbitEar.svg.circle(0, 0, 0.02);
let dotVec = RabbitEar.svg.circle(0, 0, 0.02);
dot.setAttribute("fill", "#e44f2a");
dotVec.setAttribute("fill", "#e44f2a");
drawLayer.appendChild(dot);
drawLayer.appendChild(dotVec);

let cpFaces = chopReflect.faces;

let highlightedFace = 0;

// let s = 0.333; //master speed
let s = 0.33333; //master speed
let q = 1; //master speed
let a = 0.8;
let b = 1.2;
let c = 2.1;
let d = 1.3;
let e = 0.9;

chopReflect.updateWanderingLine = function(event) {
	let vAngle = Math.cos(q*s*event.time*d + Math.sin(q*b*s*event.time+0.8) - Math.sin(q*a*s*event.time+1.9) + a) * 2;
	let vx = Math.cos(vAngle);
	let vy = Math.sin(vAngle);
	let x = (Math.sin(s*event.time*0.5 + Math.sin(s*event.time*0.43)+3)*0.5+0.5 + Math.cos(s*event.time*a - Math.sin(d*s*event.time+0.8) + b)*0.5+0.5)*0.45 + 0.05;
	let y = (Math.cos(s*event.time*1.1 + Math.cos(s*event.time*0.2)+2)*0.5+0.5 + Math.sin(s*event.time*c + Math.sin(e*s*event.time+1.9) + a)*0.5+0.5)*0.45 + 0.05;
	dot.setAttribute("cx", x);
	dot.setAttribute("cy", y);
	dotVec.setAttribute("cx", x + vx*0.03);
	dotVec.setAttribute("cy", y + vy*0.03);
	return {
		point: [x,y],
		vector: [vx,vy]
	};
}

// let event = {};
// event.time = 2;
// {
chopReflect.animate = function(event){
	let line = chopReflect.updateWanderingLine(event);
	let cp = JSON.parse(JSON.stringify(chopReflect.masterCP));
	RabbitEar.fold.origami.crease_folded(cp, line.point, line.vector, 4);
	chopReflect.cp = RabbitEar.CreasePattern(cp);
	let foldedCP = RabbitEar.fold.origami.fold_without_layering(cp, chopReflect.nearest(0.5, 0.5).face.index);
	folded.cp = RabbitEar.CreasePattern(foldedCP);
}

// chopReflect.onMouseDown = function(event) {
// 	console.log("mouse down", event);
// }


