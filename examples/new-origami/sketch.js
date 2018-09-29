var div = document.getElementsByClassName('row')[0];
var paper = new OrigamiPaper(div);
var folded = new OrigamiFold(div);

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
paper.selectedLayer = paper.group();
paper.svg.appendChild(paper.selectedLayer);
paper.selectedEdge = undefined;

var origami = new Origami();
var backupCP = duplicate(origami.unfolded);
var backupFolded = duplicate(origami.folded);
//////

var tempCP = new CreasePattern();
tempCP.setBoundary([ [-1,-1], [2,-1], [2,2], [-1,2] ]);

function duplicate(foldFile){ return JSON.parse(JSON.stringify(foldFile)); }

function updateCPandFold(){
	paper.cp = new CreasePattern().importFoldFile(origami.unfolded);
	folded.cp = new CreasePattern().importFoldFile(origami.unfolded);
	paper.draw();
	var centerFace = folded.cp.nearest(0.5, 0.501).face;
	folded.draw( centerFace );
}
updateCPandFold();

function update(){
	if(foldLine){
		origami.unfolded = duplicate(backupCP);
		origami.folded = duplicate(backupFolded);
		origami.crease(foldLine);
		updateCPandFold();
	}
}

folded.onMouseDown = function(event){
	this.startPoint = event.point;
	this.endPoint = event.point;
	while(paper.selectedLayer.lastChild){paper.selectedLayer.removeChild(paper.selectedLayer.lastChild);}
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
	backupCP = duplicate(origami.unfolded);
	backupFolded = duplicate(origami.folded);
	folded.setViewBox();
}

function updateCreaseLine(point1, point2){
	while(folded.markLayer.lastChild){ folded.markLayer.removeChild(folded.markLayer.lastChild); }
		var origin = { x:Math.random(), y:Math.random() };
	var edge = new RabbitEar.Geometry.Edge(point1.x, point1.y, point2.x, point2.y);
	var line = edge.infiniteLine();
	var foldEdge = tempCP.boundary.clipLine(line);
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
