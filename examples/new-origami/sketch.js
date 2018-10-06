
const oneValleyFold = {
	"file_spec": 1.1,
	"file_creator": "Rabbit Ear",
	"file_author": "Robby Kraft",
	"file_classes": ["singleModel"],
	"frame_attributes": ["2D"],
	"frame_title": "one valley crease",
	"frame_classes": ["foldedState"],
	"vertices_coords": [
		[0.62607055447, 1.172217339808],
		[1.182184366474, 0.341111192497],
		[1, 1],
		[0, 1],
		[1, 0.21920709774914016],
		[0, 0.7532979469531602]
	],
	"vertices_vertices": [[1,3], [4,0], [3,4], [0,2], [2,5,1], [0,4,3]],
	"vertices_faces": [[0], [0], [1], [1], [1,0], [0,1]],
	"edges_vertices": [[0,1], [1,4], [4,5], [5,0], [4,2], [2,3], [3,5]],
	"edges_faces": [[0], [0], [1,0], [0], [1], [1], [1]],
	"edges_assignment": ["B","B","V","B","B","B","B"],
	"edges_foldAngle": [0, 0, 180, 0, 0, 0, 0],
	"faces_vertices": [[0,1,4,5], [2,3,5,4]],
	"faces_edges": [[0,1,2,3], [5,6,2,4]],
	"faces_layer": [0,1],
	"faces_matrix": [
		[0.5561138120038558, -0.8311061473112445, -0.8311061473112445, -0.5561138120038558, 0.6260705544697115, 1.172217339807961],
		[1, 0, 0, 1, 0, 0]
	],
	"file_frames": [{
		"frame_classes": ["creasePattern"],
		"parent": 0,
		"inherit": true,
		"vertices_coords": [[0,0], [1,0], [1,1], [0,1], [1,0.21920709774914016], [0,0.7532979469531602]],
		"edges_foldAngle": [0, 0, 0, 0, 0, 0, 0],
		"faces_layer": [0,1],
		"faces_matrix": [[1,0,0,1,0,0], [1,0,0,1,0,0]],
	}]
};


var div = document.getElementsByClassName('row')[0];
var paper = new RabbitEar.OrigamiView(div, duplicate(oneValleyFold));
var folded = new RabbitEar.OrigamiView(div, duplicate(oneValleyFold)).setPadding(0.1);
paper.setFrame(0);
paper.draw();
folded.draw();
folded.markLayer = folded.group();
folded.svg.appendChild(folded.markLayer);

let foldLine;

function duplicate(foldFile){ return JSON.parse(JSON.stringify(foldFile)); }

folded.onMouseDidBeginDrag = function(event){
	isDrawingLine = true;
	foldPoint = undefined;
}

folded.onMouseDown = function(event){
	this.startPoint = event.point;
	this.endPoint = event.point;
}
folded.onMouseMove = function(event){
	if(this.mouse.isPressed){
		this.endPoint = event.point;
		foldLine = updateCreaseLine(this.startPoint, this.endPoint);
	}
}
folded.onMouseUp = function(event){
	if(isDrawingLine == false){
		// we made a point
		foldPoint = event.point;
	}
	isDrawingLine = false;
	this.startPoint = undefined;
	this.endPoint = undefined;
	update();
}

function update(){
	if(foldLine){
		var foldedFoldFile = duplicate(folded.cp);
		var result = RabbitEar.Origami.valleyFold(foldedFoldFile, foldLine, foldPoint);
		if(result == undefined){ return;}
		folded.cp = result;
		folded.draw();
		paper.cp = duplicate(folded.cp);
		paper.setFrame(0);
		paper.draw();
	}
}

function updateCreaseLine(point1, point2){
	folded.removeChildren(folded.markLayer);
	var vec = {x:point2.x - point1.x, y:point2.y - point1.y};
	var d = Math.sqrt(Math.pow(vec.x,2) + Math.pow(vec.y,2));
	if(d <= 0){ d = 0.000001; }
	var normalized = {x:vec.x / d, y:vec.y / d};

	var svgLine = folded.line(
		point1.x + normalized.x * 10,
		point1.y + normalized.y * 10,
		point1.x - normalized.x * 10,
		point1.y - normalized.y * 10,
		'valley');
	folded.markLayer.appendChild(svgLine);
	var node0 = folded.circle(folded.startPoint.x, folded.startPoint.y, 0.01, 'blue-node');
	var node1 = folded.circle(folded.endPoint.x, folded.endPoint.y, 0.01, 'blue-node');
	folded.markLayer.appendChild(node0);
	folded.markLayer.appendChild(node1);
	return {point:point1, direction:normalized};
}
