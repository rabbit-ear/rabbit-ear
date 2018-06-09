var mouseMoveCallback = undefined;

var foldedProject = new OrigamiFold("canvas-folded");
var project = new OrigamiPaper("canvas").setPadding(0.1);

var MouseMode = {
	"removeCrease":1, 
	"flipCrease":2,
	"addSectorBisector":3,
	"addBetweenPoints":4,
	"addPointToPoint":5,
	"addEdgeToEdge":6,
	"addPleatBetweenEdges":7,
	"addRabbitEar":8,
	"addKawasakiFourth":9,
	"addPerpendicular":10,
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
project.ghostMarksLayer.moveBelow(project.edgeLayer);
//
project.mouseMode = MouseMode.addSectorBisector;
// project.stage = new CreasePattern();
project.selected = {};
project.nearest = {};

project.updateCreasePattern = function(){
	this.cp.flatten();
	this.draw();
	foldedProject.cp = this.cp.copy();
	foldedProject.draw();
}

project.possibleCreases = [];  // read only please
project.setPossibleCreases = function(edges){
	this.possibleCreases = edges;
	paper = this.scope;
	this.ghostMarksLayer.activate();
	this.ghostMarksLayer.removeChildren();
	var paths = edges.map(function(edge){ return edge.nodes.map(function(el){ return [el.x, el.y]; }); },this)
		.map(function(endpointsArray){
			var p = new this.scope.Path(Object.assign({segments: endpointsArray, closed: false }, project.style.mark));
			p.strokeColor = this.styles.byrne.yellow
			return p
		},this);
}
project.filterPossibleCreases = function(filterFunc){
	var filteredEdges = this.possibleCreases.filter(filterFunc.bind(this));
	paper = this.scope;
	this.ghostMarksLayer.activate();
	this.ghostMarksLayer.removeChildren();
	var paths = filteredEdges.map(function(edge){ return edge.nodes.map(function(el){ return [el.x, el.y]; }); },this)
		.map(function(endpointsArray){
			var p = new this.scope.Path(Object.assign({segments: endpointsArray, closed: false }, project.style.mark));
			p.strokeColor = this.styles.byrne.yellow
			return p
		},this);
}

project.reset = function(){
	this.cp.clear();
	this.selected = {};
	this.nearest = {};
	this.setPossibleCreases([]);
	this.updateCreasePattern();
}
project.reset();

project.setMouseMode = function(newMode){
	// is this a good decision? reset selected creases between mode switching?
	this.selected = {};
	this.setPossibleCreases([]);
	switch(newMode){
		case MouseMode.addSectorBisector:
		break;
		case MouseMode.addBetweenPoints: this.setPossibleCreases( this.cp.availableAxiom1Folds() ); break;
		case MouseMode.addPointToPoint: this.setPossibleCreases( this.cp.availableAxiom2Folds() ); break;
		case MouseMode.addEdgeToEdge: this.setPossibleCreases( this.cp.availableAxiom3Folds() ); break;
		case MouseMode.addPleatBetweenEdges:
		break;
		case MouseMode.addRabbitEar:
		break;
		case MouseMode.addKawasakiFourth:
		break;
		case MouseMode.addPerpendicular:
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
			var edges = this.possibleCreases.filter(function(edge){ return edge.collinear(this.nearest.node); },this);
			if(this.selected.node != undefined){
				var edge = edges[0];
				if(edge){ this.cp.crease(edge).mountain(); }
				this.selected = {};
				this.setMouseMode(MouseMode.addBetweenPoints);
			}
			else{
				this.setPossibleCreases(edges);
				this.selected = this.nearest;
			}
		break;
		case MouseMode.addPointToPoint:
			var edges = this.possibleCreases.filter(function(edge){
					return edge.madeBy.args.filter(function(point){ return point.equivalent(this.nearest.node,0.0001); },this).length > 0;
				},this);
			if(this.selected.node != undefined){
				var edge = edges[0];
				if(edge){ this.cp.crease(edge).mountain(); }
				this.selected = {};
				this.setMouseMode(MouseMode.addPointToPoint);
			}
			else{
				this.setPossibleCreases(edges);
				this.selected = this.nearest;
			}
		break;
		case MouseMode.addEdgeToEdge:
			var edges = this.possibleCreases.filter(function(edge){
					return edge.madeBy.args.filter(function(point){ return point.equivalent(this.nearest.edge.nodes[0],0.0001); },this).length > 0;
				},this);
			if(this.selected.edge != undefined){
				var edge = edges[0];
				if(edge){ this.cp.crease(edge).mountain(); }
				this.selected = {};
				this.setMouseMode(MouseMode.addEdgeToEdge);
			}
			else{
				this.setPossibleCreases(edges);
				this.selected = this.nearest;
			}
		break;
		case MouseMode.addRabbitEar:
			if(this.nearest.face){
				this.nearest.face.rabbitEar()
					.filter(function(crease){ return crease != undefined; },this)
					.forEach(function(crease){ crease.mountain(); },this);
			}
		break;
		case MouseMode.addKawasakiFourth:
			if(this.nearest.face){
				var ray = this.nearest.sector.kawasakiFourth();
				if(ray){
					ray.creaseAndRepeat()
						.filter(function(crease){ return crease != undefined; },this)
						.forEach(function(crease){ crease.mountain(); },this);
				}
			}
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

		break;
		// this cannot be here. don't un-comment this
		// this.selected = this.cp.nearest(event.point);
	}
	this.updateCreasePattern();
}
project.onMouseMove = function(event){
	// what changed from frame to frame. only update complex calculations if necessary
	var didChange = this.updateNearestToMouse(event.point);
	this.updateStyles();
	switch(this.mouseMode){
		case MouseMode.addSectorBisector:
			if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor.alpha = 1.0; }
			if(this.nearest.edge != undefined){
				this.edges[this.nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[this.nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
			if(this.nearest.face != undefined){ this.faces[this.nearest.face.index].fillColor.alpha = 1.0}
			if(this.nearest.sector != undefined){ this.sectors[this.nearest.sector.index].fillColor.alpha = 1.0; }
			if(mouseMoveCallback != undefined){ mouseMoveCallback(event.point); }
		break;
		case MouseMode.addBetweenPoints:
			if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor.alpha = 1.0; }
			if(this.selected.node){ this.nodes[this.selected.node.index].fillColor.alpha = 1.0; }
			if(didChange.node){
				if(this.nearest.node){
					this.filterPossibleCreases(function(edge){ return edge.collinear(this.nearest.node); })
				} else{ this.setPossibleCreases([]); }
			}
		break;
		case MouseMode.addPointToPoint:
			if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor.alpha = 1.0; }
			if(this.selected.node){ this.nodes[this.selected.node.index].fillColor.alpha = 1.0; }
			if(didChange.node){
				if(this.nearest.node){
					this.filterPossibleCreases(function(edge){
						return edge.madeBy.args.filter(function(point){ return point.equivalent(this.nearest.node,0.0001); },this).length > 0;
					})
				} else{ this.setPossibleCreases([]); }
			}
		break;
		case MouseMode.addEdgeToEdge:
			if(this.nearest.edge != undefined){ this.edges[this.nearest.edge.index].strokeColor = this.styles.byrne.yellow; }
			if(this.selected.edge){ this.edges[this.selected.edge.index].strokeColor = this.styles.byrne.yellow; }
			if(didChange.edge){
				if(this.nearest.edge){
					this.filterPossibleCreases(function(edge){
						return edge.madeBy.args.filter(function(point){ return point.equivalent(this.nearest.edge.nodes[0],0.0001); },this).length > 0;
					})
				} else{ this.setPossibleCreases([]); }
			}
		break;
		case MouseMode.removeCrease:
			if(this.nearest.edge != undefined){
				this.edges[this.nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[this.nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
		break;
		case MouseMode.flipCrease:
			if(this.nearest.edge !== undefined){
				// this.edges[this.nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[this.nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
		break;
		case MouseMode.addRabbitEar:
			if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor.alpha = 1.0; }
			if(this.nearest.edge != undefined){
				this.edges[this.nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[this.nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
			if(this.nearest.face != undefined){ this.faces[this.nearest.face.index].fillColor.alpha = 1.0}
			if(this.nearest.sector != undefined){ this.sectors[this.nearest.sector.index].fillColor.alpha = 1.0; }
			if(mouseMoveCallback != undefined){ mouseMoveCallback(event.point); }
		break;
		case MouseMode.addKawasakiFourth:
			if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor.alpha = 1.0; }
			if(this.nearest.sector != undefined){ this.sectors[this.nearest.sector.index].fillColor.alpha = 1.0; }
			if(mouseMoveCallback != undefined){ mouseMoveCallback(event.point); }
		break;
	}
}

project.updateNearestToMouse = function(point){
	var nearestDidUpdate = {node:false, edge:false, face:false, sector:false, junction:false};
	var nearest = this.cp.nearest(point);
	if(nearest.node !== this.nearest.node){ nearestDidUpdate.node = true; }
	if(nearest.edge !== this.nearest.edge){ nearestDidUpdate.edge = true; }
	if(nearest.face !== this.nearest.face){ nearestDidUpdate.face = true; }
	if(nearest.sector !== this.nearest.sector){ nearestDidUpdate.sector = true; }
	if(nearest.junction !== this.nearest.junction){ nearestDidUpdate.junction = true; }
	this.nearest = nearest;
	return nearestDidUpdate;
}

// modal stuff
$("#modal-what-is-this").draggable({ handle: ".modal-header" });
$("#modal-fold-window").draggable({ handle: ".modal-header" });

// IMPORT / EXPORT (called in import-export.js)
creasePatternDidUpload = function(cp){
	project.cp = cp;
	project.updateCreasePattern();
}

// DOM HOOKS
document.getElementById("radio-input-mode").onchange = function(event){
	switch(event.target.id){
		case "radio-button-remove-crease":
			project.setMouseMode(MouseMode.removeCrease);
			document.getElementById("add-crease-sub-menu").style.display = "none";
		break;
		case "radio-button-flip-crease":
			project.setMouseMode(MouseMode.flipCrease);
			document.getElementById("add-crease-sub-menu").style.display = "none";
		break;
		case "radio-button-add-crease":
			project.setMouseMode(MouseMode.addSectorBisector); 
			document.getElementById("add-crease-sub-menu").style.display = "block";
		break;
	}
}
document.getElementById("new-file").addEventListener("click", newFileHandler);
document.getElementById("download-svg").addEventListener("click", downloadCPSVG);
document.getElementById("download-fold").addEventListener("click", downloadCPFOLD);

document.getElementById("mouse-mode-bisect-sector").addEventListener("click", bisectSectorHandler);
document.getElementById("mouse-mode-between-points").addEventListener("click", betweenPointsHandler);
document.getElementById("mouse-mode-point-to-point").addEventListener("click", pointToPointHandler);
document.getElementById("mouse-mode-edge-to-edge").addEventListener("click", edgeToEdgeHandler);
document.getElementById("mouse-mode-pleat").addEventListener("click", pleatHandler);
document.getElementById("mouse-mode-rabbit-ear").addEventListener("click", rabbitEarHandler);
document.getElementById("mouse-mode-kawasaki-fourth").addEventListener("click", kawasakiHandler);
document.getElementById("mouse-mode-perpendicular").addEventListener("click", perpendicularHandler);

document.getElementById("what-is-this").addEventListener("click", whatIsThisHandler);

function newFileHandler(e){ e.preventDefault(); project.reset(); }
function downloadCPSVG(e){ e.preventDefault(); downloadCreasePattern(project.cp, "creasepattern", "svg"); }
function downloadCPFOLD(e){ e.preventDefault(); downloadCreasePattern(project.cp, "creasepattern", "fold"); }

function bisectSectorHandler(e){ e.preventDefault(); project.setMouseMode(MouseMode.addSectorBisector); }
function betweenPointsHandler(e){ e.preventDefault(); project.setMouseMode(MouseMode.addBetweenPoints); }
function pointToPointHandler(e){ e.preventDefault(); project.setMouseMode(MouseMode.addPointToPoint); }
function edgeToEdgeHandler(e){ e.preventDefault(); project.setMouseMode(MouseMode.addEdgeToEdge); }
function pleatHandler(e){ e.preventDefault(); project.setMouseMode(MouseMode.addPleatBetweenEdges); }
function rabbitEarHandler(e){ e.preventDefault(); project.setMouseMode(MouseMode.addRabbitEar); }
function kawasakiHandler(e){ e.preventDefault(); project.setMouseMode(MouseMode.addKawasakiFourth); }
function perpendicularHandler(e){ e.preventDefault(); project.setMouseMode(MouseMode.addPerpendicular); }

function whatIsThisHandler(e){ e.preventDefault(); document.getElementById("modal-what-is-this").style.display = 'block'; }