let view14 = RabbitEar.svg.View("canvas-polygon-overlaps", 500, 500);

view14.rebuild = function(){
	let r = 100;
	let pad = view14.width * 0.15;

	let polys = Array.from(Array(6)).map(_ => {
		let center = [
			pad + Math.random() * (view14.width - pad*2), 
			pad + Math.random() * (view14.height - pad*2)
		];
		let points = Array.from(Array(12)).map(_ => center.map(p => p + Math.random()*r-r*0.5));
		return RabbitEar.math.Polygon.convexHull(points);
	});

	let overlaps = polys.map(_ => false);
	for(var i = 0; i < polys.length-1; i++){
		for(var j = i+1; j < polys.length; j++){
			if(polys[i].overlaps(polys[j])){
				overlaps[i] = true;
				overlaps[j] = true;
			}
		}
	}

	view14.removeChildren();
	polys.forEach((poly, i) => {
		let color = overlaps[i] ? "#ecb233" : "white";
		let polygon = RabbitEar.svg.polygon(poly.points);
		polygon.setAttribute("fill", color)
		polygon.setAttribute("stroke", "none");
		view14.appendChild(polygon);
	});
	polys.forEach((poly, i) => {
		let polygon = RabbitEar.svg.polygon(poly.points);
		let color = overlaps[i] ? "#e44f2a" : "black";
		polygon.setAttribute("fill", "none");
		polygon.setAttribute("stroke", color);
		polygon.setAttribute("stroke-width", 6);
		view14.appendChild(polygon);
	});
}
view14.rebuild();

view14.onMouseDown = function(mouse){
	view14.rebuild();
}
