let movingDot = RabbitEar.Origami("canvas-moving-dot");

movingDot.cp = RabbitEar.bases.frog;

let drawLayer = RabbitEar.svg.group();
movingDot.svg.appendChild(drawLayer)
let dot = RabbitEar.svg.circle(0, 0, 0.01);
dot.setAttribute("fill", "#e44f2a");
drawLayer.appendChild(dot);

let frogFaces = movingDot.faces;
let highlightedFace = 0;

let z = 0.333; //master speed
let a = 0.8;
let b = 1.2;
let c = 2.1;
let d = 1.3;
let e = 0.9;

movingDot.animate = function(event){
	let x = Math.cos(z*event.time*a - Math.sin(z*d*event.time+0.8) + b)*0.5+0.5;
	let y = Math.sin(z*event.time*c + Math.sin(z*e*event.time+1.9) + a)*0.5+0.5;
	dot.setAttribute("cx", x);
	dot.setAttribute("cy", y);

	let found = frogFaces.map(f => f.contains([x, y]))
		.map((b,i) => b ? i : null)
		.filter(el => el != null)
		.shift();
	if(found != highlightedFace){
		let faces = Array.from(movingDot.svg.childNodes)
			.filter(el => el.getAttribute('id') == 'faces')
			.shift();
		faces.childNodes[highlightedFace].setAttribute("class", "face");
		highlightedFace = found;
		faces.childNodes[highlightedFace].setAttribute("class", "face-highlight");
	}
}