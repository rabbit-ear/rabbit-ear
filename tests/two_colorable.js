var twoColorable = new OrigamiPaper("canvas-two-colorable").setPadding(0);
twoColorable.show.faces = true;
twoColorable.show.edges = false;
twoColorable.show.boundary = false;
twoColorable.style.face.scale = 1.0;

twoColorable.load("../files/svg/crane.svg", function(){
	twoColorable.reset();
});

twoColorable.reset = function(){
	this.cp.clean();
	this.draw();
	var colors = [this.styles.byrne.yellow, this.styles.byrne.darkBlue];
	var tree = this.cp.faces[0].adjacentFaceTree();
	function recurse(tree, level){
		var face = tree.obj;
		twoColorable.faces[ face.index ].fillColor = colors[ level%2 ];
		tree.children.forEach(function(child){ recurse(child, level + 1); });
	}
	recurse(tree, 0);
}
twoColorable.reset();

twoColorable.onFrame = function(event) { }
twoColorable.onResize = function(event) { }
twoColorable.onMouseDown = function(event){ }
twoColorable.onMouseUp = function(event){ }
twoColorable.onMouseMove = function(event) { }
