let twoColor = RabbitEar.Origami("canvas-face-coloring");
twoColor.preferences.folding = false;
twoColor.cp = RabbitEar.CreasePattern(RabbitEar.bases.frog);
twoColor.groups.vertex.setAttribute("opacity", 0)

let faces_coloring = RabbitEar.core.faces_coloring(twoColor.cp, 0);

faces_coloring
	.map(color => color ? "#224c72" : "#f1c14f")
	.forEach((color, i) => {
		twoColor.faces[i].svg.removeAttribute("class");
		twoColor.faces[i].svg.setAttribute("fill", color);
	});
