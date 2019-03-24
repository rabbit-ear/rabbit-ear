let origami = RabbitEar.Origami("face-coloring");

origami.cp = RabbitEar.CreasePattern(RabbitEar.bases.frog);
origami.colors = ["#224c72", "#f1c14f"];

let faceCount = origami.faces.length;
let facesSVG = document.querySelector("#faces").children;

let faces_coloring = RabbitEar.fold.graph.faces_coloring(origami.cp, 0);

faces_coloring
	.map(color => color ? 0 : 1)
	.forEach((color, i) => {
		facesSVG[i].removeAttribute("class");
		facesSVG[i + faceCount].removeAttribute("class");
		facesSVG[i].setAttribute("fill", origami.colors[color]);
		facesSVG[i + faceCount].setAttribute("fill", origami.colors[color]);
	});
