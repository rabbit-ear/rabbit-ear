
var origamiFolds = [];
var origamiPapers = [];
var paragraphText = [];

var NUMBER_OF_SOLUTIONS = 5;

var showWarning = function(message){
	document.getElementById("alert-div").innerHTML = '<div class="alert alert-warning alert-dismissible" role="alert">'+message+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
}

function fillApp(data){
	fillCarousel(data);
	document.getElementById("solution-header").innerHTML = "Solution 1";
	fillDiagrams(data[0]);
	selectSolution(0);
}

function cleanNumber(num, decimalPlaces){
	if(Math.floor(num) == num || decimalPlaces == undefined){ return num; }
	return parseFloat(num.toFixed(decimalPlaces));
}
function selectSolution(number){
	for(var i = 0; i < NUMBER_OF_SOLUTIONS; i++){
		document.getElementById("card-header-" + i).className = "";
		document.getElementById("card-paragraph-" + i).className = "";
	}
	document.getElementById("solution-header").innerHTML = "Solution " + (number+1);
	document.getElementById("card-header-" + number).className = "selected";
	document.getElementById("card-paragraph-" + number).className = "selected";
}

function fillCarousel(data){
	var carouselDiv = document.getElementById("carousel");
	while (carouselDiv.firstChild){
		carouselDiv.removeChild(carouselDiv.firstChild);
	}
	data.forEach(function(entry, i){
		// var markings = entry.sequence
		// 	.map(function(s){
		// 		if(s.type == 'line'){ return [entry.components[s.make]]; }
		// 		return [];
		// 	}).reduce(function(prev,curr){ return prev.concat(curr); }, []);
		var markings = entry.components
			.filter(function(c){ return c.type == 'line'; },this)
			.map(function(s){ return [s]; })
			.reduce(function(prev,curr){ return prev.concat(curr); }, []);

		var card = document.createElement('div');
		var h4 = document.createElement('h4');
		var canvas = document.createElement('canvas');
		var p = document.createElement('p');
		h4.id = "card-header-" + i;
		p.id = "card-paragraph-" + i;

		card.className = "card card-body";
		h4.innerHTML = "Solution " + (i+1);
		canvas.id = "carousel-cp-" + i;
		canvas.setAttribute("resize","");
		canvas.onclick = function(){
			fillDiagrams(entry);
			selectSolution(i);
		}
		if(entry.solution.x != undefined){
			p.innerHTML = "(" + cleanNumber(entry.solution.x,6) + ", " + cleanNumber(entry.solution.y,6) + ")";
		} else{
			p.innerHTML = "(" + cleanNumber(entry.solution.u.x,3) + ", " + cleanNumber(entry.solution.u.y,3) + ") " + cleanNumber(entry.solution.d,3);
		}
		p.innerHTML += "<br><span class='error'>Error: " + cleanNumber(entry.error,7) + "</span>";

		card.appendChild(h4);
		card.appendChild(canvas);
		card.appendChild(p);
		carouselDiv.appendChild(card);

		var origami = new OrigamiPaper("carousel-cp-" + i).setPadding(0.025);
		origami.style.mark.strokeColor = {gray:0.0, alpha:1.0 };
		markings.forEach(function(line){
			var crease = origami.cp.crease( convertLine(line.d, line.u) );
			if(crease){ crease.mark(); }
		},this);
		origami.draw();
		origami.nodeLayer.activate();
		if(entry.target != undefined && entry.target.x != undefined){
			new origami.scope.Shape.Circle({position:entry.target, radius:0.025, fillColor:origami.styles.byrne.yellow});
		}
		if(entry.target != undefined && entry.target.u != undefined){
			var edge = origami.cp.boundary.clipLine(convertLine(entry.target.d, entry.target.u));
			new origami.scope.Path({segments:edge.nodes.slice(), strokeColor:origami.styles.byrne.yellow, strokeWidth:0.015});
		}
	},this);
}

function fillDiagrams(entry){
	var diagramDiv = document.getElementById("diagrams");
	while (diagramDiv.firstChild){
		diagramDiv.removeChild(diagramDiv.firstChild);
	}

	origamiFolds = [];
	origamiPapers = [];
	paragraphText = [];

	// console.log(entry);
	for(var i = 0; i < entry.sequence.length; i++){
		var row = document.createElement('div');
		row.className = "diagram-row";
		var c1 = document.createElement('canvas');
		var p = document.createElement('p');
		p.className = "instruction";
		c1.id = "canvas-cp-" + i;
		p.id = "instruction-step-" + i;
		c1.setAttribute("resize","");
		row.appendChild(c1);
		document.getElementById("diagrams").appendChild(row);
		document.getElementById("diagrams").appendChild(p);
		var origami = new OrigamiPaper("canvas-cp-" + i).setPadding(0.02);
		origamiPapers.push(origami);
		if(entry.sequence[i].type == 'line'){
			var c2 = document.createElement('canvas');
			c2.id = "canvas-fold-" + i;
			c2.setAttribute("resize","");
			row.appendChild(c2);
			var folded = new OrigamiFold("canvas-fold-" + i).setPadding(0.02);
			origami.fold = folded;
			origamiFolds.push(folded);
		}
		paragraphText.push(p);
	}
	entry.instructions.forEach(function(text, i){
		paragraphText[i].innerHTML = text;
	});	
	origamiFolds.forEach(function(el){
		el.style = { face:{ fillColor:{ gray:1.0, alpha:0.66 } } };
		el.mouseZoom = false;
		el.draw();
	},this);
	origamiPapers.forEach(function(el){
		el.axiom = undefined;
		el.reset = reset.bind(el);
		el.drawAxiom = drawAxiom.bind(el);
		el.drawMark = drawMark.bind(el);
		el.updateFoldedState = updateFoldedState.bind(el);
		el.drawArrowAcross = drawArrowAcross.bind(el);
	},this);

	var markings = entry.sequence.map(function(s){
			if(s.type == 'line'){ return [entry.components[s.make]]; }
			return [];
		})
	markings.unshift([]);

	var maxIndex = entry.components.findIndex(obj => obj.name == "A");
	for(var i = 0; i < maxIndex; i++){
		if(entry.components[i].type == 'line'){ markings[0].push( entry.components[i] ); }
	}
	// this is required to not miss the downward/upward diagonals. which are't encoded in the steps
	for(var i = 1; i < markings.length; i++){
		markings[i] = markings[i].concat(markings[i-1]);
	}

	entry.sequence.forEach(function(s,i){
		origamiPapers[i].reset();

	if(origamiPapers[i].arrowLayer == undefined){ origamiPapers[i].arrowLayer = new origamiPapers[i].scope.Layer(); }
	origamiPapers[i].arrowLayer.activate();
	origamiPapers[i].arrowLayer.removeChildren();

		var points = (s.parameters.points) ? s.parameters.points.map(function(i){return entry.components[i];},this) : [];
		var lines = (s.parameters.lines) ? s.parameters.lines.map(function(i){return entry.components[i];},this) : [];

		if(s.type == 'point'){ origamiPapers[i].drawMark(entry.components[s.make], lines); }
		if(s.type == 'line'){
			var solution = entry.components[s.make];
			var crease = origamiPapers[i].cp.crease( convertLine(solution.d, solution.u) );
			if(crease){ crease.valley(); }
			// draw axiom arrows
			switch(s.axiom){
				case 2:
					var intersect = crease.nearestPointNormalTo(new XY(points[0].x, points[0].y));
					origamiPapers[i].drawArrowAcross(crease, intersect);
					break;
				case 5:
					var intersect = crease.nearestPointNormalTo(new XY(points[0].x, points[0].y));
					origamiPapers[i].drawArrowAcross(crease, intersect);
					break;
				case 6:
					var intersect1 = crease.nearestPointNormalTo(new XY(points[0].x, points[0].y));
					var intersect2 = crease.nearestPointNormalTo(new XY(points[1].x, points[1].y));
					origamiPapers[i].drawArrowAcross(crease, intersect1);
					origamiPapers[i].drawArrowAcross(crease, intersect2);
					break;
				case 7:
					var intersect = crease.nearestPointNormalTo(new XY(points[0].x, points[0].y));
					origamiPapers[i].drawArrowAcross(crease, intersect);
					break;
				default:
					origamiPapers[i].drawArrowAcross(crease);
					break;
			}
			origamiPapers[i].drawAxiom(s.axiom, solution, points, lines);
		}
		origamiPapers[i].draw();

		// markings[i].forEach(function(line){
		// 	var mark = origamiPapers[i].cp.crease( convertLine(line.d, line.u) );
		// 	if(mark){ mark.mark(); }
		// });

	if(origamiPapers[i].axiomMarkLayer == undefined){
		origamiPapers[i].axiomMarkLayer = new origamiPapers[i].scope.Layer();
		origamiPapers[i].axiomMarkLayer.insertBelow(origamiPapers[i].edgeLayer);
	}
	origamiPapers[i].axiomMarkLayer.activate();
	origamiPapers[i].axiomMarkLayer.removeChildren();

		markings[i].forEach(function(line){
			var edge = origamiPapers[i].cp.boundary.clipLine( convertLine(line.d, line.u) );
			new origamiPapers[i].scope.Path({segments:edge.nodes.slice(), strokeColor:{gray:0.75}, strokeWidth:0.005});
		},this);

		origamiPapers[i].updateFoldedState();
	},this);
}

var convertLine = function(d, u){ return new Line(d*u.x, d*u.y, -u.y, u.x); }

var reset = function(){
	paper = this.scope;
	this.cp.clear();
	this.draw();
	if(this.solutionLayer == undefined){ this.solutionLayer = new this.scope.Layer(); }
}

var drawAxiom = function(axiomNum, solution, marks, lines){
	// draw marks lines and arrows
	paper = this.scope;
	this.solutionLayer.activate();
	var markColors = Array.apply(null, Array(marks.length)).map(function(x){return this.styles.byrne.yellow;},this);
	var lineColors = Array.apply(null, Array(lines.length)).map(function(x){return this.styles.byrne.yellow;},this);
	if(axiomNum == 6){ markColors[1] = this.styles.byrne.red; lineColors[1] = this.styles.byrne.red; }
	lines.map(function(l){ return convertLine(l.d, l.u); },this)
			.forEach(function(l, i){
			var edge = this.cp.boundary.clipLine(l);
			new this.scope.Path({segments:edge.nodes.slice(), strokeColor:lineColors[i], strokeWidth:0.01});
		},this);
	marks.forEach(function(m, i){ 
		new this.scope.Shape.Circle({position:{x:m.x, y:m.y}, radius:0.02, fillColor:markColors[i]});
	},this);
}

var drawMark = function(solution, lines){
	paper = this.scope;
	this.solutionLayer.activate();
	new this.scope.Shape.Circle({position:{x:solution.x, y:solution.y}, radius:0.02, fillColor:this.styles.byrne.yellow});
}

var updateFoldedState = function(){
	if(this.fold != undefined){
		this.fold.cp = this.cp.copy();
		// var tableFace = this.fold.cp.nearest(this.marks[0].x, this.marks[0].y).face;
		// this.fold.draw( tableFace );
		this.fold.draw();
	}
}

// intersect is a point on the line, the point which the arrow should be cast perpendicularly across
// when left undefined, intersect will be the midpoint of the line.
var drawArrowAcross = function(crease, crossing){
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
	// new this.scope.Path({segments:arcEnds, strokeColor:this.styles.byrne.yellow, strokeWidth:0.005});
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

////////////////////////////////////////////////////////////

function getFloatFromElementById(domElementId){
	var n;
	try{      n = eval( document.getElementById(domElementId).value ); }
	catch(e){ n = parseFloat( document.getElementById(domElementId).value ); }
	return n;
}

document.getElementById("go-button").onclick = function(e){
	var mode = document.getElementById("find-type-select").innerHTML;

	var url = "";
	switch(mode){
		case 'point':
			var x1 = getFloatFromElementById("input-x-1");
			var y1 = getFloatFromElementById("input-y-1");
			url = "https://reference-finder.herokuapp.com/point?x=" + x1 + "&y=" + y1 + "&count=" + NUMBER_OF_SOLUTIONS;
		break;
		case 'line':
			var x1 = getFloatFromElementById("input-x-1");
			var y1 = getFloatFromElementById("input-y-1");
			var x2 = getFloatFromElementById("input-x-2");
			var y2 = getFloatFromElementById("input-y-2");
			url = "https://reference-finder.herokuapp.com/line?x1=" + x1 + "&y1=" + y1 + "&x2=" + x2 + "&y2=" + y2 + "&count=" + NUMBER_OF_SOLUTIONS;
		break;
	}
	// clear contents
	document.getElementById("solution-header").innerHTML = "";
	var diagramDiv = document.getElementById("diagrams");
	while (diagramDiv.firstChild){
		diagramDiv.removeChild(diagramDiv.firstChild);
	}
	var carouselDiv = document.getElementById("carousel");
	while (carouselDiv.firstChild){
		carouselDiv.removeChild(carouselDiv.firstChild);
	}

	// validate inputs
	switch(mode){
		case 'point': 
			if(isNaN(x1) || isNaN(y1)) { showWarning("problem reading the input, X and Y need to be numbers"); return; }
			if(x1 < 0 || x1 > 1 || y1 < 0 || y1 > 1){ showWarning("this is a <strong>unit square</strong>, X and Y need to be between 0 and 1"); return; }
		break;
		case 'line': 
			if(isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) { showWarning("problem reading the input, X and Y need to be numbers"); return; }
			if(x1 < 0 || x1 > 1 || y1 < 0 || y1 > 1 || x2 < 0 || x2 > 1 || y2 < 0 || y2 > 1){ 
				showWarning("this is a <strong>unit square</strong>, X and Y need to be between 0 and 1"); return;
			}
		break;
	}
	// inputs are valid. remove errors from previous sessions
	var alertDiv = document.getElementById("alert-div");
	while (alertDiv.firstChild){
		alertDiv.removeChild(alertDiv.firstChild);
	}


	var spinnerDiv = document.createElement("div");
	spinnerDiv.className = "loader";
	document.getElementById("diagrams").appendChild(spinnerDiv);

	fetch(url, {mode:'cors'})
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			fillApp(data);
		});
}

document.getElementById("find-type-select").onclick = function(e){

}
document.getElementById("find-a-point-button").onclick = function(e){
	document.getElementById("find-type-select").innerHTML = "point";
	document.getElementById("input-x-2").style.display = "none";
	document.getElementById("input-y-2").style.display = "none";
	document.getElementById("input-x-1").placeholder = "x"
	document.getElementById("input-y-1").placeholder = "y"
}
document.getElementById("find-a-line-button").onclick = function(e){
	document.getElementById("find-type-select").innerHTML = "line";
	document.getElementById("input-x-2").style.display = "block";
	document.getElementById("input-y-2").style.display = "block";
	document.getElementById("input-x-1").placeholder = "x (point A)"
	document.getElementById("input-y-1").placeholder = "y (point A)"
	document.getElementById("input-x-2").placeholder = "x (point B)"
	document.getElementById("input-y-2").placeholder = "y (point B)"
}

// document.getElementById("input-x-1")
// document.getElementById("input-y-1")
document.getElementById("input-x-2").style.display = "none";
document.getElementById("input-y-2").style.display = "none";

document.body.addEventListener("keyup", function(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		document.getElementById("go-button").click();
	}
});

// warm up servers
fetch("https://reference-finder.herokuapp.com/", {mode:'cors'})
	.then(function(response){return response.json(); })
	.then(function(data){ });
