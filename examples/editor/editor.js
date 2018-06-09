var mouseMoveCallback = undefined;

var foldedProject = new OrigamiFold("canvas-folded");
var project = new OrigamiPaper("canvas").setPadding(0.025);

var MouseMode = {
	"removeCrease":1, 
	"flipCrease":2,
	"addSectorBisector":3,
	"addBetweenPoints":4,
	"addPointToPoint":5,
	"addEdgeToEdge":6
}; Object.freeze(MouseMode);

project.show.nodes = true;
project.show.faces = true;
project.show.sectors = true;
project.style.face.fillColor = Object.assign({alpha:0.0}, project.styles.byrne.red);
project.style.sector.fillColors = [
	Object.assign({alpha:0.0}, project.styles.byrne.blue), 
	Object.assign({alpha:0.0}, project.styles.byrne.blue) ];
project.style.boundary.strokeColor = {gray:0.0, alpha:0.0};
project.style.node.fillColor = Object.assign({alpha:0.0}, project.styles.byrne.red);
project.style.node.radius = 0.015;
project.style.sector.scale = 0.5;
project.ghostMarksLayer = new project.scope.Layer();
//
project.mouseMode = MouseMode.addSectorBisector;
// project.stage = new CreasePattern();
project.selected = {};

project.updateCreasePattern = function(){
	this.cp.flatten();
	this.draw();
	foldedProject.cp = this.cp.copy();
	foldedProject.draw();
}

project.reset = function(){
	this.updateCreasePattern();
}
project.reset();

project.possibleCreases = [];  // read only please
project.setPossibleCreases = function(edges){
	this.possibleCreases = edges;
	paper = this.scope;
	this.ghostMarksLayer.activate();
	this.ghostMarksLayer.removeChildren();
	var paths = edges.map(function(edge){ return edge.nodes.map(function(el){ return [el.x, el.y]; }); },this)
		.map(function(endpointsArray){
			var pathStyle = Object.assign({segments: endpointsArray, closed: false }, project.style.mark);
			return new this.scope.Path(pathStyle);
		},this);
}

project.setMouseMode = function(newMode){
	switch(newMode){
		case MouseMode.addSectorBisector:
		break;
		case MouseMode.addBetweenPoints:
			var edges = project.cp.availableAxiom1Folds();
			project.setPossibleCreases(edges);
		break;
		case MouseMode.addPointToPoint:
			var edges = project.cp.availableAxiom2Folds();
			project.setPossibleCreases(edges);
		break;
		case MouseMode.addEdgeToEdge:
			var edges = project.cp.availableAxiom3Folds();
			project.setPossibleCreases(edges);
		break;
		case MouseMode.removeCrease:
		break;
		case MouseMode.flipCrease:
		break;
	}
	this.mouseMode = newMode;
	this.updateCreasePattern();
}

project.onMouseDown = function(event){
	switch(this.mouseMode){
		case MouseMode.addSectorBisector:
			var nearest = this.cp.nearest(event.point);
			if(nearest.sector !== undefined){
				var cs = nearest.sector.bisect().creaseAndRepeat();
				cs.forEach(function(c){c.mountain()},this);
			}
		break;
		case MouseMode.addBetweenPoints:
			var a = this.cp.nearest(event.point).node;
			var edges = project.cp.availableAxiom1Folds().filter(function(edge){
				return edge.collinear(a);
			},this);
			// .filter(function(e){
			// 	return (epsilonEqual(a.x,e.nodes[0].x,0.001) && epsilonEqual(a.y,e.nodes[0].y,0.001) ) ||
			// 	       (epsilonEqual(a.x,e.nodes[1].x,0.001) && epsilonEqual(a.y,e.nodes[1].y,0.001) );
			// },this);
			this.setPossibleCreases(edges);
		break;
		case MouseMode.addPointToPoint:
		break;
		case MouseMode.addEdgeToEdge:
		break;
		case MouseMode.removeCrease:
			var nearest = this.cp.nearest(event.point);
			if(nearest.edge !== undefined){
				this.cp.removeEdge(nearest.edge);
			}
		break;
		case MouseMode.flipCrease:
			var nearest = this.cp.nearest(event.point);
			if(nearest.edge !== undefined){
				switch(nearest.edge.orientation){
					case CreaseDirection.mountain: nearest.edge.orientation = CreaseDirection.valley; break;
					case CreaseDirection.valley:   nearest.edge.orientation = CreaseDirection.mountain; break;
				}
			}
		break;
		default:
			this.selected = this.cp.nearest(event.point);
			console.log(this.selected);
		break;
	}
	this.updateCreasePattern();
}
project.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	switch(this.mouseMode){
		case MouseMode.addSectorBisector:
			if(nearest.node !== undefined){ this.nodes[nearest.node.index].fillColor.alpha = 1.0; }
			if(nearest.edge !== undefined){
				this.edges[nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
			if(nearest.face !== undefined){ this.faces[nearest.face.index].fillColor.alpha = 1.0}
			if(nearest.sector !== undefined){ this.sectors[nearest.sector.index].fillColor.alpha = 1.0; }
			if(mouseMoveCallback != undefined){ mouseMoveCallback(event.point); }
		break;
		case MouseMode.addBetweenPoints:
			if(this.selected.node){ this.nodes[this.selected.node.index].fillColor.alpha = 1.0; }
			if(nearest.node !== undefined){ this.nodes[nearest.node.index].fillColor.alpha = 1.0; }
		break;
		case MouseMode.addPointToPoint:
			if(nearest.node !== undefined){ this.nodes[nearest.node.index].fillColor.alpha = 1.0; }
		break;
		case MouseMode.addEdgeToEdge:
		break;
		case MouseMode.removeCrease:
			if(nearest.edge !== undefined){
				this.edges[nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
		break;
		case MouseMode.flipCrease:
			if(nearest.edge !== undefined){
				// this.edges[nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
		break;
	}
}

document.getElementById("radio-input-mode").onchange = function(event){
	switch(event.target.id){
		case "radio-button-add-crease":    project.mouseMode = MouseMode.addSectorBisector; break;
		case "radio-button-remove-crease": project.mouseMode = MouseMode.removeCrease;   break;
		case "radio-button-flip-crease":   project.mouseMode = MouseMode.flipCrease;     break;
	}
}
// modal stuff
$("#modal-what-is-this").draggable({ handle: ".modal-header" });
$("#modal-fold-window").draggable({ handle: ".modal-header" });

function whatIsThisDidPress(){
	document.getElementById("modal-what-is-this").style.display = 'block';
}

// IMPORT / EXPORT
creasePatternDidUpload = function(cp){
	project.cp = cp;
	project.updateCreasePattern();
}
document.getElementById("download-svg").addEventListener("click", function(e){
	e.preventDefault();
	downloadCreasePattern(project.cp, "creasepattern", "svg");
});
document.getElementById("download-fold").addEventListener("click", function(e){
	e.preventDefault();
	downloadCreasePattern(project.cp, "creasepattern", "fold");
});

function betweenPointsHandler(){ project.setMouseMode(MouseMode.addBetweenPoints); }
function pointToPointHandler(){ project.setMouseMode(MouseMode.addPointToPoint); }
function edgeToEdgeHandler(){ project.setMouseMode(MouseMode.addEdgeToEdge); }
