var G = RabbitEar.Geometry;

var origami = new OrigamiPaper("svgs").setPadding(0.02);
var folded = new OrigamiFold("svgs").setPadding(0.02);
// folded.style = { face:{ fillColor:{ gray:1.0, alpha:0.66 } } };
folded.mouseZoom = false;
// origami.markLayer = new origami.scope.Layer();
origami.markLayer = origami.group();
origami.touchPointsLayer = origami.group();
origami.arrowLayer = origami.group();
origami.svg.appendChild(origami.markLayer);
origami.svg.appendChild(origami.touchPointsLayer);
origami.svg.appendChild(origami.arrowLayer);
origami.touchPoints = [];

origami.convertLine = function(d, u){ return {point:{x:d*u.x, y:d*u.y}, direction:{x:u.y, y:u.x}}; }

origami.axiom = undefined;
origami.marks = [];
origami.lines = [];

// var markColor = origami.styles.byrne.yellow;//{gray:0.8};

origami.makeTouchPoint = function(location, radius, className){
	var x,y;
	if(location.x != undefined){ x = location.x; y = location.y; }
	else if(Array.isArray(location) && location.length > 1){ x = location[0]; y = location[1]; }
	var dot = this.circle(x, y, radius, className, 'touch-point-' + this.touchPoints.length);
	this.touchPointsLayer.appendChild(dot);
	this.touchPoints.push(dot);
}

origami.clearTouchPoints = function(){
	this.touchPoints = [];
	while(this.touchPointsLayer.lastChild) {
		this.touchPointsLayer.removeChild(this.touchPointsLayer.lastChild);
	}
}

origami.getPosition = function(svgElement){
	var x = svgElement.getAttribute('cx') != undefined ? svgElement.getAttribute('cx') : svgElement.getAttribute('x');
	var y = svgElement.getAttribute('cy') != undefined ? svgElement.getAttribute('cy') : svgElement.getAttribute('y');
	return { 'x':parseFloat(x), 'y':parseFloat(y) };
}


origami.setAxiom = function(number, marks, lines){
	origami.axiom = number;
	origami.marks = marks;
	origami.lines = lines;
	// marks is an array of points {x:_,y:_},
	// lines is an array of lines encoded as {d:number, u:{x:_,y:_}}
	// where u is the normal to the line and d*u is the point on the line nearest to the origin
	origami.clearTouchPoints();
	switch(origami.axiom){
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
			if(lines.length < 2){ throw "axiom 3 is expecting two marks"; }
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			var edge1 = origami.cp.boundary.clipLine(lines[1]);
			origami.makeTouchPoint(edge0.nodes[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge0.nodes[1], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge1.nodes[0], 0.015, 'line-touch-point');
			origami.makeTouchPoint(edge1.nodes[1], 0.015, 'line-touch-point');
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
	this.redraw();
}

origami.redraw = function(){
	origami.cp.clear();
	while(this.markLayer.lastChild) {
		this.markLayer.removeChild(this.markLayer.lastChild);
	}

	var crease;
	switch(this.axiom){
		case 1:
			crease = this.cp.creaseThroughPoints(this.marks[0], this.marks[1]).valley();
			break;
		case 2:
			crease = this.cp.creasePointToPoint(this.marks[0], this.marks[1]).valley();
			break;
		case 3:
			var m0 = this.cp.boundary.clipLine(this.lines[0]);
			var m1 = this.cp.boundary.clipLine(this.lines[1]);
			var creases = this.cp.creaseEdgeToEdge(m0, m1);
			crease = creases[0];
			if(crease == undefined){ return; }
			crease.valley();
			var path0 = this.line(m0.nodes[0].x, m0.nodes[0].y, m0.nodes[1].x, m0.nodes[1].y, 'yellow-line');
			var path1 = this.line(m1.nodes[0].x, m1.nodes[0].y, m1.nodes[1].x, m1.nodes[1].y, 'yellow-line');
			this.markLayer.appendChild(path0);
			this.markLayer.appendChild(path1);
			break;
		case 4:
			var m0 = this.cp.boundary.clipLine(this.lines[0]);
			crease = this.cp.creasePerpendicularThroughPoint(m0, this.marks[0]).valley();
			var path0 = this.line(m0.nodes[0].x, m0.nodes[0].y, m0.nodes[1].x, m0.nodes[1].y, 'yellow-line');
			this.markLayer.appendChild(path0);
			break;
		case 5:
			var m0 = this.cp.boundary.clipLine(this.lines[0]);
			crease = this.cp.creasePointToLine(this.marks[0], this.marks[1], m0)[0];
			if(crease == undefined){ return; }
			crease.valley();
			var path0 = this.line(m0.nodes[0].x, m0.nodes[0].y, m0.nodes[1].x, m0.nodes[1].y, 'yellow-line');
			this.markLayer.appendChild(path0);
			break;
		case 6:
			var m0 = this.cp.boundary.clipLine(this.lines[0]);
			var m1 = this.cp.boundary.clipLine(this.lines[1]);
			if(m0 == undefined || m1 == undefined){ return; }
			var creases = this.cp.creasePointsToLines(this.marks[0], this.marks[1], m0, m1);
			crease = creases[0];
			if(crease == undefined){ return; }
			crease.valley();
			var path0 = this.line(m0.nodes[0].x, m0.nodes[0].y, m0.nodes[1].x, m0.nodes[1].y, 'yellow-line');
			var path1 = this.line(m1.nodes[0].x, m1.nodes[0].y, m1.nodes[1].x, m1.nodes[1].y, 'yellow-line');
			this.markLayer.appendChild(path0);
			this.markLayer.appendChild(path1);
			break;
		case 7:
			var m0 = this.cp.boundary.clipLine(this.lines[0]);
			var m1 = this.cp.boundary.clipLine(this.lines[1]);
			crease = this.cp.creasePerpendicularPointOntoLine(this.marks[0], m0, m1);
			if(crease == undefined){ return; }
			crease.valley();
			var path0 = this.line(m0.nodes[0].x, m0.nodes[0].y, m0.nodes[1].x, m0.nodes[1].y, 'yellow-line');
			var path1 = this.line(m1.nodes[0].x, m1.nodes[0].y, m1.nodes[1].x, m1.nodes[1].y, 'yellow-line');
			this.markLayer.appendChild(path0);
			this.markLayer.appendChild(path1);
			break;

		}

		switch(this.axiom){
			case 2:
				var intersect = crease.nearestPointNormalTo({x:this.marks[0].x, y:this.marks[0].y});
				this.drawArrowAcross(crease, intersect);
				break;
			case 5:
				var intersect = crease.nearestPointNormalTo({x:this.marks[0].x, y:this.marks[0].y});
				this.drawArrowAcross(crease, intersect);
				break;
			case 6:
				var intersect1 = crease.nearestPointNormalTo({x:this.marks[0].x, y:this.marks[0].y});
				var intersect2 = crease.nearestPointNormalTo({x:this.marks[1].x, y:this.marks[1].y});
				this.drawArrowAcross(crease, intersect1);
				this.drawArrowAcross(crease, intersect2);
				break;
			case 7:
				var intersect = crease.nearestPointNormalTo({x:this.marks[0].x, y:this.marks[0].y});
				this.drawArrowAcross(crease, intersect);
				break;
			default:
				this.drawArrowAcross(crease);
				break;
		}

	this.updateFoldedState(this.cp);
	this.draw();
}

origami.updateFoldedState = function(cp){
	folded.cp = cp.copy();
	// var tableFace = folded.cp.nearest(this.marks[0].x, this.marks[0].y).face;
	// folded.draw( tableFace );
	folded.draw();
}

origami.onMouseDown = function(event){
	function pointsSimilar(a, b, epsilon){
		function epsilonEqual(a, b, epsilon){return ( Math.abs(a-b) < epsilon );}
		return epsilonEqual(a.x,b.x,epsilon) && epsilonEqual(a.y,b.y,epsilon);
	}
	for(var i = 0; i < this.touchPoints.length; i++){
		var tp = {x:parseFloat(this.touchPoints[i].getAttribute('cx')), y:parseFloat(this.touchPoints[i].getAttribute('cy'))};
		if(pointsSimilar(this.mouse.position, tp, 0.03)){
			this.selectedTouchPoint = this.touchPoints[i];
		}
	}
}

origami.onMouseMove = function(event){
	if(this.mouse.isPressed){
		if(this.mouse.isDragging && this.selectedTouchPoint !== undefined){
			this.selectedTouchPoint.setAttribute('cx', this.mouse.position.x);
			this.selectedTouchPoint.setAttribute('cy', this.mouse.position.y);
		}

		switch(this.axiom){
			case 1:
			case 2: this.marks = this.touchPoints.map(function(p){ return this.getPosition(p); },this); 
				break;
			case 3: this.lines = [
				new G.Edge(this.getPosition(this.touchPoints[0]), this.getPosition(this.touchPoints[1])).infiniteLine(),
				new G.Edge(this.getPosition(this.touchPoints[2]), this.getPosition(this.touchPoints[3])).infiniteLine()
			]; break;
			case 4: 
				this.marks = [this.getPosition(this.touchPoints[0])];
				this.lines = [
					new G.Edge(this.getPosition(this.touchPoints[1]), this.getPosition(this.touchPoints[2])).infiniteLine()
				]; break;
			case 5: 
				this.marks = [this.getPosition(this.touchPoints[0]), this.getPosition(this.touchPoints[1])];
				this.lines = [
					new G.Edge(this.getPosition(this.touchPoints[2]), this.getPosition(this.touchPoints[3])).infiniteLine()
				]; break;
			case 6: 
				this.marks = [this.getPosition(this.touchPoints[0]), this.getPosition(this.touchPoints[1])];
				this.lines = [
					new G.Edge(this.getPosition(this.touchPoints[2]), this.getPosition(this.touchPoints[3])).infiniteLine(),
					new G.Edge(this.getPosition(this.touchPoints[4]), this.getPosition(this.touchPoints[5])).infiniteLine()
				]; break;
			case 7: 
				this.marks = [this.getPosition(this.touchPoints[0])];
				this.lines = [
					new G.Edge(this.getPosition(this.touchPoints[1]), this.getPosition(this.touchPoints[2])).infiniteLine(),
					new G.Edge(this.getPosition(this.touchPoints[3]), this.getPosition(this.touchPoints[4])).infiniteLine()
				]; break;
		}
		this.redraw();
	}
}

	// {point:{x:, y:}, direction:{x:, y:}};


// intersect is a point on the line, the point which the arrow should be cast perpendicularly across
// when left undefined, intersect will be the midpoint of the line.
origami.drawArrowAcross = function(crease, crossing){
	if(crossing == undefined){ crossing = crease.midpoint(); }

	var creaseNormal = crease.vector().rotate90().normalize();
	var perpLine = {point:{x:crossing.x, y:crossing.y}, direction:{x:creaseNormal.x, y:creaseNormal.y}};
	var perpendicular = this.cp.boundary.clipLine(perpLine);
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
	while(this.arrowLayer.lastChild) {
		this.arrowLayer.removeChild(this.arrowLayer.lastChild);
	}

	// debug lines
	// var dbl = perpendicular.nodes;
	// this.arrowLayer.appendChild( this.line(dbl[0].x, dbl[0].y, dbl[1].x, dbl[1].y, 'yellow-line') );
	// this.arrowLayer.appendChild( this.line(arcEnds[0].x, arcEnds[0].y, arcEnds[1].x, arcEnds[1].y, 'yellow-line') );
	// this.arrowLayer.appendChild( this.line(crossing.x, crossing.y, crossing.add(toMiddleOfPage).x, crossing.add(toMiddleOfPage).y, 'blue-line') );


	var bez = this.bezier(arcEnds[0].x, arcEnds[0].y, controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, arcEnds[1].x, arcEnds[1].y, 'arrow-path');
	this.arrowLayer.appendChild(bez);

	arcEnds.forEach(function(point, i){
		// var tilt = vector.rotate( (i%2)*Math.PI ).rotate(0.35 * Math.pow(-1,i+1));
		var arrowVector = perpendicular.nodes[i].subtract(point).normalize();
		var arrowNormal = arrowVector.rotate90();
		var segments = [
			point.add(arrowNormal.scale(-arrowheadWidth*0.375)), 
			point.add(arrowNormal.scale(arrowheadWidth*0.375)), 
			point.add(arrowVector.scale(arrowheadLength))
		];
		var arrowhead = this.polygon(segments, 'arrowhead');
		this.arrowLayer.appendChild(arrowhead);
	},this);

}

var selectAxiom = function(n){
	for(var i = 1; i < 8; i++){
		document.getElementById("btn-axiom-"+i).checked = false;
		document.getElementById("btn-axiom-"+i).className = "btn btn-outline-light";
	}
	document.getElementById("btn-axiom-"+n).checked = true;
	document.getElementById("btn-axiom-"+n).className = "btn btn-outline-light active";
	switch(n){
		case 1: origami.setAxiom(1, [{x:0.5, y:0.0}, {x:0.0, y:0.5}], []); break;
		case 2: origami.setAxiom(2, [{x:0.5, y:0.0}, {x:0.0, y:0.5}], []); break;
		case 3: origami.setAxiom(3, [], [{point:{x:0.0, y:0.0}, direction:{x:1.0, y:0.0}}, {point:{x:0.0, y:0.0}, direction:{x:0.707, y:0.707}}]); break;
		case 4: origami.setAxiom(4, [{x:1.0, y:0.25},], [{point:{x:0.333, y:0.333}, direction:{x:0.0, y:1.0}}]); break;
		case 5: origami.setAxiom(5, [{x:0.666, y:0.125}, {x:1.0, y:1.0}], [{point:{x:0.333, y:0.0}, direction:{x:0.0, y:1.0}}]); break;
		case 6: origami.setAxiom(6, [{x:0.0, y:0.5}, {x:0.5, y:1.0}], [{point:{x:0.0, y:1.0}, direction:{x:0.707, y:-0.707}}, {point:{x:0.0, y:0.0}, direction:{x:0.707, y:0.707}}]); break;
		case 7: origami.setAxiom(7, [{x:1.0, y:0.5}], [{point:{x:1.0, y:0.0}, direction:{x:0.707, y:-0.35}}, {point:{x:0.0, y:0.0}, direction:{x:0.707, y:0.707}}]); break;
	}
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