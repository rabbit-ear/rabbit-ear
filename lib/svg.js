/* SVG (c) Robby Kraft, MIT License */
// converted to a Javascript module. a few lines modified

/**
* vkBeautify - javascript plugin to pretty-print or minify text in XML, JSON, CSS and SQL formats.
*  
* Version - 0.99.00.beta 
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/vkbeautify/
* 
* MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*
*   Pretty print
*
*        vkbeautify.xml(text [,indent_pattern]);
*        vkbeautify.json(text [,indent_pattern]);
*        vkbeautify.css(text [,indent_pattern]);
*        vkbeautify.sql(text [,indent_pattern]);
*
*        @text - String; text to beatufy;
*        @indent_pattern - Integer | String;
*                Integer:  number of white spaces;
*                String:   character string to visualize indentation ( can also be a set of white spaces )
*   Minify
*
*        vkbeautify.xmlmin(text [,preserve_comments]);
*        vkbeautify.jsonmin(text);
*        vkbeautify.cssmin(text [,preserve_comments]);
*        vkbeautify.sqlmin(text);
*
*        @text - String; text to minify;
*        @preserve_comments - Bool; [optional];
*                Set this flag to true to prevent removing comments from @text ( minxml and mincss functions only. )
*
*   Examples:
*        vkbeautify.xml(text); // pretty print XML
*        vkbeautify.json(text, 4 ); // pretty print JSON
*        vkbeautify.css(text, '. . . .'); // pretty print CSS
*        vkbeautify.sql(text, '----'); // pretty print SQL
*
*        vkbeautify.xmlmin(text, true);// minify XML, preserve comments
*        vkbeautify.jsonmin(text);// minify JSON
*        vkbeautify.cssmin(text);// minify CSS, remove comments ( default )
*        vkbeautify.sqlmin(text);// minify SQL
*
*/

function createShiftArr(step) {

	var space = '    ';
	
	if ( isNaN(parseInt(step)) ) {  // argument is string
		space = step;
	} else { // argument is integer
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

	var shift = ['\n']; // array of shifts
	for(let ix=0;ix<100;ix++){
		shift.push(shift[ix]+space); 
	}
	return shift;
}

function vkbeautify(){
	this.step = '\t'; // 4 spaces
	this.shift = createShiftArr(this.step);
}
vkbeautify.prototype.xml = function(text,step) {

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
			// start comment or <![CDATA[...]]> or <!DOCTYPE //
			if(ar[ix].search(/<!/) > -1) { 
				str += shift[deep]+ar[ix];
				inComment = true; 
				// end comment  or <![CDATA[...]]> //
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) { 
					inComment = false; 
				}
			} else 
			// end comment  or <![CDATA[...]]> //
			if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) { 
				str += ar[ix];
				inComment = false; 
			} else 
			// <elm></elm> //
			if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
				/^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) { 
				str += ar[ix];
				if(!inComment) deep--;
			} else
			 // <elm> //
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
				str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
			} else 
			 // <elm>...</elm> //
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			} else 
			// </elm> //
			if(ar[ix].search(/<\//) > -1) { 
				str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
			} else 
			// <elm/> //
			if(ar[ix].search(/\/>/) > -1 ) { 
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			} else 
			// <? xml ... ?> //
			if(ar[ix].search(/<\?/) > -1) { 
				str += shift[deep]+ar[ix];
			} else 
			// xmlns //
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
		
	return text; // text is not string nor object
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

//----------------------------------------------------------------------------

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
				//.replace(/ SET /ig," SET~::~")
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
				
				//.replace(/\,\s{0,}\(/ig,",~::~( ")
				//.replace(/\,/ig,",~::~"+tab+tab+"")

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
		tab = this.step,//+this.step,
		parenthesisLevel = 0,
		str = '',
		shift = step ? createShiftArr(step) : this.shift;
		for(let ix=0;ix<len;ix++) {
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

/** simple svg in javascript
 *
 * @param: the order in the geometry functions follow a general guideline
 *  - the necessary parameters for the geometry, number of params varies
 *  - className
 *  - id
 *  - the parent container to append this new element
 *
 * you can set all these later. some are more important than others.
 * if you don't use the parent parameter, you'll want to append 
 * this object to an SVG or group using .appendChild 
 *
 * @returns: the new geometry XML object.
 */

const svgNS = "http://www.w3.org/2000/svg";

/**
 * geometry primitives
 */

function line(x1, y1, x2, y2, className, id, parent) {
	let shape = document.createElementNS(svgNS, "line");
	shape.setAttributeNS(null, "x1", x1);
	shape.setAttributeNS(null, "y1", y1);
	shape.setAttributeNS(null, "x2", x2);
	shape.setAttributeNS(null, "y2", y2);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

function circle(x, y, radius, className, id, parent) {
	let shape = document.createElementNS(svgNS, "circle");
	shape.setAttributeNS(null, "cx", x);
	shape.setAttributeNS(null, "cy", y);
	shape.setAttributeNS(null, "r", radius);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

function rect(x, y, width, height, className, id, parent) {
	let shape = document.createElementNS(svgNS, "rect");
	shape.setAttributeNS(null, "x", x);
	shape.setAttributeNS(null, "y", y);
	shape.setAttributeNS(null, "width", width);
	shape.setAttributeNS(null, "height", height);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

function polygon(pointsArray, className, id, parent) {
	let shape = document.createElementNS(svgNS, "polygon");
	setPoints(shape, pointsArray);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

function polyline(pointsArray, className, id, parent) {
	let shape = document.createElementNS(svgNS, "polyline");
	setPoints(shape, pointsArray);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

function bezier(fromX, fromY, c1X, c1Y, c2X, c2Y,
		toX, toY, className, id, parent) {
	let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y +
			" " + c2X + "," + c2Y + " " + toX + "," + toY;
	let shape = document.createElementNS(svgNS, "path");
	shape.setAttributeNS(null, "d", d);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

// export function curve(fromX, fromY, midX, midY, toX, toY, className, id)

/**
 * container types
 */

function group(className, id, parent) {
	let g = document.createElementNS(svgNS, "g");
	setClassIdParent(g, className, id, parent);
	return g;
}

function svg(className, id, parent) {
	let svg = document.createElementNS(svgNS, "svg");
	// svg.setAttributeNS(null, "viewBox", "0 0 1 1");
	setClassIdParent(svg, className, id, parent);
	return svg;
}

function setClassIdParent(element, className, id, parent) {
	if (className != null) {
		element.setAttributeNS(null, "class", className);
	}
	if (id != null) {
		element.setAttributeNS(null, "id", id);
	}
	if (parent != null) {
		parent.appendChild(element);
	}
}

/**
 * geometry modifiers
 */

function setPoints(polygon, pointsArray){
	if (pointsArray == null || pointsArray.constructor !== Array) {
		return;
	}
	let pointsString = pointsArray.map((el) => (
		el.constructor === Array ? el : [el.x, el.y]
	)).reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	polygon.setAttributeNS(null, "points", pointsString);
}

/**
 * element modifiers
 */

function addClass(xmlNode, newClass) {
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
}

function removeClass(xmlNode, newClass) {
	if (xmlNode == undefined) {
		return;
	}
	let currentClass = xmlNode.getAttribute("class");
	if (currentClass == undefined) {
		currentClass = "";
	}
	let classes = currentClass.split(" ").filter((c) => c !== newClass);
	xmlNode.setAttributeNS(null, "class", classes.join(" "));
}

function setId(xmlNode, newID) {
	if (xmlNode == undefined) {
		return;
	}
	xmlNode.setAttributeNS(null, "id", newID);
}

function setAttribute(xmlNode, attribute, value) {
	if (xmlNode == undefined) {
		return;
	}
	xmlNode.setAttributeNS(null, attribute, value);
}

function removeChildren(group) {
	while (group.lastChild) {
		group.removeChild(group.lastChild);
	}
}

/**
 * math, view
 */

function setViewBox(svg, x, y, width, height, padding = 0) {
// let d = (bounds.size.width / _zoom) - bounds.size.width;
	let scale = 1.0;
	let d = (width / scale) - width;
	let X = (x - d) - padding;
	let Y = (y - d) - padding;
	let W = (width + d * 2) + padding * 2;
	let H = (height + d * 2) + padding * 2;
	let viewBoxString = [X, Y, W, H].join(" ");
	svg.setAttributeNS(null, "viewBox", viewBoxString);
}

function setDefaultViewBox(svg){
	let rect = svg.getBoundingClientRect();
	let width = rect.width == 0 ? 640 : rect.width;
	let height = rect.height == 0 ? 480 : rect.height;
	setViewBox(svg, 0, 0, width, height);
}

function getViewBox(svg){
	let vb = svg.getAttribute("viewBox");
	return vb == null
		? undefined
		: vb.split(" ").map(n => parseFloat(n));
}

function scale(svg, scale, origin_x = 0, origin_y = 0){
	if(scale < 1e-8){ scale = 0.01; }
	let matrix = svg.createSVGMatrix()
		.translate(origin_x, origin_y)
		.scale(1/scale)
		.translate(-origin_x, -origin_y);
	let viewBox = getViewBox(svg);
	if (viewBox == null){
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
}

function translate(svg, dx, dy){
	let viewBox = getViewBox(svg);
	if (viewBox == null){
		setDefaultViewBox(svg);
	}
	viewBox[0] += dx;
	viewBox[1] += dy;
	svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
}

function convertToViewBox(svg, x, y) {
	let pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	let svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	var array = [svgPoint.x, svgPoint.y];
	array.x = svgPoint.x;
	array.y = svgPoint.y;
	return array;
}

function download(svg, filename = "image.svg"){
	var a = document.createElement('a');
	var source = (new window.XMLSerializer()).serializeToString(svg);
	let formatted = vkbeautify$1.xml(source);
	var blob = new Blob([formatted], {type: 'text/plain'});
	a.setAttribute('href', window.URL.createObjectURL(blob));
	a.setAttribute('download', filename);
	a.click();	
}

const parserErrorNS = (new window.DOMParser())
	.parseFromString('INVALID', 'text/xml')
	.getElementsByTagName("parsererror")[0]
	.namespaceURI;

function parseCSSText(styleContent) {
	var styleElement = document.createElement("style");
	styleElement.textContent = styleContent;
	document.body.appendChild(styleElement);
	var rules = styleElement.sheet.cssRules;
	document.body.removeChild(styleElement);
	return rules;
}

// the SVG is returned, or given as the argument in the callback(svg, error)
function load(input, callback){
	// try cascading attempts at different possible param types
	// "input" is a (1) raw text encoding of the svg (2) filename (3) already parsed DOM element
	if (typeof input === "string" || input instanceof String){
		// (1) raw text encoding
		var xml = (new window.DOMParser()).parseFromString(input, 'text/xml');
		if(xml.getElementsByTagNameNS(parserErrorNS, 'parsererror').length === 0) {
			if(callback != null){
				callback(xml);
			}
			return xml;
		}
		// (2) filename
		fetch(input)
			.then(response => response.text())
			.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
			.then(svgData => {
				var cssStyle, styleTag = svgData.getElementsByTagName('style')[0];
				if(styleTag != null
					&& styleTag.childNodes != null
					&& styleTag.childNodes.length > 0) {
					cssStyle = parseCSSText( styleTag.childNodes[0].nodeValue );
				}
				var allSVGs = svgData.getElementsByTagName('svg');
				if(allSVGs == null || allSVGs.length == 0) {
					throw "error, the svg parser found valid XML but couldn't find an SVG element";
				}
				let svg = allSVGs[0];
				if(callback != null) {
					callback(svg);
				}
				return svg;
			}).catch(err => callback(null, err));
	} else if (input instanceof Document){
		// (3) already parsed SVG... why would this happen? IDK. just return it
		callback(input);
		return input;
	}
}

/** svg file viewer
 * converts .fold file into SVG, binds it to the DOM
 * @param: (constructor) a DOM object or "string" DOM id
 *  and this will bind the SVG to it.
 */

function View(){
	// get constructor parameters
	let params = Array.from(arguments);

	// create a new SVG
	let _svg = svg();

	let _parent = undefined;  // parent node

	// view properties
	let _scale = 1.0;
	let _padding = 0;

	let _matrix = _svg.createSVGMatrix();

	let _mouse = {
		isPressed: false,// is the mouse button pressed (y/n)
		position: [0,0], // the current position of the mouse
		pressed: [0,0],  // the last location the mouse was pressed
		drag: [0,0],     // vector, displacement from start to now
		prev: [0,0],     // on mouseMoved, this was the previous location
		x: 0,      // redundant data --
		y: 0       // -- these are the same as position
	};

	// exported
	const zoom = function(scale$$1, origin_x = 0, origin_y = 0){
		_scale = scale$$1;
		scale(_svg, scale$$1, origin_x, origin_y);
	};
	const translate$$1 = function(dx, dy){
		translate(_svg, dx, dy);
	};
	const setViewBox$$1 = function(x, y, width, height){
		setViewBox(_svg, x, y, width, height, _padding);
	};
	const getViewBox$$1 = function() {
		return getViewBox(_svg);
	};
	const appendChild = function(element){
		_svg.appendChild(element);
	};
	const download$$1 = function(filename = "image.svg"){
		return download(_svg, filename);
	};
	const load$$1 = function(data, callback){
		load(data, function(newSVG, error){
			if(newSVG != null){
				// todo: do we need to remove any existing handlers to properly free memory?
				_parent.removeChild(_svg);
				_svg = newSVG;
				_parent.appendChild(_svg);
				// re-attach any preexisting handlers
				updateHandlers();
			}
			if(callback != null){ callback(newSVG, error); }
		});
	};

	// not exported
	const getWidth = function(){
		let w = _svg.getAttributeNS(null, "width");
		return w != null ? w : _svg.getBoundingClientRect().width;
	};
	const getHeight = function(){
		let h = _svg.getAttributeNS(null, "height");
		return h != null ? h : _svg.getBoundingClientRect().height;
	};

	// after page load, find a parent element for the new SVG in the arguments
	const attachToDOM = function(){
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
		if(numbers.length >= 2){
			_svg.setAttributeNS(null, "width", numbers[0]);
			_svg.setAttributeNS(null, "height", numbers[1]);
			setViewBox(_svg, 0, 0, numbers[0], numbers[1]);
		} 
		else if(_svg.getAttribute("viewBox") == null){
			// set a viewBox if viewBox doesn't yet exist
			let rect$$1 = _svg.getBoundingClientRect();
			setViewBox(_svg, 0, 0, rect$$1.width, rect$$1.height);
		}
		if(functions.length >= 1){
			functions[0]();
		}
	};
	if(document.readyState === 'loading') {
		// wait until after the <body> has rendered
		document.addEventListener('DOMContentLoaded', attachToDOM);
	} else {
		attachToDOM();
	}

	let _onmousemove, _onmousedown, _onmouseup, _onmouseleave, _onmouseenter;

	// clientX and clientY are from the browser event data
	function updateMousePosition(clientX, clientY){
		_mouse.prev = _mouse.position;
		_mouse.position = convertToViewBox(_svg, clientX, clientY);
		_mouse.x = _mouse.position[0];
		_mouse.y = _mouse.position[1];
	}

	function updateHandlers(){
		_svg.onmousemove = function(event){
			updateMousePosition(event.clientX, event.clientY);
			if(_mouse.isPressed){
				_mouse.drag = [_mouse.position[0] - _mouse.pressed[0], 
				               _mouse.position[1] - _mouse.pressed[1]];
				_mouse.drag.x = _mouse.drag[0];
				_mouse.drag.y = _mouse.drag[1];
			}
			if(_onmousemove != null){ _onmousemove( Object.assign({}, _mouse) ); }
		};
		_svg.onmousedown = function(event){
			_mouse.isPressed = true;
			_mouse.pressed = convertToViewBox(_svg, event.clientX, event.clientY);
			if(_onmousedown != null){ _onmousedown( Object.assign({}, _mouse) ); }
		};
		_svg.onmouseup = function(event){
			_mouse.isPressed = false;
			if(_onmouseup != null){ _onmouseup( Object.assign({}, _mouse) ); }
		};
		_svg.onmouseleave = function(event){
			updateMousePosition(event.clientX, event.clientY);
			if(_onmouseleave != null){ _onmouseleave( Object.assign({}, _mouse) ); }
		};
		_svg.onmouseenter = function(event){
			updateMousePosition(event.clientX, event.clientY);
			if(_onmouseenter != null){ _onmouseenter( Object.assign({}, _mouse) ); }
		};
	}

	// return Object.freeze({
	return {
		zoom, translate: translate$$1, appendChild,
		load: load$$1, download: download$$1,
		setViewBox: setViewBox$$1, getViewBox: getViewBox$$1,
		get scale() { return _scale; },
		get svg() { return _svg; },
		get width() { return getWidth(); },
		get height() { return getHeight(); },
		set onMouseMove(handler) {
			_onmousemove = handler;
			updateHandlers();
		},
		set onMouseDown(handler) {
			_onmousedown = handler;
			updateHandlers();
		},
		set onMouseUp(handler) {
			_onmouseup = handler;
			updateHandlers();
		},
		set onMouseLeave(handler) {
			_onmouseleave = handler;
			updateHandlers();
		},
		set onMouseEnter(handler) {
			_onmouseenter = handler;
			updateHandlers();
		}
		// set onMouseDidBeginDrag(handler) {}
		// set animate(handler) {}
		// set onResize(handler) {}
	};
	// });

	// animateTimer = setInterval(function(){
	// 	if(typeof that.event.animate === "function"){
	// 		that.event.animate({"time":svg.getCurrentTime(), "frame":frameNum});
	// 	}
	// 	frameNum += 1;
	// }, 1000/60);


}

export { View, line, circle, rect, polygon, polyline, bezier, group, svg, setPoints, addClass, removeClass, setId, setAttribute, removeChildren, setViewBox, setDefaultViewBox, getViewBox, scale, translate, convertToViewBox, download, load };
