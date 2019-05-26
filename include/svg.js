/* SVG (c) Robby Kraft, MIT License */
function vkXML(text, step) {
	var ar = text.replace(/>\s{0,}</g,"><")
				 .replace(/</g,"~::~<")
				 .replace(/\s*xmlns\:/g,"~::~xmlns:")
				 .split('~::~'),
		len = ar.length,
		inComment = false,
		deep = 0,
		str = '',
		space = (step != null && typeof step === "string" ? step : "\t");
	var shift = ['\n'];
	for(let si=0; si<100; si++){
		shift.push(shift[si]+space);
	}
	for (let ix=0;ix<len;ix++) {
		if(ar[ix].search(/<!/) > -1) {
			str += shift[deep]+ar[ix];
			inComment = true;
			if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1
				|| ar[ix].search(/!DOCTYPE/) > -1 ) {
				inComment = false;
			}
		}
		else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
			str += ar[ix];
			inComment = false;
		}
		else if ( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
			/^<[\w:\-\.\,]+/.exec(ar[ix-1])
			== /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
			str += ar[ix];
			if (!inComment) { deep--; }
		}
		else if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1
			&& ar[ix].search(/\/>/) == -1 ) {
			str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
		}
		else if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
			str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
		}
		else if(ar[ix].search(/<\//) > -1) {
			str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
		}
		else if(ar[ix].search(/\/>/) > -1 ) {
			str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
		}
		else if(ar[ix].search(/<\?/) > -1) {
			str += shift[deep]+ar[ix];
		}
		else if(ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1){
			console.log("xmlns at level", deep);
			str += shift[deep]+ar[ix];
		}
		else {
			str += ar[ix];
		}
	}
	return  (str[0] == '\n') ? str.slice(1) : str;
}

const removeChildren = function(parent) {
	while (parent.lastChild) {
		parent.removeChild(parent.lastChild);
	}
};
const getWidth = function(svg) {
	let w = parseInt(svg.getAttributeNS(null, "width"));
	return w != null && !isNaN(w) ? w : svg.getBoundingClientRect().width;
};
const getHeight = function(svg) {
	let h = parseInt(svg.getAttributeNS(null, "height"));
	return h != null && !isNaN(h) ? h : svg.getBoundingClientRect().height;
};
const getClassList = function(xmlNode) {
	let currentClass = xmlNode.getAttribute("class");
	return (currentClass == null
		? []
		: currentClass.split(" ").filter((s) => s !== ""));
};
const addClass = function(xmlNode, newClass) {
	if (xmlNode == null) {
		return;
	}
	let classes = getClassList(xmlNode)
		.filter(c => c !== newClass);
	classes.push(newClass);
	xmlNode.setAttributeNS(null, "class", classes.join(" "));
	return xmlNode;
};
const removeClass = function(xmlNode, removedClass) {
	if (xmlNode == null) {
		return;
	}
	let classes = getClassList(xmlNode)
		.filter(c => c !== removedClass);
	xmlNode.setAttributeNS(null, "class", classes.join(" "));
	return xmlNode;
};
const setClass = function(xmlNode, className) {
	xmlNode.setAttributeNS(null, "class", className);
	return xmlNode;
};
const setID = function(xmlNode, idName) {
	xmlNode.setAttributeNS(null, "id", idName);
	return xmlNode;
};
const save = function(svg, filename = "image.svg", includeDOMCSS = false) {
	let a = document.createElement("a");
	if (includeDOMCSS) {
		let styleContainer = document.createElementNS("http://www.w3.org/2000/svg", "style");
		styleContainer.setAttribute("type", "text/css");
		styleContainer.innerHTML = getPageCSS();
		svg.appendChild(styleContainer);
	}
	let source = (new window.XMLSerializer()).serializeToString(svg);
	let formatted = vkXML(source);
	let blob = new window.Blob([formatted], {type: "text/plain"});
	a.setAttribute("href", window.URL.createObjectURL(blob));
	a.setAttribute("download", filename);
	document.body.appendChild(a);
	a.click();
	a.remove();
};
const getPageCSS = function() {
	let css = [];
	for (let s = 0; s < document.styleSheets.length; s++) {
		let sheet = document.styleSheets[s];
		try {
			let rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules;
			for (let r = 0; r < rules.length; r++) {
				let rule = rules[r];
				if ('cssText' in rule){
					css.push(rule.cssText);
				}
				else{
					css.push(rule.selectorText+' {\n'+rule.style.cssText+'\n}\n');
				}
			}
		} catch(error){ }
	}
	return css.join('\n');
};
const pErr = (new window.DOMParser())
	.parseFromString("INVALID", "text/xml")
	.getElementsByTagName("parsererror")[0]
	.namespaceURI;
const load = function(input, callback) {
	if (typeof input === "string" || input instanceof String) {
		let xml = (new window.DOMParser()).parseFromString(input, "text/xml");
		if (xml.getElementsByTagNameNS(pErr, "parsererror").length === 0) {
			let parsedSVG = xml.documentElement;
			if (callback != null) {
				callback(parsedSVG);
			}
			return parsedSVG;
		}
		fetch(input)
			.then((response) => response.text())
			.then((str) => (new window.DOMParser())
				.parseFromString(str, "text/xml")
			).then((svgData) => {
				let allSVGs = svgData.getElementsByTagName("svg");
				if (allSVGs == null || allSVGs.length === 0) {
					throw "error, valid XML found, but no SVG element";
				}
				if (callback != null) {
					callback(allSVGs[0]);
				}
				return allSVGs[0];
			});
	} else if (input instanceof Document) {
		callback(input);
		return input;
	}
};

const setViewBox = function(svg, x, y, width, height, padding = 0) {
	let scale = 1.0;
	let d = (width / scale) - width;
	let X = (x - d) - padding;
	let Y = (y - d) - padding;
	let W = (width + d * 2) + padding * 2;
	let H = (height + d * 2) + padding * 2;
	let viewBoxString = [X, Y, W, H].join(" ");
	svg.setAttributeNS(null, "viewBox", viewBoxString);
};
const getViewBox = function(svg) {
	let vb = svg.getAttribute("viewBox");
	return (vb == null
		? undefined
		: vb.split(" ").map((n) => parseFloat(n)));
};
const scaleViewBox = function(svg, scale, origin_x = 0, origin_y = 0) {
	if (scale < 1e-8) { scale = 0.01; }
	let matrix = svg.createSVGMatrix()
		.translate(origin_x, origin_y)
		.scale(1/scale)
		.translate(-origin_x, -origin_y);
	let viewBox = getViewBox(svg);
	if (viewBox == null) {
		setDefaultViewBox(svg);
	}
	let top_left = svg.createSVGPoint();
	let bot_right = svg.createSVGPoint();
	top_left.x = viewBox[0];
	top_left.y = viewBox[1];
	bot_right.x = viewBox[0] + viewBox[2];
	bot_right.y = viewBox[1] + viewBox[3];
	let new_top_left = top_left.matrixTransform(matrix);
	let new_bot_right = bot_right.matrixTransform(matrix);
	setViewBox(svg,
		new_top_left.x,
		new_top_left.y,
		new_bot_right.x - new_top_left.x,
		new_bot_right.y - new_top_left.y
	);
};
const translateViewBox = function(svg, dx, dy) {
	let viewBox = getViewBox(svg);
	if (viewBox == null) {
		setDefaultViewBox(svg);
	}
	viewBox[0] += dx;
	viewBox[1] += dy;
	svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
};
const convertToViewBox = function(svg, x, y) {
	let pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	let svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	let array = [svgPoint.x, svgPoint.y];
	array.x = svgPoint.x;
	array.y = svgPoint.y;
	return array;
};
const setDefaultViewBox = function(svg) {
	let size = svg.getBoundingClientRect();
	let width = (size.width == 0 ? 640 : size.width);
	let height = (size.height == 0 ? 480 : size.height);
	setViewBox(svg, 0, 0, width, height);
};

const attachClassMethods = function(element) {
	element.removeChildren = function() {
		return removeChildren(element);
	};
	element.addClass = function() {
		return addClass(element, ...arguments);
	};
	element.removeClass = function() {
		return removeClass(element, ...arguments);
	};
	element.setClass = function() {
		return setClass(element, ...arguments);
	};
	element.setID = function() {
		return setID(element, ...arguments);
	};
};
const attachViewBoxMethods = function(element) {
	element.setViewBox = function() {
		return setViewBox(element, ...arguments);
	};
	element.getViewBox = function() {
		return getViewBox(element, ...arguments);
	};
	element.scaleViewBox = function() {
		return scaleViewBox(element, ...arguments);
	};
	element.translateViewBox = function() {
		return translateViewBox(element, ...arguments);
	};
	element.convertToViewBox = function() {
		return convertToViewBox(element, ...arguments);
	};
};
const attachAppendableMethods = function(element, methods) {
	Object.keys(methods).forEach(key => {
		element[key] = function() {
			let g = methods[key](...arguments);
			element.appendChild(g);
			return g;
		};
	});
};

const svgNS = "http://www.w3.org/2000/svg";
const line = function(x1, y1, x2, y2) {
	let shape = document.createElementNS(svgNS, "line");
	if (x1) { shape.setAttributeNS(null, "x1", x1); }
	if (y1) { shape.setAttributeNS(null, "y1", y1); }
	if (x2) { shape.setAttributeNS(null, "x2", x2); }
	if (y2) { shape.setAttributeNS(null, "y2", y2); }
	attachClassMethods(shape);
	return shape;
};
const circle = function(x, y, radius) {
	let shape = document.createElementNS(svgNS, "circle");
	if (x) { shape.setAttributeNS(null, "cx", x); }
	if (y) { shape.setAttributeNS(null, "cy", y); }
	if (radius) { shape.setAttributeNS(null, "r", radius); }
	attachClassMethods(shape);
	return shape;
};
const ellipse = function(x, y, rx, ry) {
	let shape = document.createElementNS(svgNS, "ellipse");
	if (x) { shape.setAttributeNS(null, "cx", x); }
	if (y) { shape.setAttributeNS(null, "cy", y); }
	if (rx) { shape.setAttributeNS(null, "rx", rx); }
	if (ry) { shape.setAttributeNS(null, "ry", ry); }
	attachClassMethods(shape);
	return shape;
};
const rect = function(x, y, width, height) {
	let shape = document.createElementNS(svgNS, "rect");
	if (x) { shape.setAttributeNS(null, "x", x); }
	if (y) { shape.setAttributeNS(null, "y", y); }
	if (width) { shape.setAttributeNS(null, "width", width); }
	if (height) { shape.setAttributeNS(null, "height", height); }
	attachClassMethods(shape);
	return shape;
};
const polygon = function(pointsArray) {
	let shape = document.createElementNS(svgNS, "polygon");
	setPoints(shape, pointsArray);
	attachClassMethods(shape);
	return shape;
};
const polyline = function(pointsArray) {
	let shape = document.createElementNS(svgNS, "polyline");
	setPoints(shape, pointsArray);
	attachClassMethods(shape);
	return shape;
};
const bezier = function(fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
	let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y +
			" " + c2X + "," + c2Y + " " + toX + "," + toY;
	let shape = document.createElementNS(svgNS, "path");
	shape.setAttributeNS(null, "d", d);
	attachClassMethods(shape);
	return shape;
};
const text = function(textString, x, y) {
	let shape = document.createElementNS(svgNS, "text");
	shape.innerHTML = textString;
	shape.setAttributeNS(null, "x", x);
	shape.setAttributeNS(null, "y", y);
	attachClassMethods(shape);
	return shape;
};
const wedge = function(x, y, radius, angleA, angleB) {
	let shape = document.createElementNS(svgNS, "path");
	setArc(shape, x, y, radius, angleA, angleB, true);
	attachClassMethods(shape);
	return shape;
};
const arc = function(x, y, radius, angleA, angleB) {
	let shape = document.createElementNS(svgNS, "path");
	setArc(shape, x, y, radius, angleA, angleB, false);
	attachClassMethods(shape);
	return shape;
};
const setPoints = function(polygon, pointsArray) {
	if (pointsArray == null || pointsArray.constructor !== Array) {
		return;
	}
	let pointsString = pointsArray.map((el) =>
		(el.constructor === Array ? el : [el.x, el.y])
	).reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	polygon.setAttributeNS(null, "points", pointsString);
};
const setArc = function(shape, x, y, radius, startAngle, endAngle,
		includeCenter = false) {
	let start = [
		x + Math.cos(startAngle) * radius,
		y + Math.sin(startAngle) * radius ];
	let vecStart = [
		Math.cos(startAngle) * radius,
		Math.sin(startAngle) * radius ];
	let vecEnd = [
		Math.cos(endAngle) * radius,
		Math.sin(endAngle) * radius ];
	let arcVec = [vecEnd[0] - vecStart[0], vecEnd[1] - vecStart[1]];
	let py = vecStart[0]*vecEnd[1] - vecStart[1]*vecEnd[0];
	let px = vecStart[0]*vecEnd[0] + vecStart[1]*vecEnd[1];
	let arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
	let d = (includeCenter
		? "M " + x + "," + y + " l " + vecStart[0] + "," + vecStart[1] + " "
		: "M " + start[0] + "," + start[1] + " ");
	d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
	if (includeCenter) { d += " Z"; }
	shape.setAttributeNS(null, "d", d);
};

const regularPolygon = function(cX, cY, radius, sides) {
	let halfwedge = 2*Math.PI/sides * 0.5;
	let r = Math.cos(halfwedge) * radius;
	let points = Array.from(Array(sides)).map((el,i) => {
		let a = -2 * Math.PI * i / sides + halfwedge;
		let x = cX + r * Math.sin(a);
		let y = cY + r * Math.cos(a);
		return [x, y];
	});
	return polygon(points);
};

const svgNS$1 = "http://www.w3.org/2000/svg";
const straightArrow = function(start, end, options) {
	let p = {
		color: "#000",
		strokeWidth: 0.5,
		strokeStyle: "",
		fillStyle: "",
		highlight: undefined,
		highlightStrokeStyle: "",
		highlightFillStyle: "",
		width: 0.5,
		length: 2,
		start: false,
		end: true,
	};
	if (typeof options === "object" && options !== null) {
		Object.assign(p, options);
	}
	let arrowFill = [
		"stroke:none",
		"fill:"+p.color,
		p.fillStyle
	].filter(a => a !== "").join(";");
	let arrowStroke = [
		"fill:none",
		"stroke:" + p.color,
		"stroke-width:" + p.strokeWidth,
		p.strokeStyle
	].filter(a => a !== "").join(";");
	let thinStroke = Math.floor(p.strokeWidth * 3) / 10;
	let thinSpace = Math.floor(p.strokeWidth * 6) / 10;
	let highlightStroke = [
		"fill:none",
		"stroke:" + p.highlight,
		"stroke-width:" + p.strokeWidth * 0.5,
		"stroke-dasharray:" + thinStroke + " " + thinSpace,
		"stroke-linecap:round",
		p.strokeStyle
	].filter(a => a !== "").join(";");
	let highlightFill = [
		"stroke:none",
		"fill:"+p.highlight,
		p.fillStyle
	].filter(a => a !== "").join(";");
	let vec = [end[0]-start[0], end[1]-start[1]];
	let arrowLength = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
	let arrowVector = [vec[0] / arrowLength, vec[1] / arrowLength];
	let arrow90 = [arrowVector[1], -arrowVector[0]];
	let endHead = [
		[end[0] + arrow90[0]*p.width, end[1] + arrow90[1]*p.width],
		[end[0] - arrow90[0]*p.width, end[1] - arrow90[1]*p.width],
		[end[0] + arrowVector[0]*p.length, end[1] + arrowVector[1]*p.length]
	];
	let startHead = [
		[start[0] - arrow90[0]*p.width, start[1] - arrow90[1]*p.width],
		[start[0] + arrow90[0]*p.width, start[1] + arrow90[1]*p.width],
		[start[0] - arrowVector[0]*p.length, start[1] - arrowVector[1]*p.length]
	];
	let arrow = document.createElementNS(svgNS$1, "g");
	let l = line(start[0], start[1], end[0], end[1]);
	l.setAttribute("style", arrowStroke);
	arrow.appendChild(l);
	if (p.end) {
		let endArrowPoly = polygon(endHead);
		endArrowPoly.setAttribute("style", arrowFill);
		arrow.appendChild(endArrowPoly);
	}
	if (p.start) {
		let startArrowPoly = polygon(startHead);
		startArrowPoly.setAttribute("style", arrowFill);
		arrow.appendChild(startArrowPoly);
	}
	if (p.highlight !== undefined) {
		let hScale = 0.6;
		let centering = [
			arrowVector[0]*p.length*0.09,
			arrowVector[1]*p.length*0.09
		];
		let endHeadHighlight = [
			[centering[0] + end[0] + arrow90[0]*(p.width * hScale),
			 centering[1] + end[1] + arrow90[1]*(p.width * hScale)],
			[centering[0] + end[0] - arrow90[0]*(p.width * hScale),
			 centering[1] + end[1] - arrow90[1]*(p.width * hScale)],
			[centering[0] + end[0] + arrowVector[0]*(p.length * hScale),
			 centering[1] + end[1] + arrowVector[1]*(p.length * hScale)]
		];
		let startHeadHighlight = [
			[-centering[0] + start[0] - arrow90[0]*(p.width * hScale),
			 -centering[1] + start[1] - arrow90[1]*(p.width * hScale)],
			[-centering[0] + start[0] + arrow90[0]*(p.width * hScale),
			 -centering[1] + start[1] + arrow90[1]*(p.width * hScale)],
			[-centering[0] + start[0] - arrowVector[0]*(p.length * hScale),
			 -centering[1] + start[1] - arrowVector[1]*(p.length * hScale)]
		];
		let highline = line(start[0], start[1], end[0], end[1]);
		highline.setAttribute("style", highlightStroke);
		arrow.appendChild(highline);
		if (p.end) {
			let endArrowHighlight = polygon(endHeadHighlight);
			endArrowHighlight.setAttribute("style", highlightFill);
			arrow.appendChild(endArrowHighlight);
		}
		if (p.start) {
			let startArrowHighlight = polygon(startHeadHighlight);
			startArrowHighlight.setAttribute("style", highlightFill);
			arrow.appendChild(startArrowHighlight);
		}
	}
	return arrow;
};
const arcArrow = function(startPoint, endPoint, options) {
	let p = {
		color: "#000",
		strokeWidth: 0.5,
		width: 0.5,
		length: 2,
		bend: 0.3,
		pinch: 0.618,
		padding: 0.5,
		side: true,
		start: false,
		end: true,
		strokeStyle: "",
		fillStyle: "",
	};
	if (typeof options === "object" && options !== null) {
		Object.assign(p, options);
	}
	let arrowFill = [
		"stroke:none",
		"fill:"+p.color,
		p.fillStyle
	].filter(a => a !== "").join(";");
	let arrowStroke = [
		"fill:none",
		"stroke:" + p.color,
		"stroke-width:" + p.strokeWidth,
		p.strokeStyle
	].filter(a => a !== "").join(";");
	let vector = [endPoint[0]-startPoint[0], endPoint[1]-startPoint[1]];
	let perpendicular = [vector[1], -vector[0]];
	let midpoint = [startPoint[0] + vector[0]/2, startPoint[1] + vector[1]/2];
	let bezPoint = [
		midpoint[0] + perpendicular[0]*(p.side?1:-1) * p.bend,
		midpoint[1] + perpendicular[1]*(p.side?1:-1) * p.bend
	];
	let bezStart = [bezPoint[0] - startPoint[0], bezPoint[1] - startPoint[1]];
	let bezEnd = [bezPoint[0] - endPoint[0], bezPoint[1] - endPoint[1]];
	let bezStartLen = Math.sqrt(bezStart[0]*bezStart[0]+bezStart[1]*bezStart[1]);
	let bezEndLen = Math.sqrt(bezEnd[0]*bezEnd[0]+bezEnd[1]*bezEnd[1]);
	let bezStartNorm = [bezStart[0]/bezStartLen, bezStart[1]/bezStartLen];
	let bezEndNorm = [bezEnd[0]/bezEndLen, bezEnd[1]/bezEndLen];
	let arcStart = [
		startPoint[0] + bezStartNorm[0]*p.length*((p.start?1:0)+p.padding),
		startPoint[1] + bezStartNorm[1]*p.length*((p.start?1:0)+p.padding)
	];
	let arcEnd = [
		endPoint[0] + bezEndNorm[0]*p.length*((p.end?1:0)+p.padding),
		endPoint[1] + bezEndNorm[1]*p.length*((p.end?1:0)+p.padding)
	];
	let controlStart = [
		arcStart[0] + (bezPoint[0] - arcStart[0]) * p.pinch,
		arcStart[1] + (bezPoint[1] - arcStart[1]) * p.pinch
	];
	let controlEnd = [
		arcEnd[0] + (bezPoint[0] - arcEnd[0]) * p.pinch,
		arcEnd[1] + (bezPoint[1] - arcEnd[1]) * p.pinch
	];
	let startVec = [-bezStartNorm[0], -bezStartNorm[1]];
	let endVec = [-bezEndNorm[0], -bezEndNorm[1]];
	let startNormal = [startVec[1], -startVec[0]];
	let endNormal = [endVec[1], -endVec[0]];
	let startPoints = [
		[arcStart[0]+startNormal[0]*-p.width, arcStart[1]+startNormal[1]*-p.width],
		[arcStart[0]+startNormal[0]*p.width, arcStart[1]+startNormal[1]*p.width],
		[arcStart[0]+startVec[0]*p.length, arcStart[1]+startVec[1]*p.length]
	];
	let endPoints = [
		[arcEnd[0]+endNormal[0]*-p.width, arcEnd[1]+endNormal[1]*-p.width],
		[arcEnd[0]+endNormal[0]*p.width, arcEnd[1]+endNormal[1]*p.width],
		[arcEnd[0]+endVec[0]*p.length, arcEnd[1]+endVec[1]*p.length]
	];
	let arrowGroup = document.createElementNS(svgNS$1, "g");
	let arrowArc = bezier(
		arcStart[0], arcStart[1], controlStart[0], controlStart[1],
		controlEnd[0], controlEnd[1], arcEnd[0], arcEnd[1]
	);
	arrowArc.setAttribute("style", arrowStroke);
	arrowGroup.appendChild(arrowArc);
	if (p.start) {
		let startHead = polygon(startPoints);
		startHead.setAttribute("style", arrowFill);
		arrowGroup.appendChild(startHead);
	}
	if (p.end) {
		let endHead = polygon(endPoints);
		endHead.setAttribute("style", arrowFill);
		arrowGroup.appendChild(endHead);
	}
	return arrowGroup;
};

const svgNS$2 = "http://www.w3.org/2000/svg";
const svg = function() {
	let svgImage = document.createElementNS(svgNS$2, "svg");
	svgImage.setAttribute("version", "1.1");
	svgImage.setAttribute("xmlns", svgNS$2);
	setupSVG(svgImage);
	return svgImage;
};
const group = function() {
	let g = document.createElementNS(svgNS$2, "g");
	attachClassMethods(g);
	attachAppendableMethods(g, drawMethods);
	return g;
};
const setupSVG = function(svgImage) {
	attachClassMethods(svgImage);
	attachViewBoxMethods(svgImage);
	attachAppendableMethods(svgImage, drawMethods);
};
const drawMethods = {
	"line" : line,
	"circle" : circle,
	"ellipse" : ellipse,
	"rect" : rect,
	"polygon" : polygon,
	"polyline" : polyline,
	"bezier" : bezier,
	"text" : text,
	"wedge" : wedge,
	"arc" : arc,
	"group" : group,
	"straightArrow": straightArrow,
	"arcArrow": arcArrow,
	"regularPolygon": regularPolygon
};

const Names = {
	begin: "onMouseDown",
	enter: "onMouseEnter",
	leave: "onMouseLeave",
	move: "onMouseMove",
	end: "onMouseUp",
	scroll: "onScroll",
};
const Pointer = function(node) {
	let _node = node;
	let _pointer = Object.create(null);
	Object.assign(_pointer, {
		isPressed: false,
		position: [0,0],
		pressed: [0,0],
		drag: [0,0],
		prev: [0,0],
		x: 0,
		y: 0
	});
	const getPointer = function() {
		let m = _pointer.position.slice();
		Object.keys(_pointer)
			.filter(key => typeof key === "object")
			.forEach(key => m[key] = _pointer[key].slice());
		Object.keys(_pointer)
			.filter(key => typeof key !== "object")
			.forEach(key => m[key] = _pointer[key]);
		return Object.freeze(m);
	};
	const setPosition = function(clientX, clientY) {
		_pointer.position = convertToViewBox(_node, clientX, clientY);
		_pointer.x = _pointer.position[0];
		_pointer.y = _pointer.position[1];
	};
	const didRelease = function(clientX, clientY) {
		_pointer.isPressed = false;
	};
	const didPress = function(clientX, clientY) {
		_pointer.isPressed = true;
		_pointer.pressed = convertToViewBox(_node, clientX, clientY);
		setPosition(clientX, clientY);
	};
	const didMove = function(clientX, clientY) {
		_pointer.prev = _pointer.position;
		setPosition(clientX, clientY);
		if (_pointer.isPressed) {
			updateDrag();
		}
	};
	const updateDrag = function() {
		_pointer.drag = [_pointer.position[0] - _pointer.pressed[0],
		               _pointer.position[1] - _pointer.pressed[1]];
		_pointer.drag.x = _pointer.drag[0];
		_pointer.drag.y = _pointer.drag[1];
	};
	let _this = {};
	Object.defineProperty(_this, "getPointer", {value: getPointer});
	Object.defineProperty(_this, "didMove", {value: didMove});
	Object.defineProperty(_this, "didPress", {value: didPress});
	Object.defineProperty(_this, "didRelease", {value: didRelease});
	Object.defineProperty(_this, "node", {set: function(n){ _node = n; }});
	return _this;
};
function Events(node) {
	let _node;
	let _pointer = Pointer(node);
	let _events = {};
	const fireEvents = function(event, events) {
		if (events == null) { return; }
		if (events.length > 0) {
			event.preventDefault();
		}
		let mouse = _pointer.getPointer();
		events.forEach(f => f(mouse));
	};
	const mouseMoveHandler = function(event) {
		let events = _events[Names.move];
		_pointer.didMove(event.clientX, event.clientY);
		fireEvents(event, events);
	};
	const mouseDownHandler = function(event) {
		let events = _events[Names.begin];
		_pointer.didPress(event.clientX, event.clientY);
		fireEvents(event, events);
	};
	const mouseUpHandler = function(event) {
		mouseMoveHandler(event);
		let events = _events[Names.end];
		_pointer.didRelease(event.clientX, event.clientY);
		fireEvents(event, events);
	};
	const mouseLeaveHandler = function(event) {
		let events = _events[Names.leave];
		_pointer.didMove(event.clientX, event.clientY);
		fireEvents(event, events);
	};
	const mouseEnterHandler = function(event) {
		let events = _events[Names.enter];
		_pointer.didMove(event.clientX, event.clientY);
		fireEvents(event, events);
	};
	const touchStartHandler = function(event) {
		let events = _events[Names.begin];
		let touch = event.touches[0];
		if (touch == null) { return; }
		_pointer.didPress(touch.clientX, touch.clientY);
		fireEvents(event, events);
	};
	const touchEndHandler = function(event) {
		let events = _events[Names.end];
		_pointer.didRelease();
		fireEvents(event, events);
	};
	const touchMoveHandler = function(event) {
		let events = _events[Names.move];
		let touch = event.touches[0];
		if (touch == null) { return; }
		_pointer.didMove(touch.clientX, touch.clientY);
		fireEvents(event, events);
	};
	const scrollHandler = function(event) {
		let events = _events[Names.scroll];
		let e = {
			deltaX: event.deltaX,
			deltaY: event.deltaY,
			deltaZ: event.deltaZ,
		};
		e.position = convertToViewBox(_node, event.clientX, event.clientY);
		e.x = e.position[0];
		e.y = e.position[1];
		if (events == null) { return; }
		if (events.length > 0) {
			event.preventDefault();
		}
		events.forEach(f => f(e));
	};
	let _animate, _intervalID, _animationFrame;
	const updateAnimationHandler = function(handler) {
		if (_animate != null) {
			clearInterval(_intervalID);
		}
		_animate = handler;
		if (_animate != null) {
			_animationFrame = 0;
			_intervalID = setInterval(() => {
				let animObj = {
					"time": _node.getCurrentTime(),
					"frame": _animationFrame++
				};
				_animate(animObj);
			}, 1000/60);
		}
	};
	const handlers = {
		mouseup: mouseUpHandler,
		mousedown: mouseDownHandler,
		mousemove: mouseMoveHandler,
		mouseleave: mouseLeaveHandler,
		mouseenter: mouseEnterHandler,
		touchend: touchEndHandler,
		touchmove: touchMoveHandler,
		touchstart: touchStartHandler,
		touchcancel: touchEndHandler,
		wheel: scrollHandler,
	};
	const addEventListener = function(eventName, func) {
		if (typeof func !== "function") {
			throw "must supply a function type to addEventListener";
		}
		if (_events[eventName] === undefined) {
			_events[eventName] = [];
		}
		_events[eventName].push(func);
	};
	const attachHandlers = function(element) {
		Object.keys(handlers).forEach(key =>
			element.addEventListener(key, handlers[key], false)
		);
		updateAnimationHandler(_animate);
	};
	const removeHandlers = function(element) {
		Object.keys(handlers).forEach(key =>
			element.removeEventListener(key, handlers[key], false)
		);
		if (_animate != null) {
			clearInterval(_intervalID);
		}
	};
	const setup = function(node) {
		if (_node != null) {
			removeHandlers(_node);
		}
		_node = node;
		_pointer.node = _node;
		Object.keys(Names).map(key => Names[key]).forEach(key => {
			Object.defineProperty(_node, key, {
				set: function(handler) { addEventListener(key, handler); }
			});
		});
		Object.defineProperty(_node, "animate", {
			set: function(handler) { updateAnimationHandler(handler); }
		});
		Object.defineProperty(_node, "mouse", {get: function(){ return _pointer.getPointer(); }});
		Object.defineProperty(_node, "pointer", {get: function(){ return _pointer.getPointer(); }});
		attachHandlers(_node);
	};
	setup(node);
	return {
		setup,
		addEventListener,
		remove: function() { removeHandlers(_node); }
	};
}

function image() {
	let _svg = svg();
	let params = Array.from(arguments);
	initSize(_svg, params);
	attachSVGMethods(_svg);
	_svg.events = Events(_svg);
	const setup = function() {
		initSize(_svg, params);
		getElement(params).appendChild(_svg);
		params.filter((arg) => typeof arg === "function")
			.forEach((func) => func());
	};
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', setup);
	} else {
		setup();
	}
	return _svg;
}const getElement = function(params) {
	let element = params.filter((arg) =>
			arg instanceof HTMLElement
		).shift();
	let idElement = params.filter((a) =>
			typeof a === "string" || a instanceof String)
		.map(str => document.getElementById(str))
		.shift();
	return (element != null
		? element
		: (idElement != null
			? idElement
			: document.body));
};
const initSize = function(svg$$1, params) {
	let numbers = params.filter((arg) => !isNaN(arg));
	if (numbers.length >= 2) {
		svg$$1.setAttributeNS(null, "width", numbers[0]);
		svg$$1.setAttributeNS(null, "height", numbers[1]);
		setViewBox(svg$$1, 0, 0, numbers[0], numbers[1]);
	}
	else if (svg$$1.getAttribute("viewBox") == null) {
		let rect = svg$$1.getBoundingClientRect();
		setViewBox(svg$$1, 0, 0, rect.width, rect.height);
	}
};
const attachSVGMethods = function(element) {
	Object.defineProperty(element, "w", {
		get: function(){ return getWidth(element); },
		set: function(w){ element.setAttributeNS(null, "width", w); }
	});
	Object.defineProperty(element, "h", {
		get: function(){ return getHeight(element); },
		set: function(h){ element.setAttributeNS(null, "height", h); }
	});
	element.getWidth = function() { return getWidth(element); };
	element.getHeight = function() { return getHeight(element); };
	element.setWidth = function(w) { element.setAttributeNS(null, "width", w); };
	element.setHeight = function(h) { element.setAttributeNS(null, "height", h); };
	element.save = function(filename = "image.svg") {
		return save(element, filename);
	};
	element.load = function(data, callback) {
		load(data, function(newSVG, error) {
			let parent = element.parentNode;
			if (newSVG != null) {
				newSVG.events = element.events;
				setupSVG(newSVG);
				if (newSVG.events == null) { newSVG.events = Events(newSVG); }
				else { newSVG.events.setup(newSVG); }
				attachSVGMethods(newSVG);
				if (parent != null) { parent.insertBefore(newSVG, element); }
				element.remove();
				element = newSVG;
			}
			if (callback != null) { callback(element, error); }
		});
	};
};

const controlPoint = function(parent, options) {
	if (options == null) { options = {}; }
	if (options.radius == null) { options.radius = 1; }
	if (options.fill == null) { options.fill = "#000000"; }
	let c = circle(0, 0, options.radius);
	c.setAttribute("fill", options.fill);
	let _position = [0,0];
	let _selected = false;
	if (parent != null) {
		parent.appendChild(c);
	}
	const setPosition = function(x, y) {
		_position[0] = x;
		_position[1] = y;
		c.setAttribute("cx", x);
		c.setAttribute("cy", y);
	};
	if ("position" in options) {
		let pos = options.position;
		if (pos[0] != null) { setPosition(...pos); }
		else if (pos.x != null) { setPosition(pos.x, pos.y); }
	}
	const onMouseMove = function(mouse) {
		if (_selected) {
			let pos = _updatePosition(mouse);
			setPosition(pos[0], pos[1]);
		}
	};
	const onMouseUp = function() {
		_selected = false;
	};
	const distance = function(mouse) {
		return Math.sqrt(
			Math.pow(mouse[0] - _position[0], 2) +
			Math.pow(mouse[1] - _position[1], 2)
		);
	};
	let _updatePosition = function(input){ return input; };
	const remove = function() {
		parent.removeChild(c);
	};
	return {
		circle: c,
		set position(pos) {
			if (pos[0] != null) { setPosition(pos[0], pos[1]); }
			else if (pos.x != null) { setPosition(pos.x, pos.y); }
		},
		get position() { return [..._position]; },
		onMouseUp,
		onMouseMove,
		distance,
		remove,
		set positionDidUpdate(method) { _updatePosition = method; },
		set selected(value) { _selected = true; }
	};
};
function controls(parent, number, options) {
	if (options == null) { options = {}; }
	if (options.parent == null) { options.parent = parent; }
	if (options.radius == null) { options.radius = 1; }
	if (options.fill == null) { options.fill = "#000000"; }
	let _points = Array.from(Array(number))
		.map(_ => controlPoint(options.parent, options));
	let _selected = undefined;
	const mouseDownHandler = function(event) {
		event.preventDefault();
		let mouse = convertToViewBox(parent, event.clientX, event.clientY);
		if (!(_points.length > 0)) { return; }
		_selected = _points
			.map((p,i) => ({i:i, d:p.distance(mouse)}))
			.sort((a,b) => a.d - b.d)
			.shift()
			.i;
		_points[_selected].selected = true;
	};
	const mouseMoveHandler = function(event) {
		event.preventDefault();
		let mouse = convertToViewBox(parent, event.clientX, event.clientY);
		_points.forEach(p => p.onMouseMove(mouse));
	};
	const mouseUpHandler = function(event) {
		event.preventDefault();
		_points.forEach(p => p.onMouseUp());
		_selected = undefined;
	};
	const touchDownHandler = function(event) {
		event.preventDefault();
		let touch = event.touches[0];
		if (touch == null) { return; }
		let pointer = convertToViewBox(parent, touch.clientX, touch.clientY);
		if (!(_points.length > 0)) { return; }
		_selected = _points
			.map((p,i) => ({i:i, d:p.distance(pointer)}))
			.sort((a,b) => a.d - b.d)
			.shift()
			.i;
		_points[_selected].selected = true;
	};
	const touchMoveHandler = function(event) {
		event.preventDefault();
		let touch = event.touches[0];
		if (touch == null) { return; }
		let pointer = convertToViewBox(parent, touch.clientX, touch.clientY);
		_points.forEach(p => p.onMouseMove(pointer));
	};
	const touchUpHandler = function(event) {
		event.preventDefault();
		_points.forEach(p => p.onMouseUp());
		_selected = undefined;
	};
	parent.addEventListener("touchstart", touchDownHandler, false);
	parent.addEventListener("touchend", touchUpHandler, false);
	parent.addEventListener("touchcancel", touchUpHandler, false);
	parent.addEventListener("touchmove", touchMoveHandler, false);
	parent.addEventListener("mousedown", mouseDownHandler, false);
	parent.addEventListener("mouseup", mouseUpHandler, false);
	parent.addEventListener("mousemove", mouseMoveHandler, false);
	Object.defineProperty(_points, "selectedIndex", {
		get: function() { return _selected; }
	});
	Object.defineProperty(_points, "selected", {
		get: function() { return _points[_selected]; }
	});
	Object.defineProperty(_points, "removeAll", {value: function() {
		_points.forEach(tp => tp.remove());
		_points.splice(0, _points.length);
		_selected = undefined;
	}});
	Object.defineProperty(_points, "add", {value: function(options) {
		_points.push(controlPoint(parent, options));
	}});
	return _points;
}

export { svg, group, line, circle, ellipse, rect, polygon, polyline, bezier, text, wedge, arc, setPoints, setArc, regularPolygon, straightArrow, arcArrow, setViewBox, getViewBox, scaleViewBox, translateViewBox, convertToViewBox, removeChildren, save, load, image, controls };
