let view14 = RabbitEar.svg.View("canvas-polygon-overlaps", 800, 500);
view14.COUNT = 4;

view14.speeds = Array.from(Array(view14.COUNT)).map(_ => Math.random() - 0.5)

view14.rebuild = function(){
	let r = 90;
	let pad = view14.width * 0.15;

	view14.centers = Array.from(Array(view14.COUNT)).map((_,i) => [
		view14.width/view14.COUNT*0.5 + i*view14.width/(view14.COUNT),
		view14.height * 0.5
	]);

	view14.polys = view14.centers.map(c => 
		RabbitEar.math.Polygon.regularPolygon( parseInt(Math.random()*2)+4, c[0], c[1], r)
	);

	view14.removeChildren();
	view14.polygonFills = view14.polys.map((poly, i) => {
		let polygon = RabbitEar.svg.polygon(poly.points);
		polygon.setAttribute("stroke", "none");
		view14.appendChild(polygon);
		return polygon;
	});
	view14.polygonLines = view14.polys.map((poly, i) => {
		let polygon = RabbitEar.svg.polygon(poly.points);
		polygon.setAttribute("fill", "none");
		polygon.setAttribute("stroke-width", 6);
		view14.appendChild(polygon);
		return polygon;
	});
}
view14.rebuild();

view14.update = function(){

	let overlaps = view14.polys.map(_ => false);
	for(var i = 0; i < view14.polys.length-1; i++){
		for(var j = i+1; j < view14.polys.length; j++){
			if(view14.polys[i].overlaps(view14.polys[j])){
				overlaps[i] = true;
				overlaps[j] = true;
			}
		}
	}
// 195783, ecb233, e44f2a
	view14.polygonFills.forEach((polygon, i) => {
		let color = overlaps[i] ? "#ecb233" : "white";
		polygon.setAttribute("fill", color)
		RabbitEar.svg.setPoints(polygon, view14.polys[i].points);
	})

	view14.polygonLines.forEach((polygon, i) => {
		let color = overlaps[i] ? "#e44f2a" : "#195783";
		polygon.setAttribute("stroke", color);
		RabbitEar.svg.setPoints(polygon, view14.polys[i].points);
	});
}
view14.update();

view14.animate = function(event){
	view14.polys = view14.polys.map((p,i) => {
		return p.rotate(0.025 * view14.speeds[i], view14.centers[i])
	});
	// console.log(rotated);
	view14.update();
	// console.log(event.time);
}
