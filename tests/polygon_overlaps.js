let overlap = RabbitEar.svg.Image("canvas-polygon-overlaps", 800, 500);
overlap.COUNT = 4;

overlap.speeds = Array.from(Array(overlap.COUNT)).map(_ => Math.random() - 0.5)

overlap.rebuild = function(){
	let r = 83;
	let pad = overlap.width * 0.15;

	overlap.centers = Array.from(Array(overlap.COUNT)).map((_,i) => [
		overlap.width/overlap.COUNT*0.5 + i*overlap.width/(overlap.COUNT),
		overlap.height * 0.5
	]);

	overlap.polys = overlap.centers.map(c => 
		RabbitEar.math.Polygon.regularPolygon( parseInt(Math.random()*2)+4, c[0], c[1], r)
	);

	overlap.removeChildren();
	overlap.polygonFills = overlap.polys.map((poly, i) => {
		let polygon = RabbitEar.svg.polygon(poly.points);
		polygon.setAttribute("stroke", "none");
		overlap.appendChild(polygon);
		return polygon;
	});
	overlap.polygonLines = overlap.polys.map((poly, i) => {
		let polygon = RabbitEar.svg.polygon(poly.points);
		polygon.setAttribute("fill", "none");
		polygon.setAttribute("stroke-width", 6);
		overlap.appendChild(polygon);
		return polygon;
	});
}
overlap.rebuild();

overlap.update = function(){

	let polysOverlap = overlap.polys.map(_ => false);
	for(var i = 0; i < overlap.polys.length-1; i++){
		for(var j = i+1; j < overlap.polys.length; j++){
			if(overlap.polys[i].overlaps(overlap.polys[j])){
				polysOverlap[i] = true;
				polysOverlap[j] = true;
			}
		}
	}
// 195783, ecb233, e44f2a
	overlap.polygonFills.forEach((polygon, i) => {
		let color = polysOverlap[i] ? "#ecb233" : "white";
		polygon.setAttribute("fill", color)
		RabbitEar.svg.setPoints(polygon, overlap.polys[i].points);
	})

	overlap.polygonLines.forEach((polygon, i) => {
		let color = polysOverlap[i] ? "#e44f2a" : "#195783";
		polygon.setAttribute("stroke", color);
		RabbitEar.svg.setPoints(polygon, overlap.polys[i].points);
	});
}
overlap.update();

overlap.animate = function(event){
	overlap.polys = overlap.polys.map((p,i) => {
		return p.rotate(0.025 * overlap.speeds[i], overlap.centers[i])
	});
	// console.log(rotated);
	overlap.update();
	// console.log(event.time);
}
