var div = document.getElementsByClassName('row')[0];
var origami = RabbitEar.Origami(div);
var folded = RabbitEar.Origami(div);

// folded.mouseZoom = false;
// folded.rotation = 180;
origami.centerPoint = {x:0.5, y:0.5};

function updateFoldedState(cp){
	folded.cp = cp.copy();
	var topFace = folded.nearest(0.5, 0.002).face;
	folded.draw(topFace);
}

origami.updateCenter = function(point){
	origami.centerPoint.x = point.x;
	origami.centerPoint.y = point.y;

	let cp = JSON.parse(JSON.stringify(RabbitEar.bases.square));
	// cp.edges_vertices = cp.edges_vertices.concat([[0,4], [1,4], [3,4]]);
	// cp.edges_assignment = cp.edges_assignment.concat(["V", "V", "V"]);

	cp.vertices_coords.push([point.x, point.y]);
	delete cp.vertices_vertices;
	delete cp.vertices_faces;
	cp.edges_vertices = cp.edges_vertices.concat([[0,4], [1,4], [3,4], [2,4]]);
	delete cp.edges_faces;
	cp.edges_assignment = cp.edges_assignment.concat(["V", "V", "V", "V"]);
	delete cp.edges_foldAngle;
	delete cp.edges_length;
	cp.faces_vertices = [[1,4,0],[2,4,1],[3,4,2],[0,4,3]];
	delete cp.faces_edges;

	origami.cp = cp;
	folded.cp = origami.fold();
	// console.log(folded.cp);

	// origami.mountain().crease([0,0], [0.5,0.5]);
	// origami.crease([0,0], [0.5,0.5]).mountain();

	// origami.crease(0, 0, origami.centerPoint.x, origami.centerPoint.y).mountain();
	// origami.crease(1, 1, origami.centerPoint.x, origami.centerPoint.y).mountain();
	// var cornerCrease = this.cp.crease(1, 0, this.centerPoint.x, this.centerPoint.y);
	// var kawasakiCrease = this.cp.kawasakiCollapse(this.centerPoint);
	// var a = {x:0,y:0};
	// var b = {x:1,y:1};
	// var cross = (b.x - a.x)*(this.centerPoint.y - a.y) > (b.y - a.y)*(this.centerPoint.x - a.x);
	// // console.log(cross)
	// if((b.x - a.x)*(this.centerPoint.y - a.y) > (b.y - a.y)*(this.centerPoint.x - a.x)){ 
	// 	cornerCrease.valley(); kawasakiCrease.mountain();
	// } else{
	// 	kawasakiCrease.valley(); cornerCrease.mountain();
	// }	
	// updateFoldedState(origami.cp);
	// origami.draw();
}

origami.onMouseMove = function(mouse){
	if(mouse.isPressed){
		origami.updateCenter(mouse);
	}
}

origami.onMouseDown = function(mouse){
	origami.updateCenter(mouse);
}

origami.updateCenter({x:0.5, y:0.505});
