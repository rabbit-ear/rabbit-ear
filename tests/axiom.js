let origami = RabbitEar.Origami("canvas-axiom-1");
origami.cp = RabbitEar.CreasePattern(RabbitEar.bases.square);

for (let i = 0; i < 10; i++) {
	let crease = origami.axiom1([Math.random(), Math.random()], [Math.random()-0.5, Math.random()-0.5]);
	if (Math.random() < 0.5) { crease.forEach(c => c.mountain()); } 
	else{ crease.forEach(c => c.valley()); }
}

origami.draw();