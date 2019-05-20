let app = (function(){

	let mode = "mode-axiom-1";

	let origami = RE.Origami("origami", {padding:0.1});
	origami.arrowLayer = origami.group();
	origami.vertices.visible = true;
	origami.touchHistory = []; 

	origami.onMouseMove = function(mouse) {
		let nearest = origami.nearest(mouse);
		origami.vertices
			.map(a => a.svg)
			.filter(a => a!=null)
			.forEach(circle => circle.style = "");
		origami.edges.map(a => a.svg).forEach(line => line.style = "");
		// origami.faces.map(a => a.svg).forEach(poly => poly.style = "");
		origami.touchHistory.forEach(near => {
			if (near.vertex) { near.vertex.svg.style = "fill:#e53;stroke:#e53"; }
			if (near.edge) { near.edge.svg.style = "stroke:#e53"; }
		})
		if (nearest.vertex) { nearest.vertex.svg.style = "fill:#ec3;stroke:#ec3"; }
		if (nearest.edge) { nearest.edge.svg.style = "stroke:#ec3"; }
		// if (nearest.face) { nearest.face.svg.style = "fill:#ec3"; }
		origami.decorate(nearest);
	}

	origami.onMouseDown = function(mouse) {
		origami.touchHistory.push(origami.nearest(mouse));
		origami.perform();
	}

	origami.perform = function() {
		if (mode === "mode-flip-crease") {
			origami.touchHistory[0].edge.flip();
		}
		if (mode === "mode-remove-crease") {
			// let edges = [origami.touchHistory[0].edge.index];
			// console.log(edges);
			RE.core.remove_edges(origami.cp, [origami.touchHistory[0].edge.index]);
			RE.core.clean(origami.cp);
		}	
		// axom fold
		if (mode.substring(0,11) === "mode-axiom-") {
			if (origami.touchHistory.length < 2) { return; }
			let axiom = parseInt(mode.substring(11,12));
			// console.log(origami.touchHistory[0], origami.touchHistory[1]);
			let creases = axiom === 3
				? RE.axiom(axiom,
					origami.touchHistory[0].edge.point,
					origami.touchHistory[0].edge.vector,
					origami.touchHistory[1].edge.point,
					origami.touchHistory[1].edge.vector)
				: [RE.axiom(axiom, origami.touchHistory[0].vertex,
					 origami.touchHistory[1].vertex)];
			creases.forEach(c => origami.crease(c).valley());
		}
		// cleanup
		origami.touchHistory = [];
		origami.arrowLayer.removeChildren();
		origami.draw();
	}

	origami.decorate = function(nearest) {
		if (origami.touchHistory.length === 0) { return; }
		// do stuff
		origami.arrowLayer.removeChildren();
		if (nearest.vertex.index === origami.touchHistory[0].vertex.index) {
			return;
		}
		origami.arrowLayer.arcArrow(
			origami.touchHistory[0].vertex,
			nearest.vertex,
			{color:"#e53"}
		);
	}

	let _this = {};
	Object.defineProperty(_this, "mode", {
		get: function(){ return mode; },
		set: function(newMode){ mode = newMode; }
	});
	Object.defineProperty(_this, "origami", {
		get: function(){ return origami; }
	})
	return _this;
})();

document.querySelectorAll("[id^=mode]").forEach(b => b.onclick = function(){
	app.mode = b.id;
	document.querySelectorAll("[id^=mode]").forEach(b => b.className = "button");
	b.className = "button button-red";
});

document.querySelectorAll("[id^=switch-origami]")
	.forEach(b => b.onclick = function(){
		let path = b.id.substring(15).split("-");
		app.origami[path[0]][path[1]] = !app.origami[path[0]][path[1]];
		app.origami.draw();
		event.target.className = app.origami[path[0]][path[1]]
			? "button button-red" : "button";
	});
