var folded = new OrigamiFold("canvas-2").setPadding(0.02);
var origami = new OrigamiPaper("canvas-1").setPadding(0.02);
folded.style = { face:{ fillColor:{ gray:1.0, alpha:0.66 } } };
folded.mouseZoom = false;
origami.markLayer = new origami.scope.Layer();

origami.convertLine = function(d, u){ return new Line(d*u.x, d*u.y, u.y, u.x); }

origami.axiom = undefined;
origami.marks = [];
origami.lines = [];

var markColor = origami.styles.byrne.yellow;//{gray:0.8};

origami.setAxiom = function(number, marks, lines){
	var lineTouchPointStyles = {strokeColor:markColor, fillColor:markColor, radius:0.005};
	var markTouchPointStyles = {strokeColor:this.styles.byrne.yellow, fillColor:this.styles.byrne.yellow, radius:0.015};
	// var lineTouchPointStyles = {strokeColor:markColor, fillColor:{gray:1.0}};
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
			origami.makeTouchPoint(marks[0], markTouchPointStyles);
			origami.makeTouchPoint(marks[1], markTouchPointStyles);
			break;
		case 2:
			if(marks.length < 2){ throw "axiom 2 is expecting two marks"; }
			origami.makeTouchPoint(marks[0], markTouchPointStyles);
			origami.makeTouchPoint(marks[1], markTouchPointStyles);
			break;
		case 3:
			if(lines.length < 2){ throw "axiom 3 is expecting two marks"; }
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			var edge1 = origami.cp.boundary.clipLine(lines[1]);
			origami.makeTouchPoint(edge0.nodes[0], lineTouchPointStyles);
			origami.makeTouchPoint(edge0.nodes[1], lineTouchPointStyles);
			origami.makeTouchPoint(edge1.nodes[0], lineTouchPointStyles);
			origami.makeTouchPoint(edge1.nodes[1], lineTouchPointStyles);
			break;
		case 4:
			if(marks.length < 1 && lines.length < 1){ throw "axiom 4 is expecting one mark and one line"; }
			origami.makeTouchPoint(marks[0], markTouchPointStyles);
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			origami.makeTouchPoint(edge0.nodes[0], lineTouchPointStyles);
			origami.makeTouchPoint(edge0.nodes[1], lineTouchPointStyles);
			break;
		case 5:
			if(marks.length < 2 && lines.length < 1){ throw "axiom 5 is expecting two marks and one line"; }
			origami.makeTouchPoint(marks[0], markTouchPointStyles);
			origami.makeTouchPoint(marks[1], markTouchPointStyles);
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			origami.makeTouchPoint(edge0.nodes[0], lineTouchPointStyles);
			origami.makeTouchPoint(edge0.nodes[1], lineTouchPointStyles);
			break;
		case 6:
			if(marks.length < 2 && lines.length < 2){ throw "axiom 6 is expecting two marks and two lines"; }
			origami.makeTouchPoint(marks[0], markTouchPointStyles);
			origami.makeTouchPoint(marks[1], markTouchPointStyles);
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			var edge1 = origami.cp.boundary.clipLine(lines[1]);
			origami.makeTouchPoint(edge0.nodes[0], lineTouchPointStyles);
			origami.makeTouchPoint(edge0.nodes[1], lineTouchPointStyles);
			origami.makeTouchPoint(edge1.nodes[0], lineTouchPointStyles);
			origami.makeTouchPoint(edge1.nodes[1], lineTouchPointStyles);
			break;
		case 7:
			if(marks.length < 1 && lines.length < 2){ throw "axiom 7 is expecting one mark and two lines"; }
			origami.makeTouchPoint(marks[0], markTouchPointStyles);
			var edge0 = origami.cp.boundary.clipLine(lines[0]);
			var edge1 = origami.cp.boundary.clipLine(lines[1]);
			origami.makeTouchPoint(edge0.nodes[0], lineTouchPointStyles);
			origami.makeTouchPoint(edge0.nodes[1], lineTouchPointStyles);
			origami.makeTouchPoint(edge1.nodes[0], lineTouchPointStyles);
			origami.makeTouchPoint(edge1.nodes[1], lineTouchPointStyles);
			break;
	}
	this.redraw();
}

origami.redraw = function(){
	origami.cp.clear();
	paper = this.scope;
	this.markLayer.removeChildren();
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
			this.markLayer.activate();
			var path0 = new this.scope.Path(m0.nodes[0], m0.nodes[1]);
			var path1 = new this.scope.Path(m1.nodes[0], m1.nodes[1]);
			path0.strokeWidth = 0.01;
			path1.strokeWidth = 0.01;
			path0.strokeColor = markColor;
			path1.strokeColor = markColor;
			break;
		case 4:
			var m0 = this.cp.boundary.clipLine(this.lines[0]);
			crease = this.cp.creasePerpendicularThroughPoint(m0, this.marks[0]).valley();
			this.markLayer.activate();
			var path0 = new this.scope.Path(m0.nodes[0], m0.nodes[1]);
			path0.strokeWidth = 0.01;
			path0.strokeColor = markColor;
			break;
		case 5:
			var m0 = this.cp.boundary.clipLine(this.lines[0]);
			crease = this.cp.creasePointToLine(this.marks[0], this.marks[1], m0)[0];
			if(crease == undefined){ return; }
			crease.valley();
			this.markLayer.activate();
			var path0 = new this.scope.Path(m0.nodes[0], m0.nodes[1]);
			path0.strokeWidth = 0.01;
			path0.strokeColor = markColor;
			break;
		case 6:
			var m0 = this.cp.boundary.clipLine(this.lines[0]);
			var m1 = this.cp.boundary.clipLine(this.lines[1]);
			if(m0 == undefined || m1 == undefined){ return; }
			var creases = this.cp.creasePointsToLines(this.marks[0], this.marks[1], m0, m1);
			crease = creases[0];
			if(crease == undefined){ return; }
			crease.valley();
			this.markLayer.activate();
			var path0 = new this.scope.Path(m0.nodes[0], m0.nodes[1]);
			var path1 = new this.scope.Path(m1.nodes[0], m1.nodes[1]);
			path0.strokeWidth = 0.01;
			path1.strokeWidth = 0.01;
			path0.strokeColor = markColor;
			path1.strokeColor = markColor;
			break;
		case 7:
			var m0 = this.cp.boundary.clipLine(this.lines[0]);
			var m1 = this.cp.boundary.clipLine(this.lines[1]);
			crease = this.cp.creasePerpendicularPointOntoLine(this.marks[0], m0, m1);
			if(crease == undefined){ return; }
			crease.valley();
			this.markLayer.activate();
			var path0 = new this.scope.Path(m0.nodes[0], m0.nodes[1]);
			var path1 = new this.scope.Path(m1.nodes[0], m1.nodes[1]);
			path0.strokeWidth = 0.01;
			path1.strokeWidth = 0.01;
			path0.strokeColor = markColor;
			path1.strokeColor = markColor;
			break;

		}

		if(this.arrowLayer == undefined){ this.arrowLayer = new this.scope.Layer(); }
		this.arrowLayer.activate();
		this.arrowLayer.removeChildren();
		switch(this.axiom){
			case 2:
				var intersect = crease.nearestPointNormalTo(new XY(this.marks[0].x, this.marks[0].y));
				this.drawArrowAcross(crease, intersect);
				break;
			case 5:
				var intersect = crease.nearestPointNormalTo(new XY(this.marks[0].x, this.marks[0].y));
				this.drawArrowAcross(crease, intersect);
				break;
			case 6:
				var intersect1 = crease.nearestPointNormalTo(new XY(this.marks[0].x, this.marks[0].y));
				var intersect2 = crease.nearestPointNormalTo(new XY(this.marks[1].x, this.marks[1].y));
				this.drawArrowAcross(crease, intersect1);
				this.drawArrowAcross(crease, intersect2);
				break;
			case 7:
				var intersect = crease.nearestPointNormalTo(new XY(this.marks[0].x, this.marks[0].y));
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

origami.onMouseMove = function(event){
	if(this.mouse.isPressed){
		switch(this.axiom){
			case 1:
			case 2: this.marks = this.touchPoints.map(function(tp){return tp.position }); break;
			case 3: this.lines = [
				new Edge(this.touchPoints[0].position, this.touchPoints[1].position).infiniteLine(),
				new Edge(this.touchPoints[2].position, this.touchPoints[3].position).infiniteLine()
			]; break;
			case 4: 
				this.marks = [this.touchPoints[0].position];
				this.lines = [
					new Edge(this.touchPoints[1].position, this.touchPoints[2].position).infiniteLine()
				]; break;
			case 5: 
				this.marks = [this.touchPoints[0].position, this.touchPoints[1].position];
				this.lines = [
					new Edge(this.touchPoints[2].position, this.touchPoints[3].position).infiniteLine()
				]; break;
			case 6: 
				this.marks = [this.touchPoints[0].position, this.touchPoints[1].position];
				this.lines = [
					new Edge(this.touchPoints[2].position, this.touchPoints[3].position).infiniteLine(),
					new Edge(this.touchPoints[4].position, this.touchPoints[5].position).infiniteLine()
				]; break;
			case 7: 
				this.marks = [this.touchPoints[0].position];
				this.lines = [
					new Edge(this.touchPoints[1].position, this.touchPoints[2].position).infiniteLine(),
					new Edge(this.touchPoints[3].position, this.touchPoints[4].position).infiniteLine()
				]; break;
		}
		this.redraw();
	}
}


// intersect is a point on the line, the point which the arrow should be cast perpendicularly across
// when left undefined, intersect will be the midpoint of the line.
origami.drawArrowAcross = function(crease, crossing){
	paper = this.scope;

	if(crossing == undefined){ crossing = crease.midpoint(); }
	var creaseNormal = crease.vector().rotate90().normalize();
	var perpLine = new Line(crossing, creaseNormal);
	var perpendicular = this.cp.boundary.clipLine(perpLine);
	var shortLength = perpendicular.nodes
		.map(function(n){ return crossing.distanceTo(n); },this)
		.sort(function(a,b){ return a-b; })
		.shift();
	perpendicular.nodes = perpendicular.nodes.map(function(n){
		var newLength = n.subtract(crossing).normalize().scale(shortLength);
		return crossing.add(newLength);
	},this);

	var toMiddleOfPage = new XY(0.5, 0.5).subtract(crossing);
	var arrowPerp = (toMiddleOfPage.cross(creaseNormal) < 0) ? creaseNormal.rotate90() : creaseNormal.rotate270();

	var arrowheadWidth = 0.05;
	var arrowheadLength = 0.075;

	var arcBend = 0.1;
	var arcMid = crossing.add(arrowPerp.scale(perpendicular.length() * arcBend + arrowheadLength*0.2));
	var arcEnds = perpendicular.nodes
		.map(function(n){
			var bezierTarget = crossing.add(arrowPerp.scale(perpendicular.length() * arcBend * 2));
			var nudge = bezierTarget.subtract(n).normalize().scale(arrowheadLength + arrowheadLength*0.25);
			return n.add(nudge);
		},this);


	// debug lines
	// new this.scope.Path({segments:perpendicular.nodes, strokeColor:this.styles.byrne.red, strokeWidth:0.005});
	// new this.scope.Path({segments:arcEnds, strokeColor:markColor, strokeWidth:0.005});
	// new this.scope.Path({segments:[crossing, crossing.add(toMiddleOfPage)], strokeColor:this.styles.byrne.blue, strokeWidth:0.005})

	// curved arrow arc
	var color = this.styles.byrne.red;
	new this.scope.Path.Arc({from:arcEnds[0], through:arcMid, to:arcEnds[1], strokeColor:color, strokeWidth:0.01});

	arcEnds.forEach(function(point, i){
		// var tilt = vector.rotate( (i%2)*Math.PI ).rotate(0.35 * Math.pow(-1,i+1));
		var arrowVector = perpendicular.nodes[i].subtract(point).normalize();
		var arrowNormal = arrowVector.rotate90();
		var arrowhead = new this.scope.Path({segments: [
			point.add(arrowNormal.scale(-arrowheadWidth*0.375)), 
			point.add(arrowNormal.scale(arrowheadWidth*0.375)), 
			point.add(arrowVector.scale(arrowheadLength))
			], closed: true });
		arrowhead.fillColor = color;
		arrowhead.strokeColor = null;
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
		case 3: origami.setAxiom(3, [], [new Line(0.0, 0.0, 1.0, 0.0), new Line(0.0, 0.0, 0.707, 0.707)]); break;
		case 4: origami.setAxiom(4, [new XY(1.0, 0.25),], [new Line(0.0, 0.0, 0.0, 1.0)]); break;
		case 5: origami.setAxiom(5, [new XY(0.666, 0.125), new XY(1, 1)], [new Line(0.0, 0.0, 0.0, 1.0)]); break;
		case 6: origami.setAxiom(6, [new XY(0.0, 0.5), new XY(0.5, 1.0)], [new Line(0.0, 1.0, 0.707, -0.707), new Line(0.0, 0.0, 0.707, 0.707)]); break;
		case 7: origami.setAxiom(7, [new XY(1, 0.5)], [new Line(1, 0, 0.707, -0.35), new Line(0.0, 0.0, 0.707, 0.707)]); break;
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