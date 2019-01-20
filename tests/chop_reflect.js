let chopReflect = RabbitEar.Origami("canvas-faces-chop");

chopReflect.masterCP = JSON.parse(JSON.stringify(RabbitEar.bases.bird));
// RabbitEar.graph.faces_vertices_to_edges(chopReflect.masterCP);
chopReflect.cp = RabbitEar.CreasePattern(chopReflect.masterCP);

let drawLayer = RabbitEar.svg.group();
chopReflect.svg.appendChild(drawLayer)
let dot = RabbitEar.svg.circle(0, 0, 0.02);
let dotVec = RabbitEar.svg.circle(0, 0, 0.02);
dot.setAttribute("fill", "#e44f2a");
dotVec.setAttribute("fill", "#e44f2a");
drawLayer.appendChild(dot);
drawLayer.appendChild(dotVec);

let frogFaces = chopReflect.faces;
let highlightedFace = 0;

let s = 0.333; //master speed
let q = 1; //master speed
let a = 0.8;
let b = 1.2;
let c = 2.1;
let d = 1.3;
let e = 0.9;

// let event = {};
// event.time = 2;
// {
chopReflect.animate = function(event){
	let vAngle = Math.cos(q*event.time*d + Math.sin(q*b*event.time+0.8) - Math.sin(q*a*event.time+1.9) + a) * 2;
	let vx = Math.cos(vAngle);
	let vy = Math.sin(vAngle);

	let x = (Math.sin(event.time*0.5 + Math.sin(event.time*0.43)+3)*0.5+0.5 + Math.cos(s*event.time*a - Math.sin(s*d*event.time+0.8) + b)*0.5+0.5)*0.45 + 0.05;
	let y = (Math.cos(event.time*1.1 + Math.cos(event.time*0.2)+2)*0.5+0.5 + Math.sin(s*event.time*c + Math.sin(s*e*event.time+1.9) + a)*0.5+0.5)*0.45 + 0.05;
	dot.setAttribute("cx", x);
	dot.setAttribute("cy", y);
	dotVec.setAttribute("cx", x + vx*0.03);
	dotVec.setAttribute("cy", y + vy*0.03);

	let found = frogFaces.map(f => f.contains([x, y]))
		.map((b,i) => b ? i : null)
		.filter(el => el != null)
		.shift();

	let faces = Array.from(chopReflect.svg.childNodes)
		.filter(el => el.getAttribute('id') == 'faces')
		.shift();
	faces.childNodes[highlightedFace].setAttribute("class", "face");
	highlightedFace = found;
	faces.childNodes[highlightedFace].setAttribute("class", "face-highlight");

	let newCP = JSON.parse(JSON.stringify(chopReflect.masterCP));
	// console.log(newCP);
	// console.log(newCP.faces_vertices[highlightedFace]);
	// console.log(newCP.faces_vertices[highlightedFace].map(fv => newCP.vertices_coords[fv]));

	let coloring = RabbitEar.graph.face_coloring(newCP, highlightedFace);
	// console.log(coloring);

	let matrices = RabbitEar.graph.make_faces_matrix_inv(newCP, highlightedFace);
	let firstCrease = RabbitEar.math.Line([x,y], [vx,vy]);
	let creaseLineFaces = matrices.map(m => firstCrease.transform(m));

	let removes = {
		vertices:[],
		edges:[],
		faces:[]
	};
	creaseLineFaces.forEach((line,i) => {
		let diff = RabbitEar.graph.split_convex_polygon(newCP, i, line.point, line.vector, coloring[i] ? "M" : "V");
		let remove = RabbitEar.fold.apply_diff(newCP, diff);
		removes.vertices = removes.vertices.concat(remove.vertices);
		removes.edges = removes.edges.concat(remove.edges);
		removes.faces = removes.faces.concat(remove.faces);
	});

	RabbitEar.graph.remove_vertices(newCP, removes.vertices);
	RabbitEar.graph.remove_edges(newCP, removes.edges);
	RabbitEar.graph.remove_faces(newCP, removes.faces);

	chopReflect.cp = newCP;
}


