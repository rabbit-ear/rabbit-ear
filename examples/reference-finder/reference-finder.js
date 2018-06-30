
////////////////////////////////////////////////////////////////////////
// HTML DOM

$("#radio-target-type :input").change(function() {
	switch(this.id){
	case "radio-button-point":
		$("#target-x2").css("display", "none");
		$("#target-y2").css("display", "none");
		$("#target-x2").val("");
		$("#target-y2").val("");
		targets[1].x = undefined;
		targets[1].y = undefined;
		project.updateTargets();
	break;
	case "radio-button-line":
		$("#target-x2").css("display", "block");
		$("#target-y2").css("display", "block");
	break;
	}
});
$("#radio-input-mode :input").change(function() {
	switch(this.id){
	case "radio-button-add":
		project.inputMode = "add";
	break;
	case "radio-button-remove":
		project.inputMode = "remove";
	break;
	}
});
$('#target-x1').on('input',function(e){ targets[0].x = parseFloat( $('#target-x1').val() ); project.updateTargets();});
$('#target-y1').on('input',function(e){ targets[0].y = parseFloat( $('#target-y1').val() ); project.updateTargets();});
$('#target-x2').on('input',function(e){ targets[1].x = parseFloat( $('#target-x2').val() ); project.updateTargets();});
$('#target-y2').on('input',function(e){ targets[1].y = parseFloat( $('#target-y2').val() ); project.updateTargets();});

var axiom1Pressed = false;
var axiom2Pressed = false;
var axiom3Pressed = false;
function enableAxiom(number){
	switch(number){
		case 1: $("#axiom-1").addClass("active"); axiom1Pressed = true;
		break;
		case 2: $("#axiom-2").addClass("active"); axiom2Pressed = true;
		break;
		case 3: $("#axiom-3").addClass("active"); axiom3Pressed = true;
		break;
	}
}
function disableAxiom(number){
	switch(number){
		case 1: $("#axiom-1").removeClass("active"); axiom1Pressed = false;
		break;
		case 2: $("#axiom-2").removeClass("active"); axiom2Pressed = false;
		break;
		case 3: $("#axiom-3").removeClass("active"); axiom3Pressed = false;
		break;
	}
}
document.getElementById("axiom-1").addEventListener("click", function(e){
	e.preventDefault();
	if(axiom1Pressed) disableAxiom(1);
	else enableAxiom(1);
	disableAxiom(2);
	disableAxiom(3);
	console.log(axiom1Pressed + " " + axiom2Pressed + " " + axiom3Pressed);
	project.recalculateFolds();
});
document.getElementById("axiom-2").addEventListener("click", function(e){
	e.preventDefault();
	if(axiom2Pressed) disableAxiom(2);
	else enableAxiom(2);
	disableAxiom(1);
	disableAxiom(3);
	console.log(axiom1Pressed + " " + axiom2Pressed + " " + axiom3Pressed);
	project.recalculateFolds();
});
document.getElementById("axiom-3").addEventListener("click", function(e){
	e.preventDefault();
	if(axiom3Pressed) disableAxiom(3);
	else enableAxiom(3);
	disableAxiom(1);
	disableAxiom(2);
	console.log(axiom1Pressed + " " + axiom2Pressed + " " + axiom3Pressed);
	project.recalculateFolds();
});


////////////////////////////////////////////////////////////////////////
// Project

var project = new OrigamiPaper("canvas");
project.setPadding(0.05);
project.style.border.strokeWidth = 0.002;
project.style.mountain.strokeWidth = 0.005;
project.style.valley.strokeWidth = 0.005;
project.style.valley.dashArray = [0.005 * 2, 0.005 * 2];
project.update();

project.nextSet = [];
project.nextSetCP = new CreasePattern();
project.nextSetLayer = new project.scope.Layer();
project.selectedNextLayer = new project.scope.Layer();

project.inputMode = "add";
// project.inputMode = "remove";

var targets = [new XY(undefined, undefined), new XY(undefined, undefined)];
project.targetLayer = new project.scope.Layer();

project.recalculateFolds = function(){
	// don't split the lines, but add their crossings as isolated nodes
	this.cp.removeIsolatedNodes();
	var intersections = this.cp.getEdgeIntersections();
	for(var i = 0; i < intersections.length; i++){
		this.cp.newPlanarNode(intersections[i].x, intersections[i].y);
	}

	if(!axiom1Pressed && !axiom2Pressed && !axiom3Pressed){
		this.nextSet = this.cp.availableAxiomFolds();
	} else{
		if(axiom1Pressed){ this.nextSet = this.cp.availableAxiom1Folds(); }
		else if(axiom2Pressed){ this.nextSet = this.cp.availableAxiom2Folds(); }
		else if(axiom3Pressed){ this.nextSet = this.cp.availableAxiom3Folds(); }
	}
	this.nextSet.forEach(function(edge){
		var crease = this.nextSetCP.crease(edge);
		if(crease){ crease.madeBy = edge.madeBy; }
	},this);

	this.selectedNextLayer.removeChildren();
	this.selectedNextLayer.activate();
	for(var i = 0; i < this.nextSet.length; i++){
		var newPath = new this.scope.Path({segments: this.nextSet[i].nodes, closed: false });
		Object.assign(newPath, this.style.mark);
		newPath.strokeColor = { gray:0.82, alpha:1.0 },
		newPath.strokeWidth = 0.001;
	}
	this.selectedNextLayer.sendToBack();
	this.backgroundLayer.sendToBack();
	this.nextSetLayer.bringToFront();
	this.targetLayer.bringToFront();
}
project.updateTargets = function(){
	// console.log(targets[0]);
	// console.log(targets[1]);
	// circle around the target point
	this.targetLayer.removeChildren();
	this.targetLayer.activate();
	var valid = [false, false];
	for(var i = 0; i < 2; i++){
		if(isValidPoint(targets[i]) && this.cp.contains(targets[i])){
			valid[i] = true;
		}
	}
	if(valid[0] && valid[1]){
		var targetCircle = new this.scope.Path({segments:targets, strokeWidth:0.001, strokeColor:{red:1.0, green:0.0, blue:0.0}});
	} else if(valid[0]){
		var targetCircle = new this.scope.Path.Circle(targets[0], 0.01);
		Object.assign(targetCircle, { strokeWidth: 0.005, strokeColor: {red:1.0, green:0.0, blue:0.0}, fillColor: undefined });

	} else if(valid[1]){
		var targetCircle = new this.scope.Path.Circle(targets[1], 0.01);
		Object.assign(targetCircle, { strokeWidth: 0.005, strokeColor: {red:1.0, green:0.0, blue:0.0}, fillColor: undefined });
	}
}

project.reset = function(){
	paper = this.scope; 

	this.recalculateFolds();
	this.updateTargets();
}
project.reset();


project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){
	if(selectedEdge !== undefined){
		switch(this.inputMode){
		case "add":
			var crease = this.cp.crease(selectedEdge.nodes[0], selectedEdge.nodes[1]);
			if(crease !== undefined){ 
				crease.valley(); 
			}
		break;
		case "remove":
			if(selectedEdge.orientation !== CreaseDirection.border){
				this.cp.removeEdge(selectedEdge);
			}
		break;
		}
		this.draw();
		this.recalculateFolds();
	}
}
project.onMouseUp = function(event){ }
project.onMouseMove = function(event) { 
	this.nextSetLayer.removeChildren();
	this.nextSetLayer.activate();
	if(!this.cp.contains(event.point)){ return; }
	switch(this.inputMode){
	case "add":
		selectedEdge = this.nextSetCP.nearestEdges(1, event.point.x, event.point.y).shift().edge;
	break;
	case "remove":
		selectedEdge = this.cp.nearest(event.point.x, event.point.y).edge;
	break;
	}
	if(selectedEdge != undefined){
		var newPath = new this.scope.Path({segments: selectedEdge.nodes, closed: false, strokeColor:this.styles.byrne.yellow, strokeWidth:0.01 });
		if(selectedEdge === undefined || selectedEdge.madeBy === undefined || selectedEdge.madeBy.args === undefined){ return; }
		if(selectedEdge.madeBy == undefined){ return; }
		var args = selectedEdge.madeBy.args;
		if(args[0] instanceof XY){
			var points = [[args[0].x, args[0].y],
			              [args[1].x, args[1].y] ];
			var circle0 = new paper.Path.Circle(points[0], 0.01);
			var circle1 = new paper.Path.Circle(points[1], 0.01);
			Object.assign(circle0, {strokeWidth:null,fillColor:this.styles.byrne.red});
			Object.assign(circle1, {strokeWidth:null,fillColor:this.styles.byrne.red});
		}
		if(args[0] instanceof Edge){
			var seg1 = [[args[0].nodes[0].x, args[0].nodes[0].y],
			            [args[0].nodes[1].x, args[0].nodes[1].y] ];
			var newPath1 = new paper.Path({segments: seg1, closed: false });
			Object.assign(newPath1, this.style.mountain);
			newPath1.strokeColor = this.styles.byrne.red;
			newPath1.strokeWidth = 0.01;
			var seg2 = [[args[1].nodes[0].x, args[1].nodes[0].y],
			            [args[1].nodes[1].x, args[1].nodes[1].y] ];
			var newPath2 = new paper.Path({segments: seg2, closed: false });
			Object.assign(newPath2, this.style.mountain);
			newPath2.strokeColor = this.styles.byrne.red;
			newPath2.strokeWidth = 0.01;
		}
	}
}

function fileDidLoad(file, mimeType){
	try{
		// try .fold file format first
		var foldFile = JSON.parse(file);
		project.cp.importFoldFile(foldFile);
		project.draw();
	} catch(err){
		// try .svg file format
		project.loadRaw(file, function(){
			project.cp.square();
			for(var i = 0; i < project.cp.edges.length; i++){ 
				if(project.cp.edges[i].orientation !== CreaseDirection.border)
					project.cp.edges[i].valley(); 
			}
			project.draw();
			project.recalculateFolds();
		});
	}
}
