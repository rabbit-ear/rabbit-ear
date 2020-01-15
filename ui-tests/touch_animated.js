let touchAnimated = RabbitEar.origami("canvas-touch-animated");

touchAnimated.cp = RabbitEar.CreasePattern(RabbitEar.bases.frog);

let drawLayer = RabbitEar.svg.group();
touchAnimated.svg.appendChild(drawLayer)
let dot = RabbitEar.svg.circle(0, 0, 0.01);
dot.setAttribute("fill", "#e44f2a");
drawLayer.appendChild(dot);

let frogFaces = touchAnimated.faces;
let highlightedFace = 0;

let s = 0.333; //master speed
let a = 0.8;
let b = 1.2;
let c = 2.1;
let d = 1.3;
let e = 0.9;

touchAnimated.animate = function(event){
	let x = (Math.sin(event.time*0.5 + Math.sin(event.time*0.43)+3)*0.5+0.5 + Math.cos(s*event.time*a - Math.sin(s*d*event.time+0.8) + b)*0.5+0.5)*0.45 + 0.05;
	let y = (Math.cos(event.time*1.1 + Math.cos(event.time*0.2)+2)*0.5+0.5 + Math.sin(s*event.time*c + Math.sin(s*e*event.time+1.9) + a)*0.5+0.5)*0.45 + 0.05;
	dot.setAttribute("cx", x);
	dot.setAttribute("cy", y);

	touchAnimated.draw();
	let nearest = touchAnimated.nearest(x, y);
	nearest.face.svg.setAttribute("class", "face-highlight");
	nearest.edge.svg.setAttribute("class", "crease-highlight");
}