var origami = RabbitEar.Origami("svgs");
var folded = RabbitEar.Origami("svgs");

origami.markLayer = RabbitEar.svg.group();
origami.interactionLayer = RabbitEar.svg.group();
origami.arrowLayer = RabbitEar.svg.group();

origami.appendChild(origami.markLayer);
origami.appendChild(origami.interactionLayer);
origami.appendChild(origami.arrowLayer);
origami.touchPoints = [];

origami.axiom = undefined;
origami.marks = [];
origami.lines = [];

// origami.args = {
// 	1:{ marks: [[0.5, 0.0], [0.0, 0.5]],
// 	    lines: [] },
// 	2:{ marks: [[0.5, 0.0], [0.0, 0.5]],
// 	    lines: [] },
// 	3:{ marks: [],
// 	    lines: [[[0.0, 0.0], [1.0, 0.0]], [[0.0, 0.0], [0.707, 0.707]]] },
// 	4:{ marks: [[1.0, 0.25]],
// 	    lines: [[[0.333, 0.333], [0.0, 1.0]]] },
// 	5:{ marks: [[0.666, 0.125], [1.0, 1.0]],
// 	    lines: [[[0.333, 0.0], [0.0, 1.0]]] },
// 	6:{ marks: [[0.0, 0.5], [0.5, 1.0]],
// 	    lines: [[[0.0, 1.0], [0.707, -0.707]], [[0.0, 0.0], [0.707, 0.707]]] },
// 	7:{ marks: [[1.0, 0.5]],
// 	    lines: [[[1.0, 0.0], [0.707, -0.35]], [[0.0, 0.0], [0.707, 0.707]]] }
// };


origami.args = {
	1: {
		marks: [{x:0.5, y:0.0}, {x:0.0, y:0.5}],
		lines: []
	},
	2: {
		marks: [{x:0.5, y:0.0}, {x:0.0, y:0.5}],
		lines: []
	},
	3: {
		marks: [],
		lines: [
			{point:{x:0.0, y:0.0}, vector:{x:1.0, y:0.0}},
			{point:{x:0.0, y:0.0}, vector:{x:0.707, y:0.707}}
		]
	},
	4: {
		marks: [{x:1.0, y:0.25},],
		lines: [{point:{x:0.333, y:0.333}, vector:{x:0.0, y:1.0}}]
	},
	5: {
		marks: [{x:0.666, y:0.125}, {x:1.0, y:1.0}],
		lines: [{point:{x:0.333, y:0.0}, vector:{x:0.0, y:1.0}}]
	},
	6: {
		marks: [{x:0.0, y:0.5}, {x:0.5, y:1.0}],
		lines: [
			{point:{x:0.0, y:1.0}, vector:{x:0.707, y:-0.707}},
			{point:{x:0.0, y:0.0}, vector:{x:0.707, y:0.707}}
		]
	},
	7: {
		marks: [{x:1.0, y:0.5}],
		lines: [
			{point:{x:1.0, y:0.0}, vector:{x:0.707, y:-0.35}},
			{point:{x:0.0, y:0.0}, vector:{x:0.707, y:0.707}}
		]
	}
}

// two ways of resetting canvas
// 1: hard reset, axiom has changed
origami.setNewAxiom = function(axiom) {
	origami.axiom = axiom;
	origami.buildInteractionLayer(axiom, origami.args[axiom].marks, origami.args[axiom].lines);
	origami.update();
}
// 2: soft reset, axiom params updated
origami.update = function() {
	// clear and re-fold axiom
	origami.cp = RabbitEar.CreasePattern(RabbitEar.bases.square);
	origami.foldAxiom(origami.axiom, origami.args[origami.axiom].marks, origami.args[origami.axiom].lines);
	// draw axiom helper lines
	RabbitEar.svg.removeChildren(origami.markLayer);
	origami.args[origami.axiom].lines
		.map(line => origami.cp.boundary.clipLine(line))
		.forEach(line => RabbitEar.svg.line(line[0][0], line[0][1], line[1][0], line[1][1], "yellow-line", null, origami.markLayer));
	// update folded state
	folded.cp = RabbitEar.CreasePattern(JSON.parse(JSON.stringify(origami.cp.json)));
	folded.fold();
}

// var markColor = origami.styles.byrne.yellow;//{gray:0.8};
origami.makeTouchPoint = function(location, radius, className){
	var x,y;
	if (location.x != undefined){ x = location.x; y = location.y; }
	else if (Array.isArray(location) && location.length > 1){ x = location[0]; y = location[1]; }
	var dot = RabbitEar.svg.circle(x, y, radius, className, 'touch-point-' + origami.touchPoints.length);
	origami.interactionLayer.appendChild(dot);
	origami.touchPoints.push(dot);
}

origami.clearInteractionLayer = function(){
	origami.touchPoints = [];
	while (origami.interactionLayer.lastChild) {
		origami.interactionLayer.removeChild(origami.interactionLayer.lastChild);
	}
}

// get the X,Y position of an SVG element from its DOM level attributes
origami.getPosition = function(svgElement) {
	var x = svgElement.getAttribute('cx') != undefined ? svgElement.getAttribute('cx') : svgElement.getAttribute('x');
	var y = svgElement.getAttribute('cy') != undefined ? svgElement.getAttribute('cy') : svgElement.getAttribute('y');
	return [parseFloat(x), parseFloat(y)];
}

origami.foldAxiom = function(axiom, marks, lines) {
	switch (axiom){
		case 1: origami.cp.axiom1(...marks).valley(); break;
		case 2: origami.cp.axiom2(...marks).valley(); break;
		case 4: origami.cp.axiom4(...marks, ...lines).valley(); break;
		case 7: origami.cp.axiom7(...marks, ...lines).valley(); break;
		case 3:
			var creases = origami.cp.axiom3(...lines);
			// let crease = creases[0];
			// console.log("creases", creases);
			// if(crease == undefined){ return; }
			creases.valley();
			break;
		case 5:
			origami.cp.axiom5(...marks, ...lines);
			// let crease = creases[0];
			creases.valley();
			break;
		case 6:
			origami.cp.axiom6(...marks, ...lines);
			// let crease = creases[0];
			// if(crease == undefined){ return; }
			creases.valley();
			break;
	}
}

origami.buildInteractionLayer = function(axiom, marks, lines){
	// marks is an array of points [x,y],
	// lines is an array of lines encoded as {d:number, u:{x:_,y:_}}
	origami.clearInteractionLayer();
	switch (axiom){
		case 1:
			if(marks.length < 2){ throw "axiom 1 is expecting two marks"; }
			origami.makeTouchPoint(marks[0], 0.015, 'mark-touch-point');
			origami.makeTouchPoint(marks[1], 0.015, 'mark-touch-point');
			break;
		case 2:
			if(marks.length < 2){ throw "axiom 2 is expecting two marks"; }
			origami.makeTouchPoint(marks[0], 0.015, 'mark-touch-point');
			origami.makeTouchPoint(marks[1], 0.015, 'mark-touch-point');
			break;
		case 3:
			if(lines.length < 2){ throw "axiom 3 is expecting two lines"; }
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			var edge1 = origami.cp.boundary.clipLine(lines[1]);
			origami.makeTouchPoint(edge0[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge0[1], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge1[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge1[1], 0.015, 'line-touch-point');
			break;
		case 4:
			if(marks.length < 1 && lines.length < 1){ throw "axiom 4 is expecting one mark and one line"; }
			origami.makeTouchPoint(marks[0], 0.015, 'mark-touch-point');
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			origami.makeTouchPoint(edge0.nodes[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge0.nodes[1], 0.015, 'line-touch-point');
			break;
		case 5:
			if(marks.length < 2 && lines.length < 1){ throw "axiom 5 is expecting two marks and one line"; }
			origami.makeTouchPoint(marks[0], 0.015, 'mark-touch-point');
			origami.makeTouchPoint(marks[1], 0.015, 'mark-touch-point');
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			origami.makeTouchPoint(edge0.nodes[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge0.nodes[1], 0.015, 'line-touch-point');
			break;
		case 6:
			if(marks.length < 2 && lines.length < 2){ throw "axiom 6 is expecting two marks and two lines"; }
			origami.makeTouchPoint(marks[0], 0.015, 'mark-touch-point');
			origami.makeTouchPoint(marks[1], 0.015, 'mark-touch-point');
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			var edge1 = origami.cp.boundary.clipLine(lines[1]);
			origami.makeTouchPoint(edge0.nodes[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge0.nodes[1], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge1.nodes[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge1.nodes[1], 0.015, 'line-touch-point');
			break;
		case 7:
			if(marks.length < 1 && lines.length < 2){ throw "axiom 7 is expecting one mark and two lines"; }
			origami.makeTouchPoint(marks[0], 0.015, 'mark-touch-point');
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			var edge1 = origami.cp.boundary.clipLine(lines[1]);
			origami.makeTouchPoint(edge0.nodes[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge0.nodes[1], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge1.nodes[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge1.nodes[1], 0.015, 'line-touch-point');
			break;
	}
}

origami.drawArrowsForAxiom = function(axiom){

	switch (axiom){
		case 2:
			var intersect = crease.nearestPointNormalTo({x:origami.marks[0].x, y:origami.marks[0].y});
			origami.drawArrowAcross(crease, intersect);
			break;
		case 5:
			var intersect = crease.nearestPointNormalTo({x:origami.marks[0].x, y:origami.marks[0].y});
			origami.drawArrowAcross(crease, intersect);
			break;
		case 6:
			var intersect1 = crease.nearestPointNormalTo({x:origami.marks[0].x, y:origami.marks[0].y});
			var intersect2 = crease.nearestPointNormalTo({x:origami.marks[1].x, y:origami.marks[1].y});
			origami.drawArrowAcross(crease, intersect1);
			origami.drawArrowAcross(crease, intersect2);
			break;
		case 7:
			var intersect = crease.nearestPointNormalTo({x:origami.marks[0].x, y:origami.marks[0].y});
			origami.drawArrowAcross(crease, intersect);
			break;
		default:
			origami.drawArrowAcross(crease);
			break;
	}
}

origami.onMouseDown = function(event){
	function pointsSimilar(a, b, epsilon){
		function epsilonEqual(a, b, epsilon){return ( Math.abs(a-b) < epsilon );}
		return epsilonEqual(a.x,b.x,epsilon) && epsilonEqual(a.y,b.y,epsilon);
	}
	for (var i = 0; i < origami.touchPoints.length; i++){
		var tp = {
			x: parseFloat(origami.touchPoints[i].getAttribute('cx')), 
			y: parseFloat(origami.touchPoints[i].getAttribute('cy'))
		};
		if (pointsSimilar(origami.mouse, tp, 0.03)){
			origami.selectedTouchPoint = origami.touchPoints[i];
		}
	}
}

origami.onMouseMove = function(event){
	if (!origami.mouse.isPressed){ return; }

	if (origami.selectedTouchPoint !== undefined){
		origami.selectedTouchPoint.setAttribute('cx', origami.mouse.x);
		origami.selectedTouchPoint.setAttribute('cy', origami.mouse.y);
	}

	switch(origami.axiom){
		case 1:
		case 2: origami.args[origami.axiom].marks = origami.touchPoints
			.map(p => origami.getPosition(p));
			break;
		case 3: origami.args[origami.axiom].lines = [
				RabbitEar.math.Line.fromPoints(origami.getPosition(origami.touchPoints[0]), origami.getPosition(origami.touchPoints[1])),
				RabbitEar.math.Line.fromPoints(origami.getPosition(origami.touchPoints[2]), origami.getPosition(origami.touchPoints[3]))
			];
			break;
		case 4: 
			origami.marks = [origami.getPosition(origami.touchPoints[0])];
			origami.lines = [
				new G.Edge(origami.getPosition(origami.touchPoints[1]), origami.getPosition(origami.touchPoints[2])).infiniteLine()
			]; break;
		case 5: 
			origami.marks = [origami.getPosition(origami.touchPoints[0]), origami.getPosition(origami.touchPoints[1])];
			origami.lines = [
				new G.Edge(origami.getPosition(origami.touchPoints[2]), origami.getPosition(origami.touchPoints[3])).infiniteLine()
			]; break;
		case 6: 
			origami.marks = [origami.getPosition(origami.touchPoints[0]), origami.getPosition(origami.touchPoints[1])];
			origami.lines = [
				new G.Edge(origami.getPosition(origami.touchPoints[2]), origami.getPosition(origami.touchPoints[3])).infiniteLine(),
				new G.Edge(origami.getPosition(origami.touchPoints[4]), origami.getPosition(origami.touchPoints[5])).infiniteLine()
			]; break;
		case 7: 
			origami.marks = [origami.getPosition(origami.touchPoints[0])];
			origami.lines = [
				new G.Edge(origami.getPosition(origami.touchPoints[1]), origami.getPosition(origami.touchPoints[2])).infiniteLine(),
				new G.Edge(origami.getPosition(origami.touchPoints[3]), origami.getPosition(origami.touchPoints[4])).infiniteLine()
			]; break;
	}
	origami.update();
}


// intersect is a point on the line, the point which the arrow should be cast perpendicularly across
// when left undefined, intersect will be the midpoint of the line.
origami.drawArrowAcross = function(crease, crossing){
	return;
	if(crossing == undefined){ crossing = crease.midpoint(); }

	var creaseNormal = crease.vector().rotate90().normalize();
	var perpLine = {
		point:{x:crossing.x, y:crossing.y},
		vector:{x:creaseNormal.x, y:creaseNormal.y}
	};
	var perpendicular = origami.cp.boundary.clipLine(perpLine);
	var shortLength = perpendicular.nodes
		.map(function(n){ return crossing.distanceTo(n); },this)
		.sort(function(a,b){ return a-b; })
		.shift();
	perpendicular.nodes = perpendicular.nodes.map(function(n){
		var newLength = n.subtract(crossing).normalize().scale(shortLength);
		return crossing.add(newLength);
	},this);

	var toMiddleOfPage = new G.XY(0.5 - crossing.x, 0.5 - crossing.y);
	var arrowPerp = (toMiddleOfPage.cross(creaseNormal) < 0) ? creaseNormal.rotate90() : creaseNormal.rotate270();

	var arrowheadWidth = 0.05;
	var arrowheadLength = 0.075;

	var arcBend = 0.1;
	// var arcMid = crossing.add(arrowPerp.scale(perpendicular.length() * arcBend + arrowheadLength*0.2));
	var arcEnds = perpendicular.nodes
		.map(function(n){
			var bezierTarget = crossing.add(arrowPerp.scale(perpendicular.length() * arcBend * 2));
			var nudge = bezierTarget.subtract(n).normalize().scale(arrowheadLength + arrowheadLength*0.25);
			return n.add(nudge);
		},this);

	var controlTarget = crossing.add(arrowPerp.scale(perpendicular.length() * (arcBend*2) + arrowheadLength*0.2));
	var controlPoints = arcEnds.map(function(p){
		var distance = p.distanceTo(controlTarget);
		var vector = controlTarget.subtract(p).normalize().scale(distance*0.666);
		return p.add(vector);
	},this);

	// draw geometry
	while(origami.arrowLayer.lastChild) {
		origami.arrowLayer.removeChild(origami.arrowLayer.lastChild);
	}

	// debug lines
	// var dbl = perpendicular.nodes;
	// this.arrowLayer.appendChild( this.line(dbl[0].x, dbl[0].y, dbl[1].x, dbl[1].y, 'yellow-line') );
	// this.arrowLayer.appendChild( this.line(arcEnds[0].x, arcEnds[0].y, arcEnds[1].x, arcEnds[1].y, 'yellow-line') );
	// this.arrowLayer.appendChild( this.line(crossing.x, crossing.y, crossing.add(toMiddleOfPage).x, crossing.add(toMiddleOfPage).y, 'blue-line') );


	var bez = RabbitEar.svg.bezier(arcEnds[0].x, arcEnds[0].y, controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, arcEnds[1].x, arcEnds[1].y, 'arrow-path');
	origami.arrowLayer.appendChild(bez);

	arcEnds.forEach(function(point, i){
		// var tilt = vector.rotate( (i%2)*Math.PI ).rotate(0.35 * Math.pow(-1,i+1));
		var arrowVector = perpendicular.nodes[i].subtract(point).normalize();
		var arrowNormal = arrowVector.rotate90();
		var segments = [
			point.add(arrowNormal.scale(-arrowheadWidth*0.375)), 
			point.add(arrowNormal.scale(arrowheadWidth*0.375)), 
			point.add(arrowVector.scale(arrowheadLength))
		];
		var arrowhead = RabbitEar.svg.polygon(segments, 'arrowhead');
		this.arrowLayer.appendChild(arrowhead);
	},this);

}

var selectAxiom = function(n){
	// update DOM
	for(var i = 1; i < 8; i++){
		document.getElementById("btn-axiom-"+i).checked = false;
		document.getElementById("btn-axiom-"+i).className = "btn btn-outline-light";
	}
	document.getElementById("btn-axiom-"+n).checked = true;
	document.getElementById("btn-axiom-"+n).className = "btn btn-outline-light active";
	// update model
	origami.setNewAxiom(n);
}

var whichAxiom = function(){
	for(var i = 1; i < 8; i++){
		if(document.getElementById("btn-axiom-"+i).className.indexOf("active") !== -1){ return i; }
	}
	return 0;
}

document.getElementById("btn-axiom-1").onclick = function(){ selectAxiom(1); }
document.getElementById("btn-axiom-2").onclick = function(){ selectAxiom(2); }
document.getElementById("btn-axiom-3").onclick = function(){ selectAxiom(3); }
document.getElementById("btn-axiom-4").onclick = function(){ selectAxiom(4); }
document.getElementById("btn-axiom-5").onclick = function(){ selectAxiom(5); }
document.getElementById("btn-axiom-6").onclick = function(){ selectAxiom(6); }
document.getElementById("btn-axiom-7").onclick = function(){ selectAxiom(7); }

selectAxiom(1);