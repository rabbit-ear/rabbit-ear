/* SVG (c) Robby Kraft, MIT License */
function createShiftArr(step) {
	var space = '    ';
	if ( isNaN(parseInt(step)) ) {
		space = step;
	} else {
		switch(step) {
			case 1: space = ' '; break;
			case 2: space = '  '; break;
			case 3: space = '   '; break;
			case 4: space = '    '; break;
			case 5: space = '     '; break;
			case 6: space = '      '; break;
			case 7: space = '       '; break;
			case 8: space = '        '; break;
			case 9: space = '         '; break;
			case 10: space = '          '; break;
			case 11: space = '           '; break;
			case 12: space = '            '; break;
		}
	}
	var shift = ['\n'];
	for(let ix=0;ix<100;ix++){
		shift.push(shift[ix]+space);
	}
	return shift;
}
function vkbeautify(){
	this.step = '\t';
	this.shift = createShiftArr(this.step);
}vkbeautify.prototype.xml = function(text,step) {
	var ar = text.replace(/>\s{0,}</g,"><")
				 .replace(/</g,"~::~<")
				 .replace(/\s*xmlns\:/g,"~::~xmlns:")
				 .replace(/\s*xmlns\=/g,"~::~xmlns=")
				 .split('~::~'),
		len = ar.length,
		inComment = false,
		deep = 0,
		str = '',
		shift = step ? createShiftArr(step) : this.shift;
		for(let ix=0;ix<len;ix++) {
			if(ar[ix].search(/<!/) > -1) {
				str += shift[deep]+ar[ix];
				inComment = true;
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) {
					inComment = false;
				}
			} else
			if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
				str += ar[ix];
				inComment = false;
			} else
			if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
				/^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
				str += ar[ix];
				if(!inComment) deep--;
			} else
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
				str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
			} else
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			} else
			if(ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
			} else
			if(ar[ix].search(/\/>/) > -1 ) {
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			} else
			if(ar[ix].search(/<\?/) > -1) {
				str += shift[deep]+ar[ix];
			} else
			if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) {
				str += shift[deep]+ar[ix];
			}
			else {
				str += ar[ix];
			}
		}
	return  (str[0] == '\n') ? str.slice(1) : str;
};
vkbeautify.prototype.json = function(text,step) {
	var step = step ? step : this.step;
	if (typeof JSON === 'undefined' ) return text;
	if ( typeof text === "string" ) return JSON.stringify(JSON.parse(text), null, step);
	if ( typeof text === "object" ) return JSON.stringify(text, null, step);
	return text;
};
vkbeautify.prototype.css = function(text, step) {
	var ar = text.replace(/\s{1,}/g,' ')
				.replace(/\{/g,"{~::~")
				.replace(/\}/g,"~::~}~::~")
				.replace(/\;/g,";~::~")
				.replace(/\/\*/g,"~::~/*")
				.replace(/\*\//g,"*/~::~")
				.replace(/~::~\s{0,}~::~/g,"~::~")
				.split('~::~'),
		len = ar.length,
		deep = 0,
		str = '',
		shift = step ? createShiftArr(step) : this.shift;
		for(let ix=0;ix<len;ix++) {
			if( /\{/.exec(ar[ix]))  {
				str += shift[deep++]+ar[ix];
			} else
			if( /\}/.exec(ar[ix]))  {
				str += shift[--deep]+ar[ix];
			} else
			if( /\*\\/.exec(ar[ix]))  {
				str += shift[deep]+ar[ix];
			}
			else {
				str += shift[deep]+ar[ix];
			}
		}
		return str.replace(/^\n{1,}/,'');
};
function isSubquery(str, parenthesisLevel) {
	return  parenthesisLevel - (str.replace(/\(/g,'').length - str.replace(/\)/g,'').length )
}
function split_sql(str, tab) {
	return str.replace(/\s{1,}/g," ")
				.replace(/ AND /ig,"~::~"+tab+tab+"AND ")
				.replace(/ BETWEEN /ig,"~::~"+tab+"BETWEEN ")
				.replace(/ CASE /ig,"~::~"+tab+"CASE ")
				.replace(/ ELSE /ig,"~::~"+tab+"ELSE ")
				.replace(/ END /ig,"~::~"+tab+"END ")
				.replace(/ FROM /ig,"~::~FROM ")
				.replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ")
				.replace(/ HAVING /ig,"~::~HAVING ")
				.replace(/ IN /ig," IN ")
				.replace(/ JOIN /ig,"~::~JOIN ")
				.replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ")
				.replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ")
				.replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ")
				.replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ")
				.replace(/ ON /ig,"~::~"+tab+"ON ")
				.replace(/ OR /ig,"~::~"+tab+tab+"OR ")
				.replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ")
				.replace(/ OVER /ig,"~::~"+tab+"OVER ")
				.replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ")
				.replace(/\)\s{0,}SELECT /ig,")~::~SELECT ")
				.replace(/ THEN /ig," THEN~::~"+tab+"")
				.replace(/ UNION /ig,"~::~UNION~::~")
				.replace(/ USING /ig,"~::~USING ")
				.replace(/ WHEN /ig,"~::~"+tab+"WHEN ")
				.replace(/ WHERE /ig,"~::~WHERE ")
				.replace(/ WITH /ig,"~::~WITH ")
				.replace(/ ALL /ig," ALL ")
				.replace(/ AS /ig," AS ")
				.replace(/ ASC /ig," ASC ")
				.replace(/ DESC /ig," DESC ")
				.replace(/ DISTINCT /ig," DISTINCT ")
				.replace(/ EXISTS /ig," EXISTS ")
				.replace(/ NOT /ig," NOT ")
				.replace(/ NULL /ig," NULL ")
				.replace(/ LIKE /ig," LIKE ")
				.replace(/\s{0,}SELECT /ig,"SELECT ")
				.replace(/\s{0,}UPDATE /ig,"UPDATE ")
				.replace(/ SET /ig," SET ")
				.replace(/~::~{1,}/g,"~::~")
				.split('~::~');
}
vkbeautify.prototype.sql = function(text,step) {
	var ar_by_quote = text.replace(/\s{1,}/g," ")
							.replace(/\'/ig,"~::~\'")
							.split('~::~'),
		len = ar_by_quote.length,
		ar = [],
		deep = 0,
		tab = this.step,
		parenthesisLevel = 0,
		str = '',
		shift = step ? createShiftArr(step) : this.shift;		for(let ix=0;ix<len;ix++) {
			if(ix%2) {
				ar = ar.concat(ar_by_quote[ix]);
			} else {
				ar = ar.concat(split_sql(ar_by_quote[ix], tab) );
			}
		}
		len = ar.length;
		for(let ix=0;ix<len;ix++) {
			parenthesisLevel = isSubquery(ar[ix], parenthesisLevel);
			if( /\s{0,}\s{0,}SELECT\s{0,}/.exec(ar[ix]))  {
				ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"");
			}
			if( /\s{0,}\s{0,}SET\s{0,}/.exec(ar[ix]))  {
				ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"");
			}
			if( /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(ar[ix]))  {
				deep++;
				str += shift[deep]+ar[ix];
			} else
			if( /\'/.exec(ar[ix]) )  {
				if(parenthesisLevel<1 && deep) {
					deep--;
				}
				str += ar[ix];
			}
			else  {
				str += shift[deep]+ar[ix];
				if(parenthesisLevel<1 && deep) {
					deep--;
				}
			}
		}
		str = str.replace(/^\n{1,}/,'').replace(/\n{1,}/g,"\n");
		return str;
};
vkbeautify.prototype.xmlmin = function(text, preserveComments) {
	var str = preserveComments ? text
							   : text.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"")
									 .replace(/[ \r\n\t]{1,}xmlns/g, ' xmlns');
	return  str.replace(/>\s{0,}</g,"><");
};
vkbeautify.prototype.jsonmin = function(text) {
	if (typeof JSON === 'undefined' ) return text;
	return JSON.stringify(JSON.parse(text), null, 0);
};
vkbeautify.prototype.cssmin = function(text, preserveComments) {
	var str = preserveComments ? text
							   : text.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"") ;
	return str.replace(/\s{1,}/g,' ')
			  .replace(/\{\s{1,}/g,"{")
			  .replace(/\}\s{1,}/g,"}")
			  .replace(/\;\s{1,}/g,";")
			  .replace(/\/\*\s{1,}/g,"/*")
			  .replace(/\*\/\s{1,}/g,"*/");
};
vkbeautify.prototype.sqlmin = function(text) {
	return text.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")");
};
var vkbeautify$1 = (new vkbeautify());

const svgNS = "http://www.w3.org/2000/svg";
const setClassIdParent = function(element, className, id, parent) {
	if (className != null) {
		element.setAttributeNS(null, "class", className);
	}
	if (id != null) {
		element.setAttributeNS(null, "id", id);
	}
	if (parent != null) {
		parent.appendChild(element);
	}
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
const line = function(x1, y1, x2, y2, className, id, parent) {
	let shape = document.createElementNS(svgNS, "line");
	shape.setAttributeNS(null, "x1", x1);
	shape.setAttributeNS(null, "y1", y1);
	shape.setAttributeNS(null, "x2", x2);
	shape.setAttributeNS(null, "y2", y2);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const circle = function(x, y, radius, className, id, parent) {
	let shape = document.createElementNS(svgNS, "circle");
	shape.setAttributeNS(null, "cx", x);
	shape.setAttributeNS(null, "cy", y);
	shape.setAttributeNS(null, "r", radius);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const ellipse = function(x, y, rx, ry, className, id, parent) {
	let shape = document.createElementNS(svgNS, "ellipse");
	shape.setAttributeNS(null, "cx", x);
	shape.setAttributeNS(null, "cy", y);
	shape.setAttributeNS(null, "rx", rx);
	shape.setAttributeNS(null, "ry", ry);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const rect = function(x, y, width, height, className, id, parent) {
	let shape = document.createElementNS(svgNS, "rect");
	shape.setAttributeNS(null, "x", x);
	shape.setAttributeNS(null, "y", y);
	shape.setAttributeNS(null, "width", width);
	shape.setAttributeNS(null, "height", height);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const polygon = function(pointsArray, className, id, parent) {
	let shape = document.createElementNS(svgNS, "polygon");
	setPoints(shape, pointsArray);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const polyline = function(pointsArray, className, id, parent) {
	let shape = document.createElementNS(svgNS, "polyline");
	setPoints(shape, pointsArray);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const bezier = function(fromX, fromY, c1X, c1Y, c2X, c2Y,
		toX, toY, className, id, parent) {
	let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y +
			" " + c2X + "," + c2Y + " " + toX + "," + toY;
	let shape = document.createElementNS(svgNS, "path");
	shape.setAttributeNS(null, "d", d);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const text = function(textString, x, y, className, id, parent) {
	let shape = document.createElementNS(svgNS, "text");
	shape.innerHTML = textString;
	shape.setAttributeNS(null, "x", x);
	shape.setAttributeNS(null, "y", y);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const wedge = function(x, y, radius, angleA, angleB, className, id, parent) {
	let shape = document.createElementNS(svgNS, "path");
	setArc(shape, x, y, radius, angleA, angleB, true);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const arc = function(x, y, radius, angleA, angleB, className, id, parent) {
	let shape = document.createElementNS(svgNS, "path");
	setArc(shape, x, y, radius, angleA, angleB, false);
	setClassIdParent(shape, className, id, parent);
	return shape;
};
const regularPolygon = function(cX, cY, radius, sides, className, id, parent) {
	let halfwedge = 2*Math.PI/sides * 0.5;
	let r = Math.cos(halfwedge) * radius;
	let points = Array.from(Array(sides)).map((el,i) => {
		let a = -2 * Math.PI * i / sides + halfwedge;
		let x = cX + r * Math.sin(a);
		let y = cY + r * Math.cos(a);
		return [x, y];
	});
	return polygon(points, className, id, parent);
};
const group = function(className, id, parent) {
	let g = document.createElementNS(svgNS, "g");
	setClassIdParent(g, className, id, parent);
	return g;
};
const svg = function(className, id, parent) {
	let svgImage = document.createElementNS(svgNS, "svg");
	svgImage.setAttribute("version", "1.1");
	svgImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	setClassIdParent(svgImage, className, id, parent);
	return svgImage;
};
const addClass = function(xmlNode, newClass) {
	if (xmlNode == undefined) {
		return;
	}
	let currentClass = xmlNode.getAttribute("class");
	if (currentClass == undefined) {
		currentClass = "";
	}
	let classes = currentClass.split(" ").filter((c) => c !== newClass);
	classes.push(newClass);
	xmlNode.setAttributeNS(null, "class", classes.join(" "));
};
const removeClass = function(xmlNode, newClass) {
	if (xmlNode == undefined) {
		return;
	}
	let currentClass = xmlNode.getAttribute("class");
	if (currentClass == undefined) {
		currentClass = "";
	}
	let classes = currentClass.split(" ").filter((c) => c !== newClass);
	xmlNode.setAttributeNS(null, "class", classes.join(" "));
};
const setId = function(xmlNode, newID) {
	if (xmlNode == undefined) {
		return;
	}
	xmlNode.setAttributeNS(null, "id", newID);
};
const removeChildren = function(group) {
	while (group.lastChild) {
		group.removeChild(group.lastChild);
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
const setDefaultViewBox = function(svg) {
	let size = svg.getBoundingClientRect();
	let width = (size.width == 0 ? 640 : size.width);
	let height = (size.height == 0 ? 480 : size.height);
	setViewBox(svg, 0, 0, width, height);
};
const getViewBox = function(svg) {
	let vb = svg.getAttribute("viewBox");
	return (vb == null
		? undefined
		: vb.split(" ").map((n) => parseFloat(n)));
};
const scale = function(svg, scale, origin_x = 0, origin_y = 0) {
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
const translate = function(svg, dx, dy) {
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
const save = function(svg, filename = "image.svg") {
	let a = document.createElement("a");
	let source = (new window.XMLSerializer()).serializeToString(svg);
	let formatted = vkbeautify$1.xml(source);
	let blob = new window.Blob([formatted], {type: "text/plain"});
	a.setAttribute("href", window.URL.createObjectURL(blob));
	a.setAttribute("download", filename);
	document.body.appendChild(a);
	a.click();
	a.remove();
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

function Image() {
	let params = Array.from(arguments);
	let _svg = svg();
	let _parent = undefined;
	let _scale = 1.0;
	let _padding = 0;
	let _matrix = _svg.createSVGMatrix();
	let _events = {};
	let _mouse = Object.create(null);
	Object.assign(_mouse, {
		isPressed: false,
		position: [0,0],
		pressed: [0,0],
		drag: [0,0],
		prev: [0,0],
		x: 0,
		y: 0
	});
	const zoom = function(scale$$1, origin_x = 0, origin_y = 0) {
		_scale = scale$$1;
		scale(_svg, scale$$1, origin_x, origin_y);
	};
	const translate$$1 = function(dx, dy) {
		translate(_svg, dx, dy);
	};
	const setViewBox$$1 = function(x, y, width, height) {
		setViewBox(_svg, x, y, width, height, _padding);
	};
	const getViewBox$$1 = function() {
		return getViewBox(_svg);
	};
	const appendChild = function(element) {
		_svg.appendChild(element);
	};
	const removeChildren$$1 = function(group$$1) {
		if (group$$1 == null) {
			group$$1 = _svg;
		}
		while (group$$1.lastChild) {
			group$$1.removeChild(group$$1.lastChild);
		}
	};
	const save$$1 = function(filename = "image.svg") {
		return save(_svg, filename);
	};
	const load$$1 = function(data, callback) {
		load(data, function(newSVG, error) {
			if (newSVG != null) {
				if (_svg != null) { _svg.remove(); }
				_svg = newSVG;
				_parent.appendChild(_svg);
				attachHandlers();
			}
			if (callback != null) { callback(newSVG, error); }
		});
	};
	const size = function(w, h) {
		if (w == null || h == null) { return; }
		let vb = getViewBox(_svg);
		setViewBox(_svg, vb[0], vb[1], w, h, _padding);
		_svg.setAttributeNS(null, "width", w);
		_svg.setAttributeNS(null, "height", h);
	};
	const getWidth = function() {
		let w = parseInt(_svg.getAttributeNS(null, "width"));
		return w != null && !isNaN(w) ? w : _svg.getBoundingClientRect().width;
	};
	const getHeight = function() {
		let h = parseInt(_svg.getAttributeNS(null, "height"));
		return h != null && !isNaN(h) ? h : _svg.getBoundingClientRect().height;
	};
	const attachToDOM = function() {
		let functions = params.filter((arg) => typeof arg === "function");
		let numbers = params.filter((arg) => !isNaN(arg));
		let element = params.filter((arg) =>
				arg instanceof HTMLElement)
			.shift();
		let idElement = params.filter((a) =>
				typeof a === "string" || a instanceof String)
			.map(str => document.getElementById(str))
			.shift();
		_parent = (element != null
			? element
			: (idElement != null
				? idElement
				: document.body));
		_parent.appendChild(_svg);
		if (numbers.length >= 2) {
			_svg.setAttributeNS(null, "width", numbers[0]);
			_svg.setAttributeNS(null, "height", numbers[1]);
			setViewBox(_svg, 0, 0, numbers[0], numbers[1]);
		}
		else if (_svg.getAttribute("viewBox") == null) {
			let rect$$1 = _svg.getBoundingClientRect();
			setViewBox(_svg, 0, 0, rect$$1.width, rect$$1.height);
		}
		if (functions.length >= 1) {
			functions[0]();
		}
		attachHandlers();
	};
	let numbers = params.filter((arg) => !isNaN(arg));
	if (numbers.length >= 2) {
		_svg.setAttributeNS(null, "width", numbers[0]);
		_svg.setAttributeNS(null, "height", numbers[1]);
		setViewBox(_svg, 0, 0, numbers[0], numbers[1]);
	}
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', attachToDOM);
	} else {
		attachToDOM();
	}
	function attachHandlers() {
		_svg.addEventListener("mouseup", mouseUpHandler, false);
		_svg.addEventListener("mousedown", mouseDownHandler, false);
		_svg.addEventListener("mousemove", mouseMoveHandler, false);
		_svg.addEventListener("mouseleave", mouseLeaveHandler, false);
		_svg.addEventListener("mouseenter", mouseEnterHandler, false);
		_svg.addEventListener("touchend", mouseUpHandler, false);
		_svg.addEventListener("touchmove", touchMoveHandler, false);
		_svg.addEventListener("touchstart", touchStartHandler, false);
		_svg.addEventListener("touchcancel", mouseUpHandler, false);
	}
	function getMouse() {
		let m = _mouse.position.slice();
		Object.keys(_mouse)
			.filter(key => typeof key === "object")
			.forEach(key => m[key] = _mouse[key].slice());
		Object.keys(_mouse)
			.filter(key => typeof key !== "object")
			.forEach(key => m[key] = _mouse[key]);
		return Object.freeze(m);
	}
	function updateMousePosition(clientX, clientY) {
		_mouse.prev = _mouse.position;
		_mouse.position = convertToViewBox(_svg, clientX, clientY);
		_mouse.x = _mouse.position[0];
		_mouse.y = _mouse.position[1];
	}
	function updateMouseDrag() {
		_mouse.drag = [_mouse.position[0] - _mouse.pressed[0],
		               _mouse.position[1] - _mouse.pressed[1]];
		_mouse.drag.x = _mouse.drag[0];
		_mouse.drag.y = _mouse.drag[1];
	}
	function mouseMoveHandler(event) {
		updateMousePosition(event.clientX, event.clientY);
		let mouse = getMouse();
		if (_mouse.isPressed) { updateMouseDrag(); }
		if (_events.mousemove) {
			_events.mousemove.forEach(f => f(mouse));
		}
	}
	function mouseDownHandler(event) {
		_mouse.isPressed = true;
		_mouse.pressed = convertToViewBox(_svg, event.clientX, event.clientY);
		let mouse = getMouse();
		if (_events.mousedown) {
			_events.mousedown.forEach(f => f(mouse));
		}
	}
	function mouseUpHandler(event) {
		_mouse.isPressed = false;
		let mouse = getMouse();
		if (_events.mouseup) {
			_events.mouseup.forEach(f => f(mouse));
		}
	}
	function mouseLeaveHandler(event) {
		updateMousePosition(event.clientX, event.clientY);
		if (_events.mouseleave) {
			_events.mouseleave.forEach(f => f(mouse));
		}
	}
	function mouseEnterHandler(event) {
		updateMousePosition(event.clientX, event.clientY);
		if (_events.mouseenter) {
			_events.mouseenter.forEach(f => f(mouse));
		}
	}
	function touchStartHandler(event) {
		event.preventDefault();
		let touch = event.touches[0];
		if (touch == null) { return; }
		_mouse.isPressed = true;
		_mouse.pressed = convertToViewBox(_svg, touch.clientX, touch.clientY);
		let mouse = getMouse();
		if (_events.mousedown) {
			_events.mousedown.forEach(f => f(mouse));
		}
	}
	function touchMoveHandler(event) {
		event.preventDefault();
		let touch = event.touches[0];
		if (touch == null) { return; }
		updateMousePosition(touch.clientX, touch.clientY);
		if (_mouse.isPressed) { updateMouseDrag(); }
		let mouse = getMouse();
		if (_events.mousemove) {
			_events.mousemove.forEach(f => f(mouse));
		}
	}
	let _animate, _intervalID, _animationFrame;
	function updateAnimationHandler(handler) {
		if (_animate != null) {
			clearInterval(_intervalID);
		}
		_animate = handler;
		if (_animate != null) {
			_animationFrame = 0;
			_intervalID = setInterval(() => {
				let animObj = {
					"time": _svg.getCurrentTime(),
					"frame": _animationFrame++
				};
				_animate(animObj);
			}, 1000/60);
		}
	}
	const addEventListener = function(eventName, func) {
		if (typeof func !== "function") { throw "must supply a function type to addEventListener"; }
		if (_events[eventName] === undefined) {
			_events[eventName] = [];
		}
		_events[eventName].push(func);
	};
	let _this = {
		zoom, translate: translate$$1, appendChild, removeChildren: removeChildren$$1,
		load: load$$1, save: save$$1,
		setViewBox: setViewBox$$1, getViewBox: getViewBox$$1, size,
		get mouse() { return getMouse(); },
		get scale() { return _scale; },
		get svg() { return _svg; },
		get width() { return getWidth(); },
		get height() { return getHeight(); },
		set width(w) { _svg.setAttributeNS(null, "width", w); },
		set height(h) { _svg.setAttributeNS(null, "height", h); },
		set onMouseMove(handler) { addEventListener("mousemove", handler); },
		set onMouseDown(handler) { addEventListener("mousedown", handler); },
		set onMouseUp(handler) { addEventListener("mouseup", handler); },
		set onMouseLeave(handler) { addEventListener("mouseleave", handler); },
		set onMouseEnter(handler) { addEventListener("mouseenter", handler); },
		set animate(handler) { updateAnimationHandler(handler); },
		addEventListener
	};
	return _this;
}

const controlPoint = function(parent, options) {
	if (options == null) { options = {}; }
	if (options.radius == null) { options.radius = 1; }
	if (options.fill == null) { options.fill = "#000000"; }
	if (options.position == null) { options.position = [0,0]; }
	let c = circle(0, 0, options.radius);
	c.setAttribute("fill", options.fill);
	let _position = options.position.slice();
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
	const onMouseMove = function(mouse) {
		if (_selected) {
			let pos = _updatePosition(mouse);
			setPosition(pos[0], pos[1]);
		}
	};
	const onMouseUp = function(mouse) {
		_selected = false;
	};
	const distance = function(mouse) {
		return Math.sqrt(
			Math.pow(mouse[0] - _position[0], 2) +
			Math.pow(mouse[1] - _position[1], 2)
		);
	};
	let _updatePosition = function(input){ return input; };
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
		set positionDidUpdate(method) { _updatePosition = method; },
		set selected(value) { _selected = true; }
	};
};
function controls(svgObject, number = 1, options) {
	if (options == null) { options = {}; }
	if (options.parent == null) { options.parent = svgObject; }
	if (options.radius == null) { options.radius = 1; }
	if (options.fill == null) { options.fill = "#000000"; }
	let _points = Array.from(Array(number)).map(_ => controlPoint(options.parent, options));
	let _selected = undefined;
	const onMouseDown = function(mouse) {
		if (!(_points.length > 0)) { return; }
		_selected = _points
			.map((p,i) => ({i:i, d:p.distance(mouse)}))
			.sort((a,b) => a.d - b.d)
			.shift()
			.i;
		_points[_selected].selected = true;
	};
	const onMouseMove = function(mouse) {
		_points.forEach(p => p.onMouseMove(mouse));
	};
	const onMouseUp = function(mouse) {
		_points.forEach(p => p.onMouseUp(mouse));
		_selected = undefined;
	};
	svgObject.addEventListener("mousedown", onMouseDown);
	svgObject.addEventListener("mouseup", onMouseUp);
	svgObject.addEventListener("mousemove", onMouseMove);
	Object.defineProperty(_points, "selectedIndex", {get: function() { return _selected; }});
	Object.defineProperty(_points, "selected", {get: function() { return _points[_selected]; }});
	Object.defineProperty(_points, "removeAll", {value: function() {
		_points.forEach(tp => tp.remove());
	}});
	return _points;
}

export { Image, controls, setPoints, setArc, line, circle, ellipse, rect, polygon, polyline, bezier, text, wedge, arc, regularPolygon, group, svg, addClass, removeClass, setId, removeChildren, setViewBox, setDefaultViewBox, getViewBox, scale, translate, convertToViewBox, save, load };
