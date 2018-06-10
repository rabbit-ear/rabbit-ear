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
 // default values are hiding in the DOM, HTML code
project.modifiers = { 
	pleatCount:8,
	betweenPoints:"full",
	perpendicular:"full"
}

project.updateCreasePattern = function(){
	this.cp.flatten();
	this.draw();
	foldedProject.cp = this.cp.copy();
	foldedProject.draw();
}

project.possibleCreases = [];  // read only please
project.possibleCreasesFiltered = [];  // read only please
project.setPossibleCreases = function(edges){
	this.possibleCreasesFiltered = [];
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
	this.possibleCreasesFiltered = this.possibleCreases.filter(filterFunc.bind(this));
	paper = this.scope;
	this.ghostMarksLayer.activate();
	this.ghostMarksLayer.removeChildren();
	var paths = this.possibleCreasesFiltered.map(function(edge){ return edge.nodes.map(function(el){ return [el.x, el.y]; }); },this)
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
		case MouseMode.addSectorBisector: break;
		case MouseMode.addBetweenPoints: this.setPossibleCreases( this.cp.availableAxiom1Folds() ); break;
		case MouseMode.addPointToPoint: this.setPossibleCreases( this.cp.availableAxiom2Folds() ); break;
		case MouseMode.addEdgeToEdge: this.setPossibleCreases( this.cp.availableAxiom3Folds() ); break;
		case MouseMode.addPleatBetweenEdges: break;
		case MouseMode.addRabbitEar: break;
		case MouseMode.addKawasakiFourth: break;
		case MouseMode.addPerpendicular: this.setPossibleCreases( this.cp.availableAxiom4Folds() ); break;
		case MouseMode.removeCrease: break;
		case MouseMode.flipCrease: break;
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
			if(this.selected.node != undefined){
				var edge = this.possibleCreasesFiltered.shift();
				switch(this.modifiers.betweenPoints){
					case "full": this.cp.crease(edge).mountain(); break;
					case "segment": this.cp.crease(this.selected.node, this.nearest.node).mountain(); break;
				}
				this.cp.flatten();
				this.setMouseMode(MouseMode.addBetweenPoints);
			}
			else{
				var edges = this.possibleCreases.filter(function(edge){ return edge.collinear(this.nearest.node); },this);
				this.setPossibleCreases(edges);
				this.selected = this.nearest;
			}
		break;
		case MouseMode.addPointToPoint:
			if(this.selected.node != undefined){
				var edge = this.possibleCreasesFiltered.shift();
				if(edge){ this.cp.crease(edge).mountain(); }
				this.cp.flatten();
				this.setMouseMode(MouseMode.addPointToPoint);
			}
			else{
				var edges = this.possibleCreases.filter(function(edge){
					return edge.madeBy.args.filter(function(point){ return point.equivalent(this.nearest.node,0.0001); },this).length > 0;
				},this);
				this.setPossibleCreases(edges);
				this.selected = this.nearest;
			}
		break;
		case MouseMode.addEdgeToEdge:
			if(this.selected.edge != undefined){
				// var edge = this.possibleCreasesFiltered.shift();
				this.possibleCreasesFiltered.map(function(edge){ return this.cp.crease(edge); },this)
				.filter(function(edge){ return edge != undefined; })
				.forEach(function(edge){ edge.mountain(); },this)
				// if(edge){ this.cp.crease(edge).mountain(); }
				this.cp.flatten();
				this.setMouseMode(MouseMode.addEdgeToEdge);
			}
			else{
				var edges = this.possibleCreases.filter(function(edge){
					return edge.madeBy.args.filter(function(edge){ return edge.equivalent(this.nearest.edge,0.0001); },this).length > 0;
				},this);
				this.setPossibleCreases(edges);
				this.selected = this.nearest;
			}
		break;
		case MouseMode.addPerpendicular:
			if(this.selected.node != undefined){
				var edge = this.possibleCreasesFiltered.shift();
				switch(this.modifiers.perpendicular){
					case "full": this.cp.crease(edge).mountain(); break;
					case "segment":
						var l1 = edge.infiniteLine();
						var l2 = this.nearest.edge.infiniteLine();
						var point2 = l1.intersection(l2);
						this.cp.crease(this.selected.node, point2).mountain();
					break;
				}
				this.cp.flatten();
				this.setMouseMode(MouseMode.addPerpendicular);
			}
			else{
				var edges = this.possibleCreases.filter(function(edge){
						return edge.madeBy.args.filter(function(p){
							if(p instanceof XY){ return p.equivalent(this.nearest.node, 0.0001); }
							return false;
						},this).length > 0;
					},this);
				this.setPossibleCreases(edges);
				this.selected = this.nearest;
			}
		break;
		case MouseMode.addPleatBetweenEdges:
			if(this.selected.edge != undefined){
				if(this.modifiers.pleatCount != undefined){
					this.cp.pleat(this.modifiers.pleatCount, this.selected.edge, this.nearest.edge)
						.filter(function(crease){ return crease != undefined; },this)
						.forEach(function(crease){ crease.mountain(); },this);
					this.cp.flatten();
					this.updateCreasePattern();
					this.setMouseMode(MouseMode.addPleatBetweenEdges);
				}
			}
			else{
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
	}
	this.updateCreasePattern();
	// this cannot be here. don't un-comment this
	// this.selected = this.cp.nearest(event.point);
}
project.onMouseMove = function(event){
	// what changed from frame to frame. only update complex calculations if necessary
	var didChange = this.updateNearestToMouse(event.point);
	this.updateStyles();
	switch(this.mouseMode){
		case MouseMode.addSectorBisector:
			if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor.alpha = 1.0; }
			if(this.nearest.edge != undefined){
				this.edges[this.nearest.edge.index].strokeColor = this.styles.byrne.yellow;
				this.edges[this.nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
			if(this.nearest.face != undefined){ this.faces[this.nearest.face.index].fillColor.alpha = 1.0}
			if(this.nearest.sector != undefined){ this.sectors[this.nearest.sector.index].fillColor.alpha = 1.0; }
			if(mouseMoveCallback != undefined){ mouseMoveCallback(event.point); }
		break;
		case MouseMode.addBetweenPoints:
			if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor = this.styles.byrne.yellow; }
			if(this.selected.node){ this.nodes[this.selected.node.index].fillColor = this.styles.byrne.yellow; }
			if(didChange.node){
				if(this.nearest.node){
					this.filterPossibleCreases(function(edge){ return edge.collinear(this.nearest.node); })
				} else{ this.setPossibleCreases([]); }
			}
		break;
		case MouseMode.addPointToPoint:
			if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor = this.styles.byrne.yellow; }
			if(this.selected.node){ this.nodes[this.selected.node.index].fillColor = this.styles.byrne.yellow; }
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
						return edge.madeBy.args.filter(function(edge){ return edge.equivalent(this.nearest.edge,0.0001); },this).length > 0;
					})
				} else{ this.setPossibleCreases([]); }
			}
		break;
		case MouseMode.addPerpendicular:
			if(this.selected.node){
				if(this.nearest.edge != undefined){ this.edges[this.nearest.edge.index].strokeColor = this.styles.byrne.yellow; }
				this.nodes[this.selected.node.index].fillColor = this.styles.byrne.yellow;
				if(didChange.edge){
					this.filterPossibleCreases(function(edge){
						return edge.madeBy.args.filter(function(e){
							if(e instanceof Edge){ return e.equivalent(this.nearest.edge); }
							return false;
						},this).length > 0;
					},this);
				}
			}
			else{
				if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor = this.styles.byrne.yellow; }
				if(didChange.node){
					this.filterPossibleCreases(function(edge){
						return edge.madeBy.args.filter(function(point){ 
							if(point instanceof Edge){return false;}
							return point.equivalent(this.nearest.node,0.0001);
						},this).length > 0;
					})
				} 
			}
		break;
		case MouseMode.addPleatBetweenEdges:
			if(this.nearest.edge != undefined){
				this.edges[this.nearest.edge.index].strokeColor = this.styles.byrne.yellow;
				this.edges[this.nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
			if(this.selected.edge != undefined){
				this.edges[this.selected.edge.index].strokeColor = this.styles.byrne.yellow;
				this.edges[this.selected.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
				if(didChange.edge){
					// var edges = this.cp.
				}				
			}
			else{

			}

		break;
		case MouseMode.removeCrease:
			if(this.nearest.edge != undefined){
				this.edges[this.nearest.edge.index].strokeColor = this.styles.byrne.yellow;
				this.edges[this.nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
		break;
		case MouseMode.flipCrease:
			if(this.nearest.edge !== undefined){
				// this.edges[this.nearest.edge.index].strokeColor = this.styles.byrne.yellow;
				this.edges[this.nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
		break;
		case MouseMode.addRabbitEar:
			if(this.nearest.node != undefined){ this.nodes[this.nearest.node.index].fillColor.alpha = 1.0; }
			if(this.nearest.edge != undefined){
				this.edges[this.nearest.edge.index].strokeColor = this.styles.byrne.yellow;
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
$("#modal-crease-window").draggable({ handle: ".modal-header" });

// IMPORT / EXPORT (called in import-export.js)
creasePatternDidUpload = function(cp){
	project.cp = cp;
	project.updateCreasePattern();
}

var menus1 = [
	document.getElementById("add-crease-sub-menu")
];
var menus2 = [
	document.getElementById("modifier-bisect"),
	document.getElementById("modifier-between-points"),
	document.getElementById("modifier-pleat"),
	document.getElementById("modifier-perpendicular")
];
// boot, hide all modifier panels
menus2.forEach(function(el){ el.style.display = "none"; },this);
menus2[0].style.display = "block";


// DOM HOOKS
document.getElementById("radio-input-mode").onchange = function(event){
	menus1.forEach(function(el){ el.style.display = "none"; },this);
	switch(event.target.id){
		case "radio-button-add-crease": project.setMouseMode(MouseMode.addSectorBisector); menus1[0].style.display = "block"; break;
		case "radio-button-remove-crease": project.setMouseMode(MouseMode.removeCrease); break;
		case "radio-button-flip-crease": project.setMouseMode(MouseMode.flipCrease); break;
	}
}
document.getElementById("radio-input-crease").onchange = function(event){
	menus2.forEach(function(el){ el.style.display = "none"; },this);
	switch(event.target.id){
		case "radio-button-bisect-sector": project.setMouseMode(MouseMode.addSectorBisector); menus2[0].style.display = "block"; break;
		case "radio-button-between-points": project.setMouseMode(MouseMode.addBetweenPoints); menus2[1].style.display = "block"; break;
		case "radio-button-point-to-point": project.setMouseMode(MouseMode.addPointToPoint); break;
		case "radio-button-edge-to-edge": project.setMouseMode(MouseMode.addEdgeToEdge); break;
		case "radio-button-pleat-between-edges": project.setMouseMode(MouseMode.addPleatBetweenEdges); menus2[2].style.display = "block"; break;
		case "radio-button-rabbit-ear": project.setMouseMode(MouseMode.addRabbitEar); break;
		case "radio-button-kawasaki": project.setMouseMode(MouseMode.addKawasakiFourth); break;
		case "radio-button-perpendicular": project.setMouseMode(MouseMode.addPerpendicular); menus2[3].style.display = "block";  break;
	}
}
// modifiers
document.getElementById("input-pleat-count").oninput = function(event){ project.modifiers.pleatCount = this.value; }
document.getElementById("radio-input-modifier-between-points").onchange = function(event){
	switch(event.target.id){
		case "radio-button-modifier-between-points-full": project.modifiers.betweenPoints = "full"; break;
		case "radio-button-modifier-between-points-segment": project.modifiers.betweenPoints = "segment"; break;
	}
}
document.getElementById("radio-input-modifier-perpendicular").onchange = function(event){
	switch(event.target.id){
		case "radio-button-modifier-perpendicular-full": project.modifiers.perpendicular = "full"; break;
		case "radio-button-modifier-perpendicular-segment": project.modifiers.perpendicular = "segment"; break;
	}
}


document.getElementById("new-file").addEventListener("click", newFileHandler);
document.getElementById("download-svg").addEventListener("click", downloadCPSVG);
document.getElementById("download-fold").addEventListener("click", downloadCPFOLD);

document.getElementById("what-is-this").addEventListener("click", whatIsThisHandler);

function newFileHandler(e){ e.preventDefault(); project.reset(); }
function downloadCPSVG(e){ e.preventDefault(); downloadCreasePattern(project.cp, "creasepattern", "svg"); }
function downloadCPFOLD(e){ e.preventDefault(); downloadCreasePattern(project.cp, "creasepattern", "fold"); }

function whatIsThisHandler(e){ e.preventDefault(); document.getElementById("modal-what-is-this").style.display = 'block'; }