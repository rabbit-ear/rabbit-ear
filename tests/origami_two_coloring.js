let twoColor = RabbitEar.Origami("canvas-face-coloring");

twoColor.cp = RabbitEar.CreasePattern(RabbitEar.bases.frog);
twoColor.colors = ["#224c72", "#f1c14f"];
twoColor.groups.vertex.setAttribute("opacity", 0)

let faceCount = twoColor.faces.length;

let facesSVG = twoColor.groups.face.children;

let faces_coloring = RabbitEar.core.faces_coloring(twoColor.cp, 0);

faces_coloring
	.map(color => color ? 0 : 1)
	.forEach((color, i) => {
		facesSVG[i].removeAttribute("class");
		facesSVG[i + faceCount].removeAttribute("class");
		facesSVG[i].setAttribute("fill", twoColor.colors[color]);
		facesSVG[i + faceCount].setAttribute("fill", twoColor.colors[color]);
	});
