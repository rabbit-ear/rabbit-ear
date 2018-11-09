// var foldFile = {"file_spec":1.1,"file_creator":"Rabbit Ear","file_author":"Robby Kraft","file_classes":["singleModel"],"frame_attributes":["2D"],"frame_title":"one valley crease","frame_classes":["foldedState"],"vertices_coords":[[0.62607055447,1.172217339808],[1.182184366474,0.341111192497],[1,1],[0,1],[1,0.21920709774914016],[0,0.7532979469531602]],"vertices_vertices":[[1,3],[4,0],[3,4],[0,2],[2,5,1],[0,4,3]],"vertices_faces":[[0],[0],[1],[1],[1,0],[0,1]],"edges_vertices":[[0,1],[1,4],[4,5],[5,0],[4,2],[2,3],[3,5]],"edges_faces":[[0],[0],[1,0],[0],[1],[1],[1]],"edges_assignment":["B","B","M","B","B","B","B"],"edges_foldAngle":[0,0,180,0,0,0,0],"faces_vertices":[[0,1,4,5],[2,3,5,4]],"faces_edges":[[0,1,2,3],[5,6,2,4]],"faces_layer":[0,1],"faces_matrix":[[0.5561138120038558,-0.8311061473112445,-0.8311061473112445,-0.5561138120038558,0.6260705544697115,1.172217339807961],[1,0,0,1,0,0]],"file_frames":[{"frame_classes":["creasePattern"],"parent":0,"inherit":true,"vertices_coords":[[0,0],[1,0],[1,1],[0,1],[1,0.21920709774914016],[0,0.7532979469531602]],"edges_foldAngle":[0,0,0,0,0,0,0],"faces_layer":[0,1],"faces_matrix":[[1,0,0,1,0,0],[1,0,0,1,0,0]]}]};


// var foldFile = {"vertices_coords":[[0.62607055447,1.172217339808],[1.182184366474,0.341111192497],[1,1],[0.09125259834688448,0.9087474026840066],[1,0.21920709774914016],[0,0.7532979469531602],[0.09125259731599344,1],[0,0.9087474016531155]],"edges_vertices":[[0,1],[1,4],[4,5],[0,5],[6,7],[5,7],[2,4],[2,6],[3,6],[3,7]],"edges_assignment":["B","B","M","B","V","B","B","B","B","B"],"faces_vertices":[[0,1,4,5],[6,7,5,4,2],[6,3,7]],"faces_edges":[[0,1,2,3],[4,5,2,6,7],[8,9,4]],"faces_layer":[0,1,2],"faces_matrix":[[0.5561138120038558, -0.8311061473112445, -0.8311061473112445, -0.5561138120038558, 0.6260705544697115, 1.172217339807961],[1, 0, 0, 1, 0, 0],[-1.129711496572483e-8, 1, 1, 1.129711496572483e-8, -0.9087474016531155, 0.9087473913868916]],"file_spec":1.1,"file_creator":"Rabbit Ear","file_author":"Robby Kraft","file_classes":["singleModel"],"frame_attributes":["2D"],"frame_title":"two crease","frame_classes":["foldedState"],"file_frames":[{"frame_classes":["creasePattern"],"parent":0,"inherit":true,"vertices_coords":[[0, 0],[1, 0],[1, 1],[0, 1],[1, 0.21920709774914],[0, 0.75329794695316],[0.091252597315993, 1],[0, 0.908747401653116]]}]};

var starterFold = {"file_spec":1.1,"file_creator":"Rabbit Ear","file_author":"Robby Kraft","file_classes":["singleModel"],"frame_attributes":["2D"],"frame_title":"two crease","frame_classes":["foldedState"],"vertices_coords":[[0.62607055447,1.172217339808],[0.4407254960573305,0.9095629149556625],[1,1],[0.09125259834688448,0.9087474026840066],[0.3703005755642845,0.7019765900752024],[0,0.7532979469531602],[0.09125259731599344,1],[0,0.9087474016531155],[0.9078611479327623,0.7510843101546525],[0.6453195390981368,0.40863868630828964],[1,0.8712654380783713]],"edges_vertices":[[8,9],[5,9],[0,5],[0,8],[5,7],[9,10],[2,10],[2,6],[6,7],[3,6],[3,7],[1,8],[1,4],[4,9],[4,10]],"edges_assignment":["M","M","B","B","B","V","B","B","V","B","B","B","B","M","B"],"faces_vertices":[[8,9,5,0],[7,5,9,10,2,6],[6,3,7],[8,1,4,9],[9,4,10]],"faces_edges":[[0,1,2,3],[4,1,5,6,7,8],[9,10,8],[11,12,13,0],[13,14,5]],"faces_layer":[0,1,2,4,3],"faces_matrix":[[0.5561138120038558,-0.8311061473112445,-0.8311061473112445,-0.5561138120038558,0.6260705544697115,1.172217339807961],[1,0,0,1,0,0],[-1.129711496572483e-8,1,1,1.129711496572483e-8,-0.9087474016531155,0.9087473913868916],[-0.9469872417978452,0.32127116875329675,-0.32127116875329675,-0.9469872417978452,1.3877127378550145,0.5882917462018744],[-0.25962224165048364,0.9657102524258391,0.9657102524258391,0.25962224165048364,0.4182322755139104,-0.32064470045396515]],"file_frames":[{"frame_classes":["creasePattern"],"parent":0,"inherit":true,"vertices_coords":[[0,0],[1,0],[1,1],[0,1],[1,0.21920709774914],[0,0.75329794695316],[0.091252597315993,1],[0,0.908747401653116],[0.506713890898239,0],[0.645319539098137,0.408638686308289],[1,0.871265438078371]]}]};

var div = document.getElementsByClassName('row')[0];
var paper = new RabbitEar.Origami(div, starterFold);
var folded = new RabbitEar.Origami(div, starterFold);
folded.setPadding(0.1);
// var paper = new RabbitEar.Origami(div);
// var folded = new RabbitEar.Origami(div).setPadding(0.1);
paper.setFrame(0);
paper.draw();
folded.draw();
folded.markLayer = folded.paint.group();
folded.svg.appendChild(folded.markLayer);

let foldLine;

function duplicate(foldFile){ return JSON.parse(JSON.stringify(foldFile)); }

// folded.onMouseDidBeginDrag = function(event){
// 	isDrawingLine = true;
// 	foldPoint = undefined;
// }

folded.event.onMouseDown = function(event){
	foldPoint = undefined;
	folded.startPoint = event.position;
	folded.endPoint = event.position;
}
folded.event.onMouseMove = function(event){
	if(folded.mouse.isPressed){
		isDrawingLine = true;
		folded.endPoint = event.position;
		foldLine = updateCreaseLine(folded.startPoint, folded.endPoint);
	}
}
folded.event.onMouseUp = function(event){
	if(isDrawingLine == false){
		// we made a point
		foldPoint = event.position;
	}
	isDrawingLine = false;
	folded.startPoint = undefined;
	folded.endPoint = undefined;
	update();
}

function update(){
	if(foldLine){
		var foldedFoldFile = duplicate(folded.cp);
		var result = RabbitEar.fold.valleyFold(foldedFoldFile, foldLine, foldPoint);
		if(result == undefined){ return;}
		folded.cp = result;
		folded.draw();
		paper.cp = duplicate(folded.cp);
		paper.setFrame(0);
		paper.draw();
	}
}

function updateCreaseLine(point1, point2){
	RabbitEar.removeChildren(folded.markLayer);
	var vec = {x:point2.x - point1.x, y:point2.y - point1.y};
	var d = Math.sqrt(Math.pow(vec.x,2) + Math.pow(vec.y,2));
	if(d <= 0){ d = 0.000001; }
	var normalized = {x:vec.x / d, y:vec.y / d};

	var svgLine = folded.paint.line(
		point1.x + normalized.x * 10,
		point1.y + normalized.y * 10,
		point1.x - normalized.x * 10,
		point1.y - normalized.y * 10,
		'valley');
	folded.markLayer.appendChild(svgLine);
	var node0 = folded.paint.circle(folded.startPoint.x, folded.startPoint.y, 0.01, 'blue-node');
	var node1 = folded.paint.circle(folded.endPoint.x, folded.endPoint.y, 0.01, 'blue-node');
	folded.markLayer.appendChild(node0);
	folded.markLayer.appendChild(node1);
	return {point:point1, direction:normalized};
}
