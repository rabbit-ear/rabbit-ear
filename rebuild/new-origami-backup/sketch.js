var div = document.getElementsByClassName('row')[0];
var paper = new RabbitEar.OrigamiView(div);
var folded = new RabbitEar.OrigamiView(div);

paper.cp = prepareFoldFile(RabbitEar.Origami.oneValleyFold);
folded.cp = RabbitEar.Origami.oneValleyFold
folded.zoom = 0.85;
folded.creases.setAttribute("opacity", 0.0);
folded.setViewBox();
paper.draw();
folded.draw();
folded.markLayer = folded.group();
folded.svg.appendChild(folded.markLayer);

let foldLine;

function prepareFoldFile(foldFile){
	let dontCopy = ["parent", "inherit"];
	let fold = JSON.parse(JSON.stringify(foldFile));
	if(fold.file_frames != undefined){
		var thing = key => !dontCopy.includes(key);
		let keys = Object.keys(fold.file_frames[0]).filter(key => !dontCopy.includes(key))
		// console.log("copying over " + keys.join(' ') + " from frame[0] to main");
		keys.forEach(key => fold[key] = fold.file_frames[0][key] )
	}
	fold.file_frames = null;
	return fold;
}

function duplicate(foldFile){ return JSON.parse(JSON.stringify(foldFile)); }

folded.onMouseDidBeginDrag = function(event){
	isDrawingLine = true;
	foldPoint = undefined;
}

folded.onMouseDown = function(event){
	this.startPoint = event.point;
	this.endPoint = event.point;
	// while(paper.selectedLayer.lastChild){paper.selectedLayer.removeChild(paper.selectedLayer.lastChild);}
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
	if(	isDrawingLine == false){  
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
		var result = RabbitEar.Origami.crease(foldedFoldFile, foldLine, foldPoint);
		if(result == undefined){ return;}
		console.log(result);
		// console.log(JSON.stringify(result));
		folded.cp = result;
		folded.draw();
		paper.cp = prepareFoldFile(result)
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
