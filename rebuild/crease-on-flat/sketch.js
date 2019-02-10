var div = document.getElementsByClassName('row')[0];
var origami = Origami(div);
var folded = Origami(div);

// setup for folded state
folded.autoResize = false;
folded.zoom = 0.85;
folded.setViewBox();
folded.markLayer = folded.group();
folded.svg.appendChild(folded.markLayer);

folded.startPoint = undefined;
folded.endPoint = undefined;
foldLine = undefined;

// setup for crease pattern
origami.selectedLayer = origami.group();
origami.svg.appendChild(origami.selectedLayer);
origami.selectedEdge = undefined;

var masterCP = new CreasePattern();

function update(){
	masterCP.clean();
	foldedCP = masterCP.fold();
	if(foldLine){
		origami.cp = masterCP.copy();
		creaseOnFoldedForm(foldLine, origami.cp, foldedCP);
		folded.cp = origami.cp.copy();
		origami.draw();
		var centerFace = folded.cp.nearest(0.5, 0.501).face;
		folded.draw( centerFace );
	}
}
update();

folded.onMouseDown = function(event){
	this.startPoint = event.point;
	this.endPoint = event.point;

	while(origami.selectedLayer.lastChild){ origami.selectedLayer.removeChild(origami.selectedLayer.lastChild); }
}
folded.onMouseMove = function(event){
	if(this.mouse.isPressed){
		this.endPoint = event.point;
		foldLine = updateCreaseLine(this.startPoint, this.endPoint);
		if(foldLine){
			update();
		}
	}
}
folded.onMouseUp = function(event){
	this.startPoint = undefined;
	this.endPoint = undefined;
	update();
	masterCP = origami.cp.copy();
	folded.setViewBox()
}

function updateCreaseLine(point1, point2){
	while(folded.markLayer.lastChild){ folded.markLayer.removeChild(folded.markLayer.lastChild); }
		var origin = { x:Math.random(), y:Math.random() };
	var edge = new RabbitEar.Geometry.Edge(point1.x, point1.y, point2.x, point2.y);
	var line = edge.infiniteLine();
	var foldEdge = masterCP.boundary.clipLine(line);
	if(foldEdge){
		var svgLine = folded.line(foldEdge.nodes[0].x, foldEdge.nodes[0].y, foldEdge.nodes[1].x, foldEdge.nodes[1].y, 'valley');
		folded.markLayer.appendChild(svgLine);
		var node0 = folded.circle(folded.startPoint.x, folded.startPoint.y, 0.01, 'blue-node');
		var node1 = folded.circle(folded.endPoint.x, folded.endPoint.y, 0.01, 'blue-node');
		folded.markLayer.appendChild(node0);
		folded.markLayer.appendChild(node1);
	}
	return line;
}

function creaseOnFoldedForm(line, cp, f){
	// generate the geometry for a random crease line
	var matrices = f["faces_matrix"].map(function(n){ 
		return new RabbitEar.Geometry.Matrix(n[0], n[1], n[2], n[3], n[4], n[5]);
	},this);
	var coloring = f["faces_coloring"];

	var faces = f.faces_vertices.map(function(nodeArray){
		return nodeArray.map(function(n){ return f.vertices_coords[n]; },this);
	},this);

	var newCreases = cp.faces.map(function(f, i){
		var transformedLine = line.transform(matrices[i].inverse());
		return f.clipLine(transformedLine);
	},this);

	newCreases
		.forEach(function(c, i){
			if(c != undefined){
				var crease = cp.crease(c);
				if(crease != undefined){ 
					if(coloring[i] == 0){ crease.valley(); }
					else{ crease.mountain(); }
				}
			}
		},this);

	cp.clean();
}


origami.onMouseMove = function(event){
	this.update();
	var nearest = this.cp.nearest(event.point);
	// this.addClass(this.get(nearest.node), 'fill-dark-blue');
	this.addClass(this.get(nearest.edge), 'stroke-yellow');
	// this.addClass(this.get(nearest.face), 'fill-red');
	// this.addClass(this.get(nearest.sector), 'fill-blue');
}

origami.onMouseDown = function(event){
	var nearest = this.cp.nearest(event.point).edge;
	this.selectedEdge = nearest;
	if(this.selectedEdge){
		var sl = this.line(nearest.nodes[0].x, nearest.nodes[0].y, nearest.nodes[1].x, nearest.nodes[1].y, 'mountain stroke-yellow');
		this.selectedLayer.appendChild(sl);
	}
	// this.addClass(this.get(nearest.node), 'fill-dark-blue');
	// this.addClass(this.get(nearest.edge), 'stroke-yellow');
}
