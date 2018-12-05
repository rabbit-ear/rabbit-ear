let creaseEdges = RabbitEar.Origami();

creaseEdges.reset = function(){
	let e0 = [
		[Math.random() * 0.5, Math.random() * 0.5],
		[Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5]
	];
	let e1 = [
		[Math.random() * 0.5, Math.random() * 0.5 + 0.5],
		[Math.random() * 0.5 + 0.5, Math.random() * 0.5]
	];
	let cp = RabbitEar.bases.unitSquare;
	let once = RabbitEar.fold.axiom1(cp, e0[0], e0[1]);
	let result = RabbitEar.fold.axiom1(once, e1[0], e1[1]);
	creaseEdges.cp = result;
}
creaseEdges.reset();

creaseEdges.onMouseDown = function(mouse){
	creaseEdges.reset();
}