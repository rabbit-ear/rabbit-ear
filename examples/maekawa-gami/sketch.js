let div = document.querySelectorAll('.row')[0];
let origami = RabbitEar.Origami(div);
let folded = RabbitEar.Origami(div);

origami.nextLayer = RabbitEar.svg.group();
origami.appendChild(origami.nextLayer);

function updateFoldedState(cp){
	folded.cp = cp.copy();
	folded.draw();
}

origami.updateCenter = function(point) {
	// check bounds of point

	// origami.cp.kawasaki(, 1, "V");
	
	origami.draw();

	// let foldedCP = RabbitEar.fold.origami.fold_without_layering(origami.cp, 0);
	// folded.cp = RabbitEar.CreasePattern(foldedCP);
}

let options = Array.from(Array(8))
	.map((_,i,arr) => Math.PI/arr.length*i)
	.map(a => [Math.cos(a), Math.sin(a)]);

origami.onMouseMove = function(mouse) {
	RabbitEar.svg.removeChildren(origami.nextLayer);

	origami.nextEdge = undefined;
	origami.near = origami.nearest(mouse);
	let vertex = origami.near.vertex;
	if (vertex) {
		let boundary = RabbitEar.math.ConvexPolygon([[0,0], [1,0], [1,1], [0,1]]);
		let p = origami.cp.vertices_coords[vertex.index];
		let lines = options.map(v => RabbitEar.math.Line(p, v));
		let edges = lines.map(l => boundary.clipLine(l));
		let svgEdges = edges
			.map(e => RabbitEar.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
		svgEdges.forEach(e => e.setAttribute("stroke-width", 0.01));
		svgEdges.forEach(e => e.setAttribute("stroke", "#f1c14f"));
		svgEdges.forEach(e => e.setAttribute("stroke-dasharray", "0.02 0.04"));
		svgEdges.forEach(e => e.setAttribute("stroke-linecap", "round"));
		svgEdges.forEach(e => origami.nextLayer.appendChild(e));
		origami.nextEdge = edges.filter(e => e.length > 0.000001)
			.map(e => {
				let point = e.nearestPoint(mouse);
				let d = Math.sqrt(Math.pow(point[0] - mouse[0], 2) + Math.pow(point[1] - mouse[1], 2))
				return { edge: e, dist: d };
			})
			.sort((a,b) => a.dist - b.dist)
			.shift().edge;
		let nearestEdgeSVG = RabbitEar.svg.line(
			origami.nextEdge[0][0], origami.nextEdge[0][1],
			origami.nextEdge[1][0], origami.nextEdge[1][1]
		);
		nearestEdgeSVG.setAttribute("stroke-width", 0.015);
		nearestEdgeSVG.setAttribute("stroke", "#e35536");
		nearestEdgeSVG.setAttribute("stroke-linecap", "round");
		origami.nextLayer.appendChild(nearestEdgeSVG);
	}

	// if(mouse.isPressed){
	// 	origami.updateCenter(mouse);
	// }
}

origami.onMouseDown = function(mouse) {
	if (origami.nextEdge !== undefined) {
		let nextVector = [
			origami.nextEdge[1][0] - origami.nextEdge[0][0],
			origami.nextEdge[1][1] - origami.nextEdge[0][1]
		];
		let cp = JSON.parse(JSON.stringify(origami.cp.json));
		RabbitEar.fold.origami.crease_folded(cp, cp.vertices_coords[origami.near.vertex.index], nextVector, origami.near.face.index);
		origami.cp = RabbitEar.CreasePattern(cp);
		let foldedCP = RabbitEar.fold.origami.fold_without_layering(cp);
		folded.cp = RabbitEar.CreasePattern(foldedCP);
	}
	// origami.updateCenter(mouse);
}

origami.updateCenter({x:0.4+Math.random()*0.2, y:0.4+Math.random()*0.2});
