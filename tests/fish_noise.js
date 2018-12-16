var fishSwim = RabbitEar.Origami("fish-noise");
fishSwim.a = 1.0 - Math.sqrt(0.5);
fishSwim.b = Math.sqrt(0.5);

fishSwim.reset = function(){
	fishSwim.cp = RabbitEar.bases.fish
}
fishSwim.reset();

fishSwim.animate = function(event) {
	var scale = .02;
	var sp = 1.5;
	var point1 = [fishSwim.a + Math.sin(sp*event.time*.8) * scale, fishSwim.a + Math.cos(sp*event.time*.895) * scale];
	var point2 = [fishSwim.b + Math.sin(sp*event.time*1.2) * scale, fishSwim.b + Math.sin(sp*event.time) * scale];
	fishSwim.cp.vertices_coords[4] = point1;
	fishSwim.cp.vertices_coords[5] = point2;
	fishSwim.draw();
}
