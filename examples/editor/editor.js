var mouseMoveCallback = undefined;

var foldedProject = new OrigamiFold("canvas-folded").setPadding(0.1);
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
	"addKawasakiCollapse":9,
	"addPerpendicular":10,
	"inspectKawasaki":11
}; Object.freeze(MouseMode);

project.setEditorStyle = function(){
	this.style = this.defaultStyleTemplate();
	this.show.nodes = true;
	this.show.faces = true;
	this.show.sectors = true;
	this.style.face.fillColor = Object.assign({alpha:0.0}, this.styles.byrne.red);
	this.style.sector.fillColors = [
		Object.assign({alpha:0.0}, this.styles.byrne.blue), 
		Object.assign({alpha:0.0}, this.styles.byrne.blue) ];
	this.style.boundary.strokeColor = {gray:0.0, alpha:0.0};
	this.style.node.fillColor = Object.assign({alpha:0.0}, this.styles.byrne.red);
	this.style.node.radius = 0.015;
	this.style.sector.scale = 0.5;
}
project.setEditorStyle();

project.setByrneColors = function(){
	this.style.backgroundColor = { gray:1.0, alpha:1.0 };
	this.style.boundary.strokeColor = {gray:0.0};
	this.style.mountain.strokeColor = this.styles.byrne.red;
	this.style.valley.strokeColor = { hue:220, saturation:0.6, brightness:0.666 };
	this.style.border.strokeColor = { gray:0.0, alpha:1.0 };
	this.style.mark.strokeColor = { gray:0.0, alpha:1.0 };
	this.style.mountain.dashArray = null;
	this.style.valley.dashArray = [0.015, 0.02];
	this.style.border.dashArray = null;
	this.style.mark.dashArray = null;
	this.updateStyles();
}

project.setBlackAndWhiteColors = function(){
	this.style.backgroundColor = { gray:1.0, alpha:1.0 };
	this.style.boundary.strokeColor = { gray:0.0, alpha:1.0 };
	this.style.mountain.strokeColor = { gray:0.0, alpha:1.0 };
	this.style.valley.strokeColor = { gray:0.0, alpha:1.0 };
	this.style.border.strokeColor = { gray:0.0, alpha:1.0 };
	this.style.mark.strokeColor = { gray:0.0, alpha:1.0 };
	this.style.mountain.dashArray = null;
	this.style.valley.dashArray = [0.015, 0.02];
	this.style.border.dashArray = null;
	this.style.mark.dashArray = null;
	this.updateStyles();
}

project.ghostMarksLayer = new project.scope.Layer();
project.ghostMarksLayer.moveBelow(project.edgeLayer);
project.boundaryLayer.moveBelow(project.edgeLayer);
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
	this.cp.clean();
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
			p.strokeWidth = 0.0025;
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
			p.strokeWidth = 0.0025;
			return p
		},this);
}

project.reset = function(){
	this.cp.clear();
	this.selected = {};
	this.nearest = {};
	this.setPossibleCreases([]);
	this.updateCreasePattern();
	foldedProject.reset();
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
		case MouseMode.addKawasakiCollapse: break;
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
				this.cp.clean();
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
				this.cp.clean();
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
				this.cp.clean();
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
				this.cp.clean();
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
					this.cp.clean();
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
		case MouseMode.addKawasakiCollapse:
			if(this.nearest.face){
				var ray = this.nearest.sector.kawasakiCollapse();
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
				switch(nearest.edge.orientation){
					case CreaseDirection.mark: this.cp.removeEdge(nearest.edge); break;
					case CreaseDirection.mountain: 
					case CreaseDirection.valley: nearest.edge.mark(); break;
				}
				
			}
		break;
		case MouseMode.flipCrease:
			var nearest = this.cp.nearest(event.point);
			if(nearest.edge !== undefined){
				switch(nearest.edge.orientation){
					case CreaseDirection.mountain: nearest.edge.orientation = CreaseDirection.valley; break;
					case CreaseDirection.valley:   nearest.edge.orientation = CreaseDirection.mountain; break;
					case CreaseDirection.mark:     nearest.edge.orientation = CreaseDirection.mountain; break;
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

	if(this.mouseMode != MouseMode.inspectKawasaki){
		this.updateStyles();
	}
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
		case MouseMode.addKawasakiCollapse:
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

// special operations
project.style.errorColors = [project.styles.byrne.blue, project.styles.byrne.yellow];

project.colorNodesFlatFoldable = function(epsilon){
	if(epsilon == undefined){ epsilon = 0.01; }
	var problems = this.cp.junctions
		.map(function(j){ return { 'junction':j, 'foldable':j.flatFoldable(epsilon) }; },this)
		.filter(function(el){return !el.foldable; })
		.map(function(el){ return el.junction; },this);
		problems
			.filter(function(el){ return el.sectors.length % 2 == 1},this)
			.forEach(function(el){
				el.sectors.forEach(function(sector, i){
					this.sectors[ sector.index ].fillColor = this.styles.byrne.red
				},this);
			},this);
		problems
			.filter(function(el){ return el.sectors.length % 2 == 0},this)
			.forEach(function(el){
				var howWrong = el.kawasakiRating() / Math.PI;  // between 0 and 1
				el.sectors.forEach(function(sector, i){
					this.sectors[ sector.index ].fillColor = {hue:205 + (90*howWrong * ((i%2)*2-1)), saturation:0.74, brightness:0.61}
				},this);
			},this);
}

// modal stuff
$("#modal-what-is-this").draggable({ handle: ".modal-header" });
$("#modal-fold-window").draggable({ handle: ".modal-header" });
$("#modal-crease-window").draggable({ handle: ".modal-header" });
$("#modal-new-crease-pattern-window").draggable({ handle: ".modal-header" });

// IMPORT / EXPORT (called in import-export.js)
creasePatternDidUpload = function(cp){
	project.cp = cp;
	project.updateCreasePattern();
}

function collapseToolbar(){
	// [document.getElementById("radio-button-add-crease"),
	//  document.getElementById("radio-button-remove-crease"),
	//  document.getElementById("radio-button-flip-crease")].forEach(function(el){
	// 	el.checked = false;
	// },this);
	document.getElementById("radio-input-mode").childNodes.forEach(function(el){
		if(el.classList && el.classList.contains('active')){ el.classList.remove('active'); }
	},this);
	menus1.forEach(function(el){ el.style.display = "none"; },this);
	document.getElementById("radio-input-crease").childNodes.forEach(function(el){
		if(el.classList && el.classList.contains('active')){ el.classList.remove('active'); }
	},this);
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

function setMouseModeFromActiveSelection(){
	var activeSelection = Array.prototype.slice.call(document.getElementById("radio-input-crease").childNodes).filter(function(el){ return el.classList && el.classList.contains('active') },this).shift();
	if(activeSelection == undefined){ return; }
	var activeInput = Array.prototype.slice.call(activeSelection.childNodes).filter(function(el){return el.tagName == "INPUT";},this).shift();
	if(activeInput == undefined){ return; }
	switch(activeInput.id){
		case "radio-button-bisect-sector": project.setMouseMode(MouseMode.addSectorBisector); break;
		case "radio-button-between-points": project.setMouseMode(MouseMode.addBetweenPoints); break;
		case "radio-button-point-to-point": project.setMouseMode(MouseMode.addPointToPoint); break;
		case "radio-button-edge-to-edge": project.setMouseMode(MouseMode.addEdgeToEdge); break;
		case "radio-button-pleat-between-edges": project.setMouseMode(MouseMode.addPleatBetweenEdges); break;
		case "radio-button-rabbit-ear": project.setMouseMode(MouseMode.addRabbitEar); break;
		case "radio-button-kawasaki": project.setMouseMode(MouseMode.addKawasakiCollapse); break;
		case "radio-button-perpendicular": project.setMouseMode(MouseMode.addPerpendicular); break;
	}
}

// DOM HOOKS
document.getElementById("radio-input-mode").onchange = function(e){
	menus1.forEach(function(el){ el.style.display = "none"; },this);
	switch(e.target.id){
		case "radio-button-add-crease": e.preventDefault(); setMouseModeFromActiveSelection(); menus1[0].style.display = "block"; break;
		case "radio-button-remove-crease": e.preventDefault(); project.setMouseMode(MouseMode.removeCrease); break;
		case "radio-button-flip-crease": e.preventDefault(); project.setMouseMode(MouseMode.flipCrease); break;
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
		case "radio-button-kawasaki": project.setMouseMode(MouseMode.addKawasakiCollapse); break;
		case "radio-button-perpendicular": project.setMouseMode(MouseMode.addPerpendicular); menus2[3].style.display = "block";  break;
	}
}
// modifiers
document.getElementById("input-pleat-count").oninput = function(event){ project.modifiers.pleatCount = parseInt(this.value); }
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

document.getElementById("menu-foldability-kawasaki").addEventListener("click", kawasakiHandler);
document.getElementById("menu-cp-new").addEventListener("click", newCreasePatternHandler)
document.getElementById("menu-folded-save-fold").addEventListener("click", foldedSaveFoldHandler)
document.getElementById("menu-folded-save-svg").addEventListener("click", foldedSaveSVGHandler)
document.getElementById("menu-view-zoom").addEventListener("click", viewZoomHandler)
document.getElementById("menu-foldability-maekawa").addEventListener("click", foldabilityMaekawaHandler)
document.getElementById("menu-style-thick").addEventListener("click", styleThickHandler)
document.getElementById("menu-style-thin").addEventListener("click", styleThinHandler)
document.getElementById("menu-style-bw").addEventListener("click", styleBWHandler)
document.getElementById("menu-style-byrne").addEventListener("click", styleByrneHandler)
document.getElementById("menu-style-solid").addEventListener("click", styleSolidHandler)

document.getElementById("clear-crease-pattern").addEventListener("click", clearCPHandler);
document.getElementById("download-svg").addEventListener("click", downloadCPSVG);
document.getElementById("download-fold").addEventListener("click", downloadCPFOLD);

document.getElementById("what-is-this").addEventListener("click", whatIsThisHandler);

document.getElementById("new-cp-button-no").addEventListener("click", newCPButtonNoHandler);
document.getElementById("new-cp-button-yes").addEventListener("click", newCPButtonYesHandler);
document.getElementById("new-cp-polygon-shape").addEventListener("change", newCPPolygonShapeDidChange);

function clearCPHandler(e){ e.preventDefault(); project.reset(); }
function downloadCPSVG(e){ e.preventDefault(); downloadCreasePattern(project.cp, "creasepattern", "svg"); }
function downloadCPFOLD(e){ e.preventDefault(); downloadCreasePattern(project.cp, "creasepattern", "fold"); }

function whatIsThisHandler(e){ e.preventDefault(); document.getElementById("modal-what-is-this").style.display = 'block'; }
function kawasakiHandler(){
	collapseToolbar();
	project.setMouseMode(MouseMode.inspectKawasaki);
	project.colorNodesFlatFoldable();
}
function newCreasePatternHandler(){ document.getElementById("modal-new-crease-pattern-window").style.display = "block"; }
function foldedSaveFoldHandler(){
	var filename = "folded.fold"
	var foldObject = project.cp.fold();
	var foldFileBlob = JSON.stringify(foldObject);
	makeDownloadBlob(foldFileBlob, filename, "application/json");
}
function foldedSaveSVGHandler(){
	var filename = "folded.svg"
	var svgBlob = project.cp.foldSVG();
	makeDownloadBlob(svgBlob, filename, "image/svg+xml");
}
function viewZoomHandler(){ }
function foldabilityMaekawaHandler(){ }
function styleThickHandler(){ project.thickLines(); }
function styleThinHandler(){ project.thinLines(); }
function styleBWHandler(){ project.setBlackAndWhiteColors(); }
function styleByrneHandler(){ project.setByrneColors(); }
function styleSolidHandler(){ }

function newCPButtonNoHandler(){ document.getElementById("modal-new-crease-pattern-window").style.display = "none"; }
function newCPButtonYesHandler(){
	// if(text field contains text)
	project.reset();
	switch(document.getElementById("new-cp-polygon-shape").value){
		case "square": project.cp.square(); break;
		case "rectangle": project.cp.rectangle(2,1); break;
		case "regular polygon": 
			var sides = document.getElementById("new-cp-polygon-sides-count").value;
			if(sides > 2){ project.cp.polygon(sides); }
		break;
		// case "right triangle": project.cp.setBoundary([[0,0], [1,0], [0.5, -0.5]]); break;
		case "convex polygon": break; // read all those points etc..
	}
	project.updateCreasePattern();
	document.getElementById("modal-new-crease-pattern-window").style.display = "none";
}

function newCPPolygonShapeDidChange(e){
	document.getElementById("new-cp-input-polygon-points-div").style.display = "none";
	document.getElementById("new-cp-input-polygon-sides").style.display = "none";
	switch(this.value){
		case "square": break;
		case "rectangle": break;
		case "regular polygon": document.getElementById("new-cp-input-polygon-sides").style.display = "block"; break;
		// case "right triangle": break;
		case "convex polygon": document.getElementById("new-cp-input-polygon-points-div").style.display = "block"; break;
	}
}


