
var twistTriAnim = new OrigamiPaper("canvas-twist-triangle-animated");

twistTriAnim.threeValidVectors = function(){
	// make 3 fan lines with a good sized interior angle between them
	var angles = [];
	do{
		angles = [Math.random()*Math.PI*2];
		angles.push(angles[0] - Math.PI*0.5 - Math.random()*Math.PI*0.5);
		angles.push(angles[1] - Math.PI*0.5 - Math.random()*Math.PI*0.5);
	}while(!angles
		.map(function(angle,i){
			var nextAngle = angles[ (i+1)%angles.length ];
			return clockwiseInteriorAngleRadians(angle, nextAngle);
		},this)
		.map(function(interior){ return interior > Math.PI*0.6; })
		.reduce(function(prev, curr){return prev && curr;},true)
	);
	return angles.map(function(angle){return new XY(Math.cos(angle), Math.sin(angle));},this);
}

twistTriAnim.reset = function(){
	this.cp.clear();
	var vectors = this.threeValidVectors();

	// crease vectors
	vectors.map(function(vector){ return new Ray(new XY(0.5, 0.5), vector); },this)
		.map(function(ray){ return this.cp.crease(ray); },this)
		.filter(function(crease){return crease != undefined;},this)
		.forEach(function(crease){ crease.mountain(); },this);
	this.cp.clean();

	var centerNode = this.cp.nearest(0.5, 0.5).node;
	var sectors = centerNode.junction().sectors;

	var kawasakis = sectors
		.map(function(sector){ return centerNode.junction().kawasakiFourth(sector); })
		.map(function(vector){ return new Ray(0.5, 0.5, vector.x, vector.y)},this);

	var pleats = kawasakis
		.map(function(ray){ return ray.origin.add(ray.direction.scale(0.2)); },this)
		.map(function(el,i){return new Line(el, sectors[i].edges[0].vector(centerNode));},this);

	var newTriNodes = pleats
		.map(function(el){ return new Ray(el.point, el.direction.rotate180());},this)
		.map(function(ray){ return ray.intersectionsWithEdges(this.cp.edges).shift(); },this)
		.filter(function(el){return el!=undefined},this);

	// crease triangle squash
	newTriNodes.map(function(el,i){
			var nextEl = newTriNodes[ (i+1)%newTriNodes.length ];
			return this.cp.crease(el, nextEl);
		},this)
		.filter(function(el){return el!=undefined;},this)
		.forEach(function(el){el.mountain();},this);
	
	// crease pleats
	pleats.map(function(el){ return this.cp.creaseAndStop(el); },this)
		.filter(function(el){return el!=undefined},this)
		.forEach(function(el){el.valley();},this);

	// remove center creases that were removed by squash
	this.cp.clean();
	var squashedLines = [0,1,2].map(function(el){
			var edge = this.cp.nearest(0.5, 0.5).edge;
			var nodes = edge.nodes.map(function(el){return {x:el.x, y:el.y};})
			this.cp.removeEdge(edge);
			return nodes;
		},this);

	this.cp.clean();

	// draw detail linework
	// squashedLines.map(function(el){ return this.cp.crease(el[0], el[1]); },this)
	// 	.filter(function(el){return el!=undefined},this)
	// 	.forEach(function(el){el.mark();},this);
	// kawasakis.forEach(function(el){ this.cp.crease(el); },this);

	this.draw();
}
twistTriAnim.reset();

twistTriAnim.onFrame = function(event){ }
twistTriAnim.onResize = function(event){ }
twistTriAnim.onMouseDown = function(event){ twistTriAnim.reset(); }
twistTriAnim.onMouseUp = function(event){ }
twistTriAnim.onMouseMove = function(event){ }
