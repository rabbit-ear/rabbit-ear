var wobble_intersections_callback = undefined;

var wobble = new OrigamiPaper("canvas-intersection-wobble", new PlanarGraph());
wobble.setBounds(-10,-5,20,10);

wobble.intersections = [];
wobble.faceLayer = new wobble.scope.Layer();
wobble.intersectionLayer = new wobble.scope.Layer();

wobble.cpForFaces = new PlanarGraph();
wobble.style.mark.strokeColor = {gray:0.0};

var red = {hue:0.04*360, saturation:0.87, brightness:0.90 };
var yellow = {hue:0.12*360, saturation:0.88, brightness:0.93 };
var blue = {hue:0.53*360, saturation:0.82, brightness:0.28 };

wobble.reset = function(){
	paper = this.scope; 
	var numLines = 7;
	this.cp.clear();
	this.cp.newNode();
	for(var i = 0; i < numLines; i++){
		this.cp.newPlanarEdgeFromNode(this.cp.nodes[i], Math.random(), Math.random());
	}
	this.draw();
	for(var i = 0; i < this.edgeLayer.children.length; i++){
		this.edgeLayer.children[i].strokeColor = {gray:0.0};
	}
	// this.nodeLayer.visible = true;
	this.edgeLayer.bringToFront();
	this.intersectionLayer.bringToFront();
}
wobble.reset();

wobble.onFrame = function(event) { 
	paper = this.scope;

	var centerX = (this.canvas.width / this.canvas.height);
	var scale = 0.666;
	var xscale = 1.5;
	for(var i = 0; i < this.cp.nodes.length; i++){
		var xnoise = p5js.noise(i*31.111+p5js.millis()*0.0002 / xscale);
		var ynoise = p5js.noise(i*44.22+10+p5js.millis()*0.0002);

		this.cp.nodes[i].x = xnoise;
		this.cp.nodes[i].y = ynoise;

		// if(xnoise < 0.5) this.cp.nodes[i].x = -Math.pow(2*(0.5-xnoise), 0.8)*scale + 0.5;
		// else             this.cp.nodes[i].x = Math.pow(2*(xnoise-0.5), 0.8)*scale + 0.5;

		this.cp.nodes[i].x *= xscale;

		// if(ynoise < 0.5) this.cp.nodes[i].y = -Math.pow(2*(0.5-ynoise), 0.8)*scale + 0.5;
		// else             this.cp.nodes[i].y = Math.pow(2*(ynoise-0.5), 0.8)*scale + 0.5;
		// this.cp.nodes[i].y = Math.sqrt(ynoise);
	}

	this.updatePositions();

	this.cpForFaces = this.cp.copy();
	this.cpForFaces.fragment();
	this.cpForFaces.flatten();

	this.faceLayer.activate();
	this.faceLayer.removeChildren();
	for(var i = 0; i < this.cpForFaces.faces.length; i++){
		var face = new this.scope.Path({segments:this.cpForFaces.faces[i].nodes,closed:true});
		face.fillColor = yellow;
		this.faces.push( face );
	}

	// this.draw();
	// for(var i = 0; i < this.edgeLayer.children.length; i++){
	// 	this.edgeLayer.children[i].strokeColor = {gray:0.0};
	// }

	this.intersections = this.cp.getEdgeIntersections();

	this.intersectionLayer.activate();
	this.intersectionLayer.removeChildren();
	for(var i = this.intersections.length-1; i >= 0 ; i--){
		new this.scope.Shape.Circle({
			position: this.intersections[i],
			fillColor: red,
			radius: 0.0133
		});
	}

	if(wobble_intersections_callback != undefined){
		wobble_intersections_callback(this.intersections);
	}

}

wobble.onResize = function(event) { }
wobble.onMouseDown = function(event){ }
wobble.onMouseUp = function(event){ }
wobble.onMouseMove = function(event) { }
