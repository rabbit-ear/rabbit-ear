// OrigamiPaper
// render and style a crease pattern into an HTML canvas using PaperJS

try { var cp = new CreasePattern(); }
catch(err) { throw "cp.paper.js requires the crease pattern js library github.com/robbykraft/Origami, and to be included before this file\n'var cp = new CreasePattern()' resulted in: " + err.message; }

var OrigamiPaper = (function(){
	function OrigamiPaper(canvas, creasePattern) {
		if(canvas === undefined){throw "OrigamiPaper() requires an HTML canvas in the constructor";}
		if(typeof canvas === "string"){ 
			this.canvas = document.getElementById(canvas);
			// if canvas string isn't found, try the generic case id="canvas"
			if(this.canvas === null){ this.canvas = document.getElementById("canvas"); }
		}
		else{ this.canvas = canvas; }

		// CREASE PATTERN
		this.cp = creasePattern;
		if(this.cp === undefined){ this.cp = new CreasePattern(); }

		// PAPER JS
		this.scope = new paper.PaperScope();
		this.scope.setup(this.canvas);
		this.loader = new PaperJSLoader();

		this.padding = 0.0075; // padding inside the canvas
		this.bounds = undefined;  // undefined defaults to size of CP itself
		this.style = this.defaultStyleTemplate();
		this.backgroundLayer = new this.scope.Layer();
		this.faceLayer = new this.scope.Layer();
		this.junctionLayer = new this.scope.Layer();
		this.sectorLayer = new this.scope.Layer();
		this.edgeLayer = new this.scope.Layer();
		this.boundaryLayer = new this.scope.Layer();
		this.nodeLayer = new this.scope.Layer();
		// user interaction
		this.mouse = {
			position: {'x':0,'y':0},
			pressed: {'x':0,'y':0},
			isPressed: false,
			isDragging: false
		};
		this.show = {
			boundary:true,
			nodes:false,
			edges:true,
			faces:false,
			junctions:false,
			sectors:false,
		}
		// user select and move
		this.touchPoints = [];
		this.selectRadius = 0.03;
		this.selectedTouchPoint = undefined;

		this.buildViewMatrix();
		this.draw();

		var that = this;
		this.scope.view.onFrame = function(event){
			paper = that.scope;
			that.onFrame(event);
		}
		this.scope.view.onMouseDown = function(event){
			paper = that.scope;
			that.mouse.isPressed = true;
			that.mouse.isDragging = false;
			that.mouse.pressed.x = event.point.x;
			that.mouse.pressed.y = event.point.y;
			that.attemptSelection();
			that.onMouseDown(event);
		}
		this.scope.view.onMouseUp = function(event){
			paper = that.scope;
			that.mouse.isPressed = false;
			that.selectedTouchPoint = undefined;
			that.onMouseUp(event);
		}
		this.scope.view.onMouseMove = function(event){
			paper = that.scope;
			that.mouse.position.x = event.point.x;
			that.mouse.position.y = event.point.y;
			if(that.mouse.isPressed){ 
				if(that.mouse.isDragging === false){
					that.mouse.isDragging = true;
					that.onMouseDidBeginDrag(event);
				}
			}
			that.updateSelected();
			that.onMouseMove(event);
		}
		this.scope.view.onResize = function(event){
			paper = that.scope; 
			that.buildViewMatrix(); 
			that.onResize(event); 
		}
	}

	OrigamiPaper.prototype.setBounds = function(x,y,width,height){
		this.bounds = { 'origin': {'x':x,'y':y},
		                  'size': {'width':width, 'height':height} };
		this.setLineWeights( (width+height)*0.5 );
		this.buildViewMatrix();
		return this;
	}
	OrigamiPaper.prototype.setPadding = function(padding){
		if(padding != undefined){
			this.padding = padding;
			this.buildViewMatrix();
		}
		return this;
	}

	OrigamiPaper.prototype.attemptSelection = function(){
		function pointsSimilar(a, b, epsilon){
			function epsilonEqual(a, b, epsilon){return ( Math.abs(a-b) < epsilon );}
			return epsilonEqual(a.x,b.x,epsilon) && epsilonEqual(a.y,b.y,epsilon);
		}
		for(var i = 0; i < this.touchPoints.length; i++){
			if( (this.touchPoints[i].position !== undefined) &&
			    (pointsSimilar(this.mouse.position, this.touchPoints[i].position, this.selectRadius)) ){
				this.selectedTouchPoint = this.touchPoints[i];
			}
		}
	}
	OrigamiPaper.prototype.makeTouchPoint = function(location, style){
		paper = this.scope;
		var x,y;
		if(location.x != undefined){ x = location.x; y = location.y; }
		else if(Array.isArray(location) && location.length > 1){ x = location[0]; y = location[1]; }
		if(this.touchPointsLayer === undefined){this.touchPointsLayer = new this.scope.Layer();}
		this.touchPointsLayer.activate();
		var circleStyle = {position:{x:x, y:y}, radius:0.015, strokeWidth:0.01, strokeColor:{gray:0.0}, fillColor:{gray:1.0}}
		if(style != undefined){ Object.assign(circleStyle, style); }
		
		var touchPoint = new this.scope.Shape.Circle(circleStyle);
		this.touchPoints.push(touchPoint);
		return touchPoint;
	}
	OrigamiPaper.prototype.get = function(component){
		if(component instanceof GraphNode){ return this.nodes[ component.index ]; }
		if(component instanceof GraphEdge){ return this.edges[ component.index ]; }
		if(component instanceof PlanarFace){ return this.faces[ component.index ]; }
		if(component instanceof PlanarSector){ return this.sectors[ component.index ]; }
		if(component instanceof PlanarJunction){ return this.junctions[ component.index ]; }
		return {};
	}

	OrigamiPaper.prototype.draw = function(){
		paper = this.scope;
		if(this.cp === undefined){ return; }

		// on-screen drawn elements
		this.nodes = [];
		this.edges = [];
		this.faces = [];
		this.sectors = [];

		[this.backgroundLayer, this.boundaryLayer, this.nodeLayer, this.edgeLayer, this.faceLayer, this.sectorLayer].forEach(function(el){el.removeChildren();},this);

		// draw paper
		if(this.show.boundary && this.cp.boundary !== undefined){
			var boundarySegments = this.cp.boundary.edges.map(function(edge){
				return edge.nodes.map(function(node){ return [node.x, node.y]; },this)
			},this).reduce((x,y) => x.concat(y), []);
			// paper color
			this.backgroundLayer.activate();
			var paperBackground = new this.scope.Path({segments: boundarySegments, closed: true });
			paperBackground.fillColor = this.style.backgroundColor;
			paperBackground.strokeWidth = 0;
			// boundary color
			this.boundaryLayer.activate();
			var boundaryPath = new this.scope.Path({segments: boundarySegments, closed: true });
			Object.assign(boundaryPath, this.style.boundary);
			// Object.assign(boundaryPath, this.styleForCrease(CreaseDirection.border));
		}
		if(this.show.nodes){
			this.nodeLayer.activate();
			for(var i = 0; i < this.cp.nodes.length; i++){
				var circle = new this.scope.Shape.Circle({ center: [this.cp.nodes[i].x, this.cp.nodes[i].y] });
				Object.assign(circle, this.style.node);
				this.nodes.push( circle );
			}
		}
		if(this.show.edges){
			this.edgeLayer.activate();
			for(var i = 0; i < this.cp.edges.length; i++){
				var nodes = this.cp.edges[i].nodes.map(function(el){ return [el.x, el.y]; })
				var path = new this.scope.Path({segments: nodes, closed: false });
				Object.assign(path, this.styleForCrease(this.cp.edges[i].orientation));
				this.edges.push( path );
			}
		}
		if(this.show.faces){
			this.faceLayer.activate();
			for(var i = 0; i < this.cp.faces.length; i++){
				var nodes = this.cp.faces[i].nodes.map(function(el){ return [el.x, el.y]; });
				var face = new this.scope.Path({segments:nodes, closed:true});
				face.scale(this.style.face.scale, this.cp.faces[i].centroid());
				Object.assign(face, this.style.face);
				this.faces.push( face );
			}
		}
		// if(this.show.junctions){
		// 	this.junctionLayer.activate();
		// 	for(var i = 0; i < this.cp.junctions.length; i++){
		// 		var nodes = this.cp.faces[i].nodes.map(function(el){ return [el.x, el.y]; });
		// 		var face = new this.scope.Path({segments:nodes, closed:true});
		// 		face.scale(this.style.face.scale, this.cp.faces[i].centroid());
		// 		Object.assign(face, this.style.face);
		// 		this.faces.push( face );
		// 	}
		// }
		if(this.show.sectors){
			this.sectorLayer.activate();
			for(var j = 0; j < this.cp.junctions.length; j++){
				var junction = this.cp.junctions[j];
				var shortest = this.style.sector.scale * junction.sectors
					.map(function(el){ return el.edges[0].length(); },this)
					.sort(function(a,b){return a-b;})
					.shift();
				for(var s = 0; s < junction.sectors.length; s++){
					var origin = junction.sectors[s].origin;
					var a = junction.sectors[s].endPoints[0].copy().subtract(origin).normalize().scale(shortest).add(origin);
					var c = junction.sectors[s].endPoints[1].copy().subtract(origin).normalize().scale(shortest).add(origin);
					var b = junction.sectors[s].bisect().direction.scale(shortest).add(origin);
					// paper js has trouble creating arcs from 3 points similar until about the 5th decimal place
					// make sure points aren't degenerate according to paper js
					var degenerate = (Math.abs(a.x-b.x) < 0.001 && Math.abs(a.y-b.y) < 0.001) ? true : false;
					var sector = degenerate ? new this.scope.Path.Arc() : new this.scope.Path.Arc(a, b, c)
					sector.add(origin);
					sector.closed = true;
					Object.assign(sector, this.style.sector);
					sector.fillColor = this.style.sector.fillColors[s%2];
					// this.sectors.push( sector );
					this.sectors[junction.sectors[s].index] = sector;
				}
			}
		}
		this.buildViewMatrix();
	}
	OrigamiPaper.prototype.update = function () {
		this.updatePositions();
		this.updateStyles();
	};
	OrigamiPaper.prototype.updateSelected = function(){
		if(this.mouse.isDragging && this.selectedTouchPoint !== undefined){
			this.selectedTouchPoint.position.x = this.mouse.position.x;
			this.selectedTouchPoint.position.y = this.mouse.position.y;
		}
	}
	OrigamiPaper.prototype.updatePositions = function () {
		paper = this.scope;
		if(this.show.nodes){ for(var i=0;i<this.nodes.length;i++){
			this.nodes[i].position=[this.cp.nodes[i].x, this.cp.nodes[i].y];} }
		if(this.show.edges){ for(var i=0;i<this.cp.edges.length;i++){
			this.edges[i].segments=this.cp.edges[i].nodes.map(function(el){ return [el.x, el.y];});} }
		if(this.show.faces){ for(var i=0;i<this.cp.faces.length;i++){
			this.faces[i].segments=this.cp.faces[i].nodes.map(function(el){ return [el.x, el.y];});} }
	};
	OrigamiPaper.prototype.updateStyles = function () {
		paper = this.scope;
		if(this.show.nodes){for(var i=0;i<this.nodes.length;i++){Object.assign(this.nodes[i], this.style.node); } }
		if(this.show.edges){for(var i=0;i<this.cp.edges.length;i++){ 
			Object.assign(this.edges[i], this.styleForCrease(this.cp.edges[i].orientation));} }
		if(this.show.faces){for(var i=0;i<this.faces.length;i++){Object.assign(this.faces[i],this.style.face);} }
		if(this.show.sectors){
			for(var j = 0; j < this.cp.junctions.length; j++){
				for(var s = 0; s < this.cp.junctions[j].sectors.length; s++){
					var sector = this.sectors[ this.cp.junctions[j].sectors[s].index ];
					Object.assign(sector, this.style.sector);
					sector.fillColor = this.style.sector.fillColors[s%2];
				}
			}
		}
		if(this.show.boundary){for(var i=0;i<this.boundaryLayer.children.length;i++){
			Object.assign(this.boundaryLayer.children[i], this.style.boundary);
			// Object.assign(this.boundaryLayer.children[i], this.styleForCrease(CreaseDirection.border));
		} }
	};
	OrigamiPaper.prototype.buildViewMatrix = function(){
		paper = this.scope;
		var pixelScale = this.loader.isRetina ? 0.5 : 1.0;
		var cpBounds = this.bounds || this.cp.bounds();
		if(cpBounds === undefined){ cpBounds = {'origin':{'x':0,'y':0},'size':{'width':this.canvas.width/this.canvas.height, 'height':1.0}} };
		// Aspect fit crease pattern in canvas
		var cpCanvasRatio = this.canvas.height / cpBounds.size.height;
		var cpAspect = cpBounds.size.width / cpBounds.size.height;
		var canvasAspect = this.canvas.width / this.canvas.height;
		if(cpAspect > canvasAspect ) { 
			cpCanvasRatio = this.canvas.width / cpBounds.size.width;
		}
		// matrix
		var paperWindowScale = 1.0 - this.padding*2;
		var mat = new this.scope.Matrix(1, 0, 0, 1, 0, 0);
		mat.translate(this.canvas.width * 0.5 * pixelScale, this.canvas.height * 0.5 * pixelScale); 
		mat.scale(cpCanvasRatio*paperWindowScale*pixelScale, 
				  cpCanvasRatio*paperWindowScale*pixelScale);
		mat.translate(-cpBounds.size.width*0.5 - cpBounds.origin.x,
		              -cpBounds.size.height*0.5 - cpBounds.origin.y);
		this.scope.view.matrix = mat;
		return mat;
	};
	///////////////////////////////////////////////////
	// FILE IN OUT
	///////////////////////////////////////////////////
	OrigamiPaper.prototype.load = function(svg, callback, epsilon){
		var that = this;
		this.scope.project.importSVG(svg, function(e){
			var cp = that.loader.paperPathToCP(e);
			if(epsilon === undefined){ epsilon = 0.0001; }
			console.log("loading svg with epsilon " + epsilon);
			cp.clean(epsilon);
			// rebuild boundary
			// TODO: this code only works for convex hull boundaries
			cp.edges.forEach(function(edge){
				if( cp.boundary.edges.filter(function(b){ return b.parallel(edge); },this)
					.filter(function(b){ return b.collinear(edge.nodes[0]); },this)
					.length > 0){
					edge.border();
				}
			},this);
			// end boundary
			that.cp = cp;
			that.draw();
			if(callback != undefined){
				callback(that.cp);
			}
		});
		return this;
	}
	OrigamiPaper.prototype.loadRaw = function(svg, callback){
		var that = this;
		this.scope.project.importSVG(svg, function(e){
			that.cp = that.loader.paperPathToCP(e);
			that.draw();
			if(callback != undefined){
				callback(that.cp);
			}
		});
		return this;
	}
	///////////////////////////////////////////////////
	// STYLE
	///////////////////////////////////////////////////
	OrigamiPaper.prototype.thickLines = function(){ return this.setLineWeights(1.0); }
	OrigamiPaper.prototype.mediumLines = function(){ return this.setLineWeights(0.5); }
	OrigamiPaper.prototype.thinLines = function(){ return this.setLineWeights(0.2); }
	OrigamiPaper.prototype.setLineWeights = function(scale){
		if(scale === undefined){ scale = 1.0; }
		var weight = scale * 0.01;
		this.style.node.radius = weight*1.5;
		[this.style.valley, this.style.mountain, this.style.border, this.style.mark].forEach(function(el){
			el.strokeWidth = weight;
			if(el.dashArray != undefined){ el.dashArray = [weight*1.5, weight*2]; }
		},this);
		this.style.mark.strokeWidth = weight*0.6666666;
		this.updateStyles();
		return this;
	};
	OrigamiPaper.prototype.blackAndWhite = function(){
		[this.style.valley, this.style.mountain, this.style.border, this.style.mark].forEach(function(el){ el.strokeColor = { gray:0.0 }; },this);
		this.style.backgroundColor = { gray:1.0 };
		this.style.face.fillColor = { gray:0.0, alpha:1.0 };
		return this;
	};
	OrigamiPaper.prototype.styles = {
		'byrne':{
			'black':{hue:0, saturation:0, brightness:0 },
			'red':{hue:14.4, saturation:0.87, brightness:0.90 },
			'yellow':{hue:43.2, saturation:0.88, brightness:0.93 },
			'darkBlue':{hue:190.8, saturation:0.82, brightness:0.28 },
			'blue':{hue:205.2, saturation:0.74, brightness:0.61}
		},
		'lang':{
			'red':{hue:4, saturation:.76, brightness:.94},
			'brown':{hue:25, saturation:.36, brightness:.74},
			'green':{hue:120, saturation:.53, brightness:.72},
			'blue':{hue:230, saturation:.43, brightness:.72},
			'gray':{gray:.83},
			'darkBlue':{hue:234, saturation:.5, brightness:.38},
			'pink':{hue:341, saturation:.66, brightness:.93},
		}
	};
	OrigamiPaper.prototype.defaultStyleTemplate = function(scale){
		if(scale === undefined){ scale = 1.0 }
		// "scale" should roughly relate to the width of the crease pattern
		return {
			backgroundColor: { gray:1.0, alpha:1.0 },
			boundary: {
				fillColor: null,
				strokeWidth: scale*0.01,
				strokeColor: {gray:0.0}
			},
			mountain: {
				strokeColor: this.styles.byrne.red,
				dashArray: undefined,
				strokeWidth: scale*0.01,
				strokeCap : 'round'
			},
			valley: {
				strokeColor: { hue:220, saturation:0.6, brightness:0.666 },
				dashArray: [scale*0.015, scale*0.02],
				strokeWidth: scale*0.01,
				strokeCap : 'round'
			},
			border: {
				strokeColor: { gray:0.0, alpha:1.0 },
				dashArray: undefined,
				strokeWidth: scale*0.01
			},
			mark: {
				strokeColor: { gray:0.666, alpha:1.0 },
				dashArray: undefined,
				strokeWidth: scale * 0.00333333333,
				strokeCap : 'round'
			},
			face: {
				'scale': 0.666,
				fillColor: { gray:0.0, alpha:1.0 },
				strokeWidth: null
			},
			node: {
				radius: scale*0.01,
				fillColor: { gray:0.0 }
			},
			sector: {
				'scale': 0.5,
				fillColors: [this.styles.byrne.red,this.styles.byrne.darkBlue],
			},
			selected: {
				node: {
					radius: scale*0.02,
					fillColor: { hue:0, saturation:0.8, brightness:1 },
				},
				edge: {strokeColor: { hue:0, saturation:0.8, brightness:1 } },
				face: { fillColor: { hue:0, saturation:0.8, brightness:1 } }
			}
		}
	};
	OrigamiPaper.prototype.styleForCrease = function(orientation){
		if   (orientation === CreaseDirection.mountain){ return this.style.mountain; }
		else if(orientation === CreaseDirection.valley){ return this.style.valley; }
		else if(orientation === CreaseDirection.border){ return this.style.border; }
		return this.style.mark;
	};

	// OrigamiPaper.prototype.setup = function(event){ }
	// OrigamiPaper.prototype.update = function(event){ }
	// OrigamiPaper.prototype.draw = function(event){ }
	OrigamiPaper.prototype.onResize = function(event){ }
	OrigamiPaper.prototype.onFrame = function(event){ }
	OrigamiPaper.prototype.onMouseDown = function(event){ }
	OrigamiPaper.prototype.onMouseUp = function(event){ }
	OrigamiPaper.prototype.onMouseMove = function(event){ }
	OrigamiPaper.prototype.onMouseDidBeginDrag = function(event){ }

	return OrigamiPaper;
}());

///////////////////////////////////////////////
//  RENDER SIMULATED FLAT-FOLDING OF ORIGAMI 
///////////////////////////////////////////////

var OrigamiFold = (function(){

	OrigamiFold.prototype.onResize = function(event){ }
	OrigamiFold.prototype.onFrame = function(event){ }
	OrigamiFold.prototype.onMouseDown = function(event){ }
	OrigamiFold.prototype.onMouseUp = function(event){ }
	OrigamiFold.prototype.onMouseMove = function(event){ }
	OrigamiFold.prototype.onMouseDidBeginDrag = function(event){ }

	function OrigamiFold(canvas, creasePattern) {
		if(canvas === undefined) { throw "OrigamiFold() requires an HTML canvas, please specify one in the constructor"; }
		if(typeof canvas === "string"){ 
			this.canvas = document.getElementById(canvas);
			// if canvas string isn't found, try the generic case id="canvas"
			if(this.canvas === null){ this.canvas = document.getElementById("canvas"); }
		}
		else{ this.canvas = canvas; }

		// CREASE PATTERN
		this.cp = creasePattern;
		if(this.cp === undefined){ this.cp = new CreasePattern(); }
		// this.foldedCP = cp.fold();
		
		// PAPER JS
		this.scope = new paper.PaperScope();
		this.scope.setup(this.canvas);
		this.loader = new PaperJSLoader();
		this.foldedLayer = new this.scope.Layer();
		this.mouseZoom = true;
		this.zoom = 1.0;
		this.padding = 0.0;
		this.rotation = 0;
		this.bounds = {'origin':{'x':0,'y':0},'size':{'width':1.0, 'height':1.0}};
		this.mouse = {
			position: {'x':0,'y':0},
			pressed: {'x':0,'y':0},
			isPressed: false,
			isDragging: false
		};
		this.style = { face:{ fillColor:{ gray:0.0, alpha:0.1 } } };

		this.draw();

		var that = this;
		this.scope.view.onFrame = function(event){
			paper = that.scope;
			that.onFrame(event);
		}
		this.scope.view.onMouseDown = function(event){
			paper = that.scope;
			that.mouse.isPressed = true;
			that.mouse.isDragging = false;
			that.mouse.pressed.x = that.mouse.position.x
			that.mouse.pressed.y = that.mouse.position.y
			that.zoomOnMousePress = that.zoom;
			that.rotationOnMousePress = that.rotation;
			that.onMouseDown(event);
		}
		this.scope.view.onMouseUp = function(event){
			paper = that.scope;
			that.mouse.isPressed = false;
			that.onMouseUp(event);
		}
		this.scope.view.onMouseMove = function(event){
			paper = that.scope;
			var mouseScaled = that.scope.view.matrix.transform(event.point);
			that.mouse.position.x = mouseScaled.x;
			that.mouse.position.y = mouseScaled.y;
			if(that.mouse.isPressed){ 
				if(that.mouse.isDragging === false){
					that.mouse.isDragging = true;
					that.onMouseDidBeginDrag(event);
				}
				if(that.mouseZoom){
					that.zoom = that.zoomOnMousePress + 0.01 * (that.mouse.pressed.y - that.mouse.position.y);
					that.rotation = that.rotationOnMousePress + (that.mouse.pressed.x - that.mouse.position.x);
					if(that.zoom < 0.02){ that.zoom = 0.02; }
					if(that.zoom > 100){ that.zoom = 100; }
					that.buildViewMatrix();
				}
			}
			that.onMouseMove(event);
		}
		this.scope.view.onResize = function(event){
			paper = that.scope;
			that.buildViewMatrix();
			that.onResize(event);
		}
	}
	OrigamiFold.prototype.reset = function(){
		this.zoom = 1.0;
		this.rotation = 0;
		this.buildViewMatrix();
	}
	OrigamiFold.prototype.getBounds = function(){
		if(this.foldedCP === undefined){ 
			this.bounds = {'origin':{'x':0,'y':0},'size':{'width':1.0, 'height':1.0}};
			return;
		}
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;
		this.foldedCP.vertices_coords.forEach(function(point){
			if(point[0] > maxX){ maxX = point[0]; }
			if(point[0] < minX){ minX = point[0]; }
			if(point[1] > maxY){ maxY = point[1]; }
			if(point[1] < minY){ minY = point[1]; }
		},this);
		this.bounds = {'origin':{'x':minX,'y':minY},'size':{'width':maxX-minX, 'height':maxY-minY}};
	}
	// OrigamiFold.prototype.draw = function(groundFace){
	// 	paper = this.scope;
	// 	this.foldedCP = this.cp.fold(groundFace);
	// 	this.getBounds();
	// 	this.faces = [];
	// 	this.foldedLayer.removeChildren();
	// 	this.foldedLayer.activate();
	// 	if(this.foldedCP != undefined){
	// 		this.foldedCP.forEach(function(nodes){
	// 			var faceShape = new this.scope.Path({segments:nodes,closed:true});
	// 			faceShape.fillColor = this.style.face.fillColor;
	// 			this.faces.push( faceShape );
	// 		},this);
	// 	}
	// 	this.buildViewMatrix();
	// }
	OrigamiFold.prototype.draw = function(groundFace){
		paper = this.scope;
		this.foldedCP = this.cp.fold(groundFace);
		this.getBounds();
		this.faces = [];
		this.foldedLayer.removeChildren();
		this.foldedLayer.activate();
		if(this.foldedCP != undefined){
			this.foldedCP.faces_vertices
				.map(function(face){
					return face.map(function(nodeIndex){
						return this.foldedCP.vertices_coords[nodeIndex];
					},this);
				},this)
				.forEach(function(faceNodes){
					var faceShape = new this.scope.Path({segments:faceNodes,closed:true});
					faceShape.fillColor = this.style.face.fillColor;
					this.faces.push( faceShape );
				},this);
		}
		this.buildViewMatrix();
	}
	OrigamiFold.prototype.update = function () {
		paper = this.scope;
		if(this.faces === undefined){ return; }
		for(var i = 0; i < this.faces.length; i++){
			this.faces[i].fillColor = this.style.face.fillColor;
		}
	};
	OrigamiFold.prototype.load = function(svg, callback, epsilon){
		if(epsilon === undefined){ epsilon = 0.0001; }
		var that = this;
		this.scope.project.importSVG(svg, function(e){
			var cp = that.loader.paperPathToCP(e);

			cp.clean(epsilon);
			cp.edges.forEach(function(edge){
				if( cp.boundary.edges
					.filter(function(b){ return b.parallel(edge); },this)
					.filter(function(b){ return b.collinear(edge.nodes[0]); },this)
					.length > 0){
						edge.border();
					}
			},this);

			that.cp = cp;
			that.foldedCP = cp.fold();
			// that.cp.clean();
			that.draw();
			if(callback != undefined){
				callback(that.cp);
			}
		});
		return this;
	}
	OrigamiFold.prototype.setPadding = function(padding){
		if(padding != undefined){
			this.padding = padding;
			this.buildViewMatrix();
		}
		return this;
	}
	OrigamiFold.prototype.buildViewMatrix = function(){
		paper = this.scope;
		var pixelScale = this.loader.isRetina ? 0.5 : 1.0;
		// Aspect fit crease pattern in canvas
		var cpCanvasRatio = this.canvas.height / this.bounds.size.height;
		var cpAspect = this.bounds.size.width / this.bounds.size.height;
		var canvasAspect = this.canvas.width / this.canvas.height;
		if(cpAspect > canvasAspect ) { 
			cpCanvasRatio = this.canvas.width / this.bounds.size.width;
		}
		// matrix
		var paperWindowScale = 1.0 - this.padding*2;
		var mat = new this.scope.Matrix(1, 0, 0, 1, 0, 0);
		mat.translate(this.canvas.width * 0.5 * pixelScale, this.canvas.height * 0.5 * pixelScale);
		mat.scale(this.zoom, this.zoom);
		mat.scale(cpCanvasRatio*paperWindowScale*pixelScale, 
				  cpCanvasRatio*paperWindowScale*pixelScale);
		mat.rotate(this.rotation);
		mat.translate(-this.bounds.size.width*0.5 - this.bounds.origin.x,
		              -this.bounds.size.height*0.5 - this.bounds.origin.y);
		this.scope.view.matrix = mat;
		return mat;
	};

	return OrigamiFold;
}());


var PaperJSLoader = (function(){
	function PaperJSLoader(){}

	PaperJSLoader.prototype.isRetina = function(){
		var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
				(min--moz-device-pixel-ratio: 1.5),\
				(-o-min-device-pixel-ratio: 3/2),\
				(min-resolution: 1.5dppx)";
		if (window.devicePixelRatio > 1){ return true; }
		if (window.matchMedia && window.matchMedia(mediaQuery).matches){ return true; }
		return false;
	}();

	PaperJSLoader.prototype.paperPathToCP = function(paperPath){
		var svgLayer = paperPath;
		var w = svgLayer.bounds.size.width;
		var h = svgLayer.bounds.size.height;
		// re-sizing down to 1 x aspect size
		var min = h; if(w < h){ min = w; }
		var mat = new paper.Matrix(1/min, 0, 0, 1/min, 0, 0);
		// var mat = new paper.Matrix(1,0,0,1,0,0);
		svgLayer.matrix = mat;
		var cp = new CreasePattern();//.rectangle(w,h);
		// erase boundary, to be set later by convex hull
		cp.nodes = [];
		cp.edges = [];
		// cp.boundary = new PlanarGraph();
		function recurseAndAdd(childrenArray){
			for(var i = 0; i < childrenArray.length; i++){
				if(childrenArray[i].shape == "rectangle" && childrenArray[i].strokeColor != null){ // found a rectangle
					var left = childrenArray[i].strokeBounds.left;
					var top = childrenArray[i].strokeBounds.top;
					var width = childrenArray[i].strokeBounds.width;
					var height = childrenArray[i].strokeBounds.height;
					var rectArray = [ [left, top], [left+width, top], [left+width, top+height], [left, top+height] ];
					rectArray.forEach(function(el,i){
						var nextEl = rectArray[ (i+1)%rectArray.length ];
						cp.newCrease(el[0], el[1], nextEl[0], nextEl[1]);
					},this);
				}
				if(childrenArray[i].segments !== undefined){ // found a line
					var numSegments = childrenArray[i].segments.length-1;
					if(childrenArray[i].closed === true){
						numSegments = childrenArray[i].segments.length;
					}
					for(var j = 0; j < numSegments; j++){
						var next = (j+1)%childrenArray[i].segments.length;
						var crease = cp.newCrease(childrenArray[i].segments[j].point.x,
									 childrenArray[i].segments[j].point.y, 
									 childrenArray[i].segments[next].point.x,
									 childrenArray[i].segments[next].point.y);
						var color = childrenArray[i].strokeColor;
						if(color !== undefined && crease !== undefined){
							if(color.red > color.blue){crease.mountain();}
							if(color.red < color.blue){crease.valley();}
						}
					}
				} else if (childrenArray[i].children !== undefined){
					recurseAndAdd(childrenArray[i].children);
				}
			}
		}
		recurseAndAdd(svgLayer.children);
		// console.log(svgLayer.children);
		// cp is populated
		// find the convex hull of the CP, set it to the boundary
		// cp.setBoundary(cp.nodes);
		// bypassing calling cp.setBoundary() directly to avoid flattening
		var points = cp.nodes.map(function(p){ return gimme1XY(p); },this);
		cp.boundary.convexHull(points);
		// cp.boundary.edges.forEach(function(el){
		// 	cp.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y).border();
		// },this);
		cp.cleanDuplicateNodes();
		// cleanup
		svgLayer.removeChildren();
		svgLayer.remove();
		return cp;
	};
	return PaperJSLoader;
}());
