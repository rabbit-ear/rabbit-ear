// this generates an SVG rendering of a CreasePattern object

var svgNS = "http://www.w3.org/2000/svg";

var CreaseTypeString = {
	// CreaseDirection.mark : "mark"
	// CreaseDirection.border : "border",
	// CreaseDirection.mountain : "mountain",
	// CreaseDirection.valley : "valley",
	0 : "mark",
	1 : "boundary",
	2 : "mountain",
	3 : "valley",
}

var OrigamiPaper = (function(){

	// function OrigamiPaper(svg, creasePattern) {
	function OrigamiPaper(creasePattern) {
		this.cp = creasePattern;
		if(this.cp == undefined){ this.cp = new CreasePattern(); }

		this.svg = this.createNewSVG();
		document.body.appendChild(this.svg);

		this.padding = 0.01;  // padding inside the canvas

		this.facesLayer;
		this.junctionsLayer;
		this.sectorsLayer;
		this.edgesLayer;
		this.boundaryLayer;
		this.nodesLayer;
	
		this.mouse = {
			position: {'x':0,'y':0},  // the current position of the mouse
			pressed: {'x':0,'y':0},   // the last location the mouse was pressed
			isPressed: false,         // is the mouse button pressed (y/n)
			isDragging: false         // is the mouse moving while pressed (y/n)
		};

		this.style = {
			node:{ radius: 0.01 },
			sector:{ scale: 0.5 },
			selected:{
				node:{ radius: 0.02 },
				edge:{ strokeColor:{ hue:0, saturation:0.8, brightness:1 } },
				face:{ fillColor:{ hue:0, saturation:0.8, brightness:1 } }
			}
		}

		this.draw();

		var that = this;
		this.svg.onmousedown = function(event){
			that.mouse.isPressed = true;
			that.mouse.isDragging = false;
			that.mouse.pressed = that.convertDOMtoSVG(event);
			// that.attemptSelection();
			that.onMouseDown( Object.assign({}, that.mouse.pressed) );
		}
		this.svg.onmouseup = function(event){
			that.mouse.isPressed = false;
			that.mouse.isDragging = false;
			that.selectedTouchPoint = undefined;
			that.onMouseUp( that.convertDOMtoSVG(event) );
		}
		this.svg.onmousemove = function(event){
			that.mouse.position = that.convertDOMtoSVG(event);
			if(that.mouse.isPressed){ 
				if(that.mouse.isDragging === false){
					that.mouse.isDragging = true;
					that.onMouseDidBeginDrag( Object.assign({}, that.mouse.position) );
				}
			}
			// that.updateSelected();
			that.onMouseMove( Object.assign({}, that.mouse.position) );
		}
		this.svg.onResize = function(event){
			that.onResize(event);
		}
		// javascript get Date()
		var frameNum = 0
		// this.onFrameTimer = setInterval(function(){
		// 	that.onFrame({frame:frameNum});
		// 	frameNum += 1;
		// }, 1000/60);
	}
	OrigamiPaper.prototype.convertDOMtoSVG = function(event){
		var pt = this.svg.createSVGPoint();
		pt.x = event.clientX;
		pt.y = event.clientY;
		var svgPoint = pt.matrixTransform(this.svg.getScreenCTM().inverse());
		return { x: svgPoint.x, y: svgPoint.y };
	}
	OrigamiPaper.prototype.createNewSVG = function(){
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute("viewBox", "0 0 1 1");
		// svg.setAttribute("width", "100vmin");
		// svg.setAttribute("height", "100vmin");

		this.facesLayer = document.createElementNS(svgNS, 'g');
		this.junctionsLayer = document.createElementNS(svgNS, 'g');
		this.sectorsLayer = document.createElementNS(svgNS, 'g');
		this.edgesLayer = document.createElementNS(svgNS, 'g');
		this.boundaryLayer = document.createElementNS(svgNS, 'g');
		this.nodesLayer = document.createElementNS(svgNS, 'g');

		this.facesLayer.setAttributeNS(null, 'id', 'faces');
		this.junctionsLayer.setAttributeNS(null, 'id', 'junctions');
		this.sectorsLayer.setAttributeNS(null, 'id', 'sectors');
		this.edgesLayer.setAttributeNS(null, 'id', 'creases');
		this.boundaryLayer.setAttributeNS(null, 'id', 'boundary');
		this.nodesLayer.setAttributeNS(null, 'id', 'nodes');

		svg.appendChild(this.boundaryLayer);
		svg.appendChild(this.facesLayer);
		svg.appendChild(this.junctionsLayer);
		svg.appendChild(this.sectorsLayer);
		svg.appendChild(this.edgesLayer);
		svg.appendChild(this.nodesLayer);

		return svg;
	}
	OrigamiPaper.prototype.setPadding = function(padding){
		if(padding != undefined){
			this.padding = padding;
			this.setViewBox();
		}
		return this;
	}
	OrigamiPaper.prototype.setViewBox = function(){
		// todo: need protections if cp is returning no bounds
		var bounds = this.cp.bounds();
		this.svg.setAttribute("viewBox", (-this.padding+bounds.origin.x) + " " + (-this.padding+bounds.origin.y) + " " + (bounds.size.width+this.padding*2) + " " + (bounds.size.height+this.padding*2));
	}
	OrigamiPaper.prototype.get = function(component){
		// this way also works
		// var svgEdge = document.getElementById("edge-" + nearest.edge.index);
		if(component instanceof GraphNode){ return this.nodesLayer.childNodes[ component.index ]; }
		if(component instanceof GraphEdge){ return this.edgesLayer.childNodes[ component.index ]; }
		if(component instanceof PlanarFace){ return this.facesLayer.childNodes[ component.index ]; }
		if(component instanceof PlanarSector){ return this.sectorsLayer.childNodes[ component.index ]; }
		// if(component instanceof PlanarJunction){ return this.junctionsLayer.childNodes[ component.index ]; }
		// allow chaining without errors
		// return {'setAttribute':function(){}};
		return document.createElement('void');
	}

	OrigamiPaper.prototype.showNodes = function(){ origami.nodesLayer.setAttribute('display', '');}
	OrigamiPaper.prototype.showEdges = function(){ origami.edgesLayer.setAttribute('display', '');}
	OrigamiPaper.prototype.showFaces = function(){ origami.facesLayer.setAttribute('display', '');}
	OrigamiPaper.prototype.showSectors = function(){ origami.sectorsLayer.setAttribute('display', '');}
	OrigamiPaper.prototype.hideNodes = function(){ origami.nodesLayer.setAttribute('display', 'none');}
	OrigamiPaper.prototype.hideEdges = function(){ origami.nodesLayer.setAttribute('display', 'none');}
	OrigamiPaper.prototype.hideFaces = function(){ origami.nodesLayer.setAttribute('display', 'none');}
	OrigamiPaper.prototype.hideSectors = function(){ origami.nodesLayer.setAttribute('display', 'none');}

	OrigamiPaper.prototype.addClass = function(xmlNode, newClass){
		if(xmlNode == undefined){ return; }
		var currentClass = xmlNode.getAttribute('class');
		if(currentClass == undefined){ currentClass = "" }
		var classes = currentClass.split(' ').filter(function(c){ return c != newClass; },this);
		classes.push(newClass);
		xmlNode.setAttribute('class', classes.join(' '));
	}

	OrigamiPaper.prototype.removeClass = function(xmlNode, newClass){
		if(xmlNode == undefined){ return; }
		var currentClass = xmlNode.getAttribute('class');
		if(currentClass == undefined){ currentClass = "" }
		var classes = currentClass.split(' ').filter(function(c){ return c != newClass; },this);
		xmlNode.setAttribute('class', classes.join(' '));
	}

	OrigamiPaper.prototype.update = function(){
		// better system, put everything inside of <g id="mountain">
		// iterate over all child elements, look them up from their ids
		// for(var i = 0; i < this.cp.edges.length; i++){
		// 	var edge = document.getElementById("edge-" + i);
		// 	if(edge != undefined){
		// 		edge.setAttributeNS(null, 'class', CreaseTypeString[this.cp.edges[i].orientation]);
		// 	}
		// }
		this.edgesLayer.childNodes.forEach(function(edge,i){
			if(this.cp.edges[i] != undefined){
				edge.setAttributeNS(null, 'class', CreaseTypeString[this.cp.edges[i].orientation]);
			}
		},this);
		this.facesLayer.childNodes.forEach(function(face){ face.setAttributeNS(null, 'class', 'face'); },this);
		this.nodesLayer.childNodes.forEach(function(node){ node.setAttributeNS(null, 'class', 'node'); },this);
		this.sectorsLayer.childNodes.forEach(function(sector){ sector.setAttributeNS(null, 'class', 'sector'); },this);
		this.junctionsLayer.childNodes.forEach(function(junction){ junction.setAttributeNS(null, 'class', 'junction'); },this);
	}

	OrigamiPaper.prototype.draw = function(){
		this.setViewBox();

		[this.boundaryLayer, this.facesLayer, this.junctionsLayer, this.sectorsLayer, this.edgesLayer, this.nodesLayer].forEach(function(layer){
			while (layer.lastChild) {
				layer.removeChild(layer.lastChild);
			}
		},this);

		var pointsString = this.cp.boundary.nodes().reduce(function(prev,curr){
			return prev + curr.x + "," + curr.y + " ";
		},"");
		
		var boundaryPolygon = document.createElementNS(svgNS, "polygon");
		boundaryPolygon.setAttributeNS(null, 'class', 'boundary');
		boundaryPolygon.setAttributeNS(null, 'points', pointsString);
		this.boundaryLayer.appendChild(boundaryPolygon);

		this.cp.nodes.forEach(function(node){ this.addNode(node); },this);
		this.cp.edges.forEach(function(edge){ this.addEdge(edge); },this);
		this.cp.faces.forEach(function(face){ this.addFace(face); },this);
		this.cp.junctions.forEach(function(junction){ 
			this.addJunction(junction);
			var radius = this.style.sector.scale * junction.sectors
				.map(function(el){ return el.edges[0].length(); },this)
				.sort(function(a,b){return a-b;})
				.shift();
			junction.sectors.forEach(function(sector){ this.addSector(sector, radius); },this);
		},this);
	}

	OrigamiPaper.prototype.addNode = function(node){
		var dot = document.createElementNS(svgNS,"circle");
		dot.setAttributeNS(null, 'cx', node.x);
		dot.setAttributeNS(null, 'cy', node.y);
		dot.setAttributeNS(null, 'r', this.style.node.radius);
		dot.setAttributeNS(null, 'class', 'node');
		dot.setAttributeNS(null, 'id', 'node-' + node.index);
		this.nodesLayer.appendChild(dot);
	}
	OrigamiPaper.prototype.addEdge = function(edge){
		var line = document.createElementNS(svgNS,"line");
		line.setAttributeNS(null, 'x1', edge.nodes[0].x);
		line.setAttributeNS(null, 'y1', edge.nodes[0].y);
		line.setAttributeNS(null, 'x2', edge.nodes[1].x);
		line.setAttributeNS(null, 'y2', edge.nodes[1].y);
		line.setAttributeNS(null, 'class', CreaseTypeString[edge.orientation]);
		line.setAttributeNS(null, 'id', 'edge-' + edge.index);
		this.edgesLayer.appendChild(line);
	}
	OrigamiPaper.prototype.addFace = function(face){
		var pct = 0.0;
		function lerp(a,b,pct){ var l = b-a; return a+l*pct; }
		var centroid = face.centroid();
		var pointsString = face.nodes
			// .map(function(el){ return [el.x, el.y]; })
			.map(function(el){ return [lerp(el.x, centroid.x, pct), lerp(el.y, centroid.y, pct)]; })
			.reduce(function(prev,curr){ return prev + curr[0] + "," + curr[1] + " "}, "");
		var polygon = document.createElementNS(svgNS,"polygon");
		polygon.setAttributeNS(null, 'points', pointsString);
		polygon.setAttributeNS(null, 'class', 'face');
		polygon.setAttributeNS(null, 'id', 'face-' + face.index);
		this.facesLayer.appendChild(polygon);
	}
	OrigamiPaper.prototype.addSector = function(sector, radius){
		var origin = sector.origin;
		var v = sector.endPoints.map(function(vec){ return vec.subtract(origin).normalize().scale(radius); },this);
		var arcVec = v[1].subtract(v[0]);
		var arc = Math.atan2(v[0].x*v[1].y - v[0].y*v[1].x, v[0].x*v[1].x + v[0].y*v[1].y) > 0 ? 0 : 1;
		var d = 'M ' + origin.x + ',' + origin.y + ' l ' + v[0].x + ',' + v[0].y + ' ';
		d += ['a ', radius, radius, 0, arc, 1,  arcVec.x, arcVec.y].join(' ');
		d += ' Z';
		var path = document.createElementNS(svgNS,"path");
		path.setAttribute('d', d);
		path.setAttributeNS(null, 'class', 'sector');
		path.setAttributeNS(null, 'id', 'sector-' + sector.index);
		this.sectorsLayer.appendChild(path);
	}
	OrigamiPaper.prototype.addJunction = function(junction){ }

	OrigamiPaper.prototype.importSVG = function(xml, cssStyle){
		var properties = ['x', 'y', 'width', 'height'];
		var values = properties.map(function(prop){
				return xml.attributes[prop] == undefined ? "" : xml.attributes[prop].nodeValue;
			},this)
			.map(function(string){ return parseFloat(string); },this);
		var viewBoxString = xml.attributes['viewBox'] == undefined ? "" :  xml.attributes['viewBox'].nodeValue;
		var viewBoxValues = viewBoxString.split(' ').map(function(el){ return parseFloat(el); },this);
		var bounds = {'origin':{'x':values[0], 'y':values[1]}, 'size':{'width':values[2], 'height':values[3]} };
		if(isNaN(bounds.size.width)){ bounds.size.width = viewBoxValues[2]; }
		if(isNaN(bounds.size.height)){ bounds.size.height = viewBoxValues[3]; }
		// todo: if bounds.size.width is still null we have to make assumptions
		// re-sizing down to 1 x aspect size
		var min = (bounds.size.width < bounds.size.height) ? bounds.size.width : bounds.size.height;

		function parseColor(input){
			if (input.substr(0,1)=="#") {
				var collen=(input.length-1)/3;
				var fact=[17,1,0.062272][collen-1];
				return [
					Math.round(parseInt(input.substr(1,collen),16)*fact),
					Math.round(parseInt(input.substr(1+collen,collen),16)*fact),
					Math.round(parseInt(input.substr(1+2*collen,collen),16)*fact)
					];
			}
			else return input.split("(")[1].split(")")[0].split(",").map(Math.round);
		}
		function detectCrease(node){
			var strokeText = undefined;
			if(node.attributes.stroke != undefined){
				strokeText = node.attributes.stroke.nodeValue;
			}
			else if (node.attributes.class != undefined){
				var found = undefined;
				for(var i = 0; i < cssStyle.length; i++){
					if(cssStyle[i].selectorText == '.' + node.attributes.class.nodeValue){ found = cssStyle[i].style; }
				}
				if(found != undefined){ strokeText = found.stroke; }
			}
			// if color is found, detect best match for crease type
			if(strokeText != undefined){
				var colors = parseColor(strokeText);
				if(Math.abs(colors[2]-colors[1]) < 10 && Math.abs(colors[1] - colors[0]) < 10 ){ return 'mark'; }
				else if(colors[0] > colors[2]){ return 'mountain'; }
				else if(colors[2] > colors[0]){ return 'valley'; }
			}
			return 'mark';
		}

		function depthFirstAddElement(children, creases){
			var childrenArray = [];
			for(var i = 0; i < children.length; i++){ childrenArray.push(children[i]); }
			childrenArray.forEach(function(node){
				// console.log(node.nodeName);
				switch(node.nodeName){
					case '#text':
						// can be the <style>, often just a carriage return
						break;
					case 'line':
						var vals = ['x1', 'y1', 'x2', 'y2'].map(function(el){
							return parseFloat(node.attributes[el].nodeValue);
						},this);
						creases[detectCrease(node)].push( [vals[0] / bounds.size.height, vals[1] / bounds.size.height, vals[2] / bounds.size.height, vals[3] / bounds.size.height] );
						break;
					case 'rect':
						var x = parseFloat(node.attributes.x.nodeValue) / bounds.size.height;
						var y = parseFloat(node.attributes.y.nodeValue) / bounds.size.height;
						var width = parseFloat(node.attributes.width.nodeValue) / bounds.size.height;
						var height = parseFloat(node.attributes.height.nodeValue) / bounds.size.height;
						var rectArray = [ [x, y], [x+width, y], [x+width, y+height], [x, y+height] ];
						var creaseType = detectCrease(node);
						rectArray.forEach(function(el,i){
							var nextEl = rectArray[ (i+1)%rectArray.length ];
							creases[creaseType].push( [el[0], el[1], nextEl[0], nextEl[1]] );
						},this);
						break;
					case 'path':
						var P_RESOLUTION = 64;
						var pathLength = node.getTotalLength();
						// if path contains a 'z' the path is closed
						// todo, it's possible for a path to close before it's finished, check for this case
						var closed = node.attributes.d.nodeValue.lastIndexOf('z') != -1 ||
						             node.attributes.d.nodeValue.lastIndexOf('Z') != -1 ?
						             true : false;
						var pathPoints = [];
						for(var i = 0; i < P_RESOLUTION; i++){
							pathPoints.push(node.getPointAtLength(i * pathLength / P_RESOLUTION));
						}
						var creaseType = detectCrease(node);
						pathPoints.forEach(function(point, i){
							if(i == pathPoints.length-1 && !closed){ return; }
							var nextPoint = pathPoints[ (i+1)%pathPoints.length ];
							creases[creaseType].push( [point.x / bounds.size.height, point.y / bounds.size.height, nextPoint.x / bounds.size.height, nextPoint.y / bounds.size.height] );
						},this);
						break;
					case 'circle':
						var C_RESOLUTION = 64;
						var x = parseFloat(node.attributes.cx.nodeValue);
						var y = parseFloat(node.attributes.cy.nodeValue);
						var r = parseFloat(node.attributes.r.nodeValue);
						var circlePts = [];
						var creaseType = detectCrease(node);
						for(var i = 0; i < C_RESOLUTION; i++){
							circlePts.push([ x + r*Math.cos(i*2*Math.PI/C_RESOLUTION), y + r*Math.sin(i*2*Math.PI/C_RESOLUTION) ]);
						}
						circlePts.forEach(function(point, i){
							var nextPoint = circlePts[ (i+1)%circlePts.length ];
							creases[creaseType].push( [point[0] / bounds.size.height, point[1] / bounds.size.height, nextPoint[0] / bounds.size.height, nextPoint[1] / bounds.size.height] );
						},this);
						break;
					case 'polygon':
					case 'polyline':
						var closed = (node.nodeName == 'polygon') ? true : false;
						var points = node.attributes.points.nodeValue
							.split(' ')
							.filter(function(el){ return el != ""; },this)
							.map(function(el){ return el.split(',').map(function(coord){ return parseFloat(coord); },this) },this);
						var creaseType = detectCrease(node);
						points.forEach(function(point, i){
								if(i == points.length-1 && !closed ){ return; }
								var nextPoint = points[ (i+1)%points.length ];
								creases[creaseType].push( [point[0] / bounds.size.height, point[1] / bounds.size.height, nextPoint[0] / bounds.size.height, nextPoint[1] / bounds.size.height] );
							},this);
						break;
					default:
						if (node.childNodes !== undefined && node.childNodes.length > 0){
							depthFirstAddElement(node.childNodes, creases);
						}
					break;
				}
			},this);
		}
		var creases = { 'mountain':[], 'valley':[], 'mark':[] };
		depthFirstAddElement(xml.children, creases);

		var cp = new CreasePattern();
		// erase boundary, to be set later by convex hull
		cp.nodes = [];
		cp.edges = [];
		creases.mark.forEach(function(p){ cp.newCrease(p[0], p[1], p[2], p[3]).mark(); },this);
		creases.valley.forEach(function(p){ cp.newCrease(p[0], p[1], p[2], p[3]).valley(); },this);
		creases.mountain.forEach(function(p){ cp.newCrease(p[0], p[1], p[2], p[3]).mountain(); },this);
		// find the convex hull of the CP, set it to the boundary
		var points = cp.nodes.map(function(p){ return gimme1XY(p); },this);
		cp.boundary.convexHull(points);
		cp.clean();
		return cp;
	}

	OrigamiPaper.prototype.parseCSSText = function (styleContent) {
		styleElement = document.createElement("style");
		styleElement.textContent = styleContent;
		document.body.appendChild(styleElement);
		var rules = styleElement.sheet.cssRules;
		document.body.removeChild(styleElement);
		return rules;
	};

	OrigamiPaper.prototype.stringNumberToNumber = function(string){ return parseFloat(string); }

	OrigamiPaper.prototype.load = function(path){
		// figure out the file extension
		var extension = 'svg';
		var that = this;
		switch(extension){
			case 'fold':
			fetch(path)
				.then(function(response){ return response.json(); })
				.then(function(data){

				});
			break;
			case 'svg':
			fetch(path)
				.then(response => response.text())
				.then(function(string){
					var cssStyle, data = (new window.DOMParser()).parseFromString(string, "text/xml");
					// console.log(data.childNodes);
					// get CSS style header if it exists
					var styleTag = data.getElementsByTagName('style')[0];
					if(styleTag != undefined && styleTag.childNodes != undefined && styleTag.childNodes.length > 0){
						cssStyle = that.parseCSSText( styleTag.childNodes[0].nodeValue );
					}
					var svg = data.getElementsByTagName('svg')[0];
					that.cp = that.importSVG(svg, cssStyle);
					that.draw();
				});
			break;
		}
	}

	OrigamiPaper.prototype.onResize = function(event){ }
	OrigamiPaper.prototype.onFrame = function(event){ }
	OrigamiPaper.prototype.onMouseDown = function(event){ }
	OrigamiPaper.prototype.onMouseUp = function(event){ }
	OrigamiPaper.prototype.onMouseMove = function(event){ }
	OrigamiPaper.prototype.onMouseDidBeginDrag = function(event){ }

	return OrigamiPaper;
}());
