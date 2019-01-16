let view = RabbitEar.svg.Image("canvas", 500, 500);

view.touches = [
	{pos: [0, 250], svg: RabbitEar.svg.circle(0, 0, 8)},
	{pos: [500, 250], svg: RabbitEar.svg.circle(0, 0, 8)},
];
view.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	view.appendChild(p.svg);
});

view.redraw = function(){
	view.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
}
view.redraw();

view.onMouseDown = function(mouse){
	let ep = view.width / 50;
	let down = view.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view.selected = found;
}

view.onMouseMove = function(mouse){
	if(mouse.isPressed && view.selected != null){
		view.touches[view.selected].pos = mouse.position;
		view.redraw();
	}
}
