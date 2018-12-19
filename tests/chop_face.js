let facesChop = RabbitEar.Origami("canvas-faces-chop");

facesChop.cp = RabbitEar.bases.fish;

let drawLayer = RabbitEar.svg.group();
facesChop.svg.appendChild(drawLayer)
let dot = RabbitEar.svg.circle(0, 0, 0.015);
let dotVec = RabbitEar.svg.circle(0, 0, 0.015);
dot.setAttribute("fill", "#e44f2a");
dotVec.setAttribute("fill", "#e44f2a");
drawLayer.appendChild(dot);
drawLayer.appendChild(dotVec);

let frogFaces = facesChop.faces;
let highlightedFace = 0;

let s = 0.333; //master speed
let q = 1; //master speed
let a = 0.8;
let b = 1.2;
let c = 2.1;
let d = 1.3;
let e = 0.9;

// let event = {};
// event.time = 1.1;
// {
facesChop.animate = function(event){
	let vang = Math.cos(q*event.time*d + Math.sin(q*b*event.time+0.8) - Math.sin(q*a*event.time+1.9) + a) * Math.PI;
	let vx = Math.cos(vang);
	let vy = Math.sin(vang);

	let x = (Math.cos(s*event.time*a - Math.sin(s*d*event.time+0.8) + b)*0.5+0.5)*0.9 + 0.05;
	let y = (Math.sin(s*event.time*c + Math.sin(s*e*event.time+1.9) + a)*0.5+0.5)*0.9 + 0.05;
	dot.setAttribute("cx", x);
	dot.setAttribute("cy", y);
	dotVec.setAttribute("cx", x + vx*0.03);
	dotVec.setAttribute("cy", y + vy*0.03);

	let found = frogFaces.map(f => f.contains([x, y]))
		.map((b,i) => b ? i : null)
		.filter(el => el != null)
		.shift();

	let faces = Array.from(facesChop.svg.childNodes)
		.filter(el => el.getAttribute('id') == 'faces')
		.shift();
	faces.childNodes[highlightedFace].setAttribute("class", "face");
	highlightedFace = found;
	faces.childNodes[highlightedFace].setAttribute("class", "face-highlight");

	let newCP = JSON.parse(JSON.stringify(RabbitEar.bases.fish));
	let diff = RabbitEar.graph.split_convex_polygon(newCP, highlightedFace, [x,y], [vx, vy]);

	RabbitEar.fold.apply_diff(newCP, diff);
	// console.log(newCP);
	facesChop.cp = newCP;

	let creases = Array.from(facesChop.svg.childNodes)
		.filter(el => el.getAttribute('id') == 'creases')
		.shift();


}