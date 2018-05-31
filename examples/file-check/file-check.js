var sliderUpdateTimer;
var slider = new Slider('#epsilon-slider').on("slide",sliderUpdate);
function sliderUpdate(value){
	var v = value / 1000;
	var epsilon = parseFloat(Math.pow(v,20).toFixed(11));
	// var epsilon = Math.pow(v,20);
	document.getElementById("epsilon-value").value = epsilon;
	// updateEpsilon(v);
	if(sliderUpdateTimer != undefined){ clearTimeout(sliderUpdateTimer); }
	sliderUpdateTimer = setTimeout(updateEpsilon.bind(null, epsilon), 200);
}
sliderUpdate(400);
/////////////////////////////////////////////////////////////////
function download(text, filename){
	var blob = new Blob([text], {type: "image/svg+xml"});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
// button to download
document.getElementById("download-svg").addEventListener("click", function(e){
	e.preventDefault();
	var svgBlob = panel3.cp.exportSVG();
	download(svgBlob, "creasepattern.svg", "image/svg+xml");
});
document.getElementById("download-fold").addEventListener("click", function(e){
	e.preventDefault();
	var foldObject = panel3.cp.exportFoldFile();
	var foldFileBlob = JSON.stringify(foldObject);
	download(foldFileBlob, "creasepattern.fold", "application/json");
});
////////////////////////////////////////////////////////////////////
var panel1 = new OrigamiPaper("canvas-1").mediumLines();
var panel2 = new OrigamiPaper("canvas-2").mediumLines().blackAndWhite();
var panel3 = new OrigamiPaper("canvas-3").mediumLines().blackAndWhite();
var panel4 = new OrigamiPaper("canvas-4").mediumLines().blackAndWhite();
var panel5 = new OrigamiPaper("canvas-5").mediumLines();
[panel2, panel3, panel4, panel5].forEach(function(el){el.show.boundary = false;},this);
panel2.show.faces = true;
panel3.show.faces = false;
panel4.show.faces = true;
panel4.style.face.fillColor = {gray:0.9};
panel4.style.face.scale = 1.0;
panel4.show.edges = false;
panel5.show.faces = true;
var foldedState = new OrigamiFold("canvas-folded-state");

panel2.onMouseMove = function(event){
	// var nearest = this.cp.nearest(event.point);
	// this.updateStyles();
	// if(nearest.edge !== undefined){ this.edges[nearest.edge.index].strokeColor = yellow; }
}
panel3.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.edge !== undefined){ 
		this.edges[nearest.edge.index].strokeColor = this.styles.byrne.red;
		nearest.edge.adjacentEdges().forEach(function(edge){
			this.edges[edge.index].strokeColor = this.styles.byrne.yellow;
		},this);
	}
}
panel4.onMouseMove = function(event){
	// var nearest = this.cp.nearest(event.point);
	// this.updateStyles();
	// if(nearest.face !== undefined){
	// 	this.faces[nearest.face.index].fillColor = this.styles.byrne.red;
	// 	nearest.face.edgeAdjacentFaces().forEach(function(face){
	// 		this.faces[face.index].fillColor = this.styles.byrne.yellow;
	// 	},this);
	// }
}
panel4.reset = function(){
	var colors = [this.styles.byrne.yellow, this.styles.byrne.darkBlue];
	var tree = this.cp.faces[0].adjacentFaceTree();
	function recurse(tree, level){
		var face = tree.obj;
		panel4.faces[ face.index ].fillColor = colors[ level%2 ];
		tree.children.forEach(function(child){ recurse(child, level + 1); });
	}
	recurse(tree, 0);
}

function updateEpsilon(newEpsilon){
	sliderUpdateTimer = undefined;
	var cp = panel1.cp.copy();
	cp.flatten(newEpsilon);
	[panel2, panel3, panel4, panel5].forEach(function(panel){
		panel.cp = cp.copy();
		panel.draw();
	},this);
	panel4.reset();
	foldedState.cp = cp.copy();
	foldedState.draw();
}

function updateFoldedState(cp){
	foldedState.cp = cp.copy();
	foldedState.draw();
	foldedState.style = { face:{ fillColor:{ gray:0.0, alpha:0.1 } } };
	foldedState.update();
}
// incoming file from upload-button or drag-to-upload
function fileDidLoad(file){
	// try{
	// 	// try .fold file format first
	// 	var foldFile = JSON.parse(file);
	// 	panel1.cp.importFoldFile(foldFile);
	// 	panel1.draw();
	// 	updateFoldedState(panel1.cp);
	// } catch(err){
		panel1.loadRaw(file);
		// try .svg file format
		panel2.load(file, function(){
			// panel2.cp.clean(0.0001);
			panel3.cp = panel2.cp.copy();
			panel4.cp = panel2.cp.copy();
			panel5.cp = panel2.cp.copy();
			panel4.cp.flatten();
			[panel3, panel4, panel5].forEach(function(el){el.draw();},);
			panel4.reset();
			updateFoldedState(panel2.cp);
		});
	// }
}