/** Simple Geometry library for SVG
 *
 * there is a general rule for arguments across every function:
 * 1st comes the necessary attributes (x,y for lines),
 * Next is the class name string, followed by an ID string.
 *
 */

'use strict';

var svgNS = 'http://www.w3.org/2000/svg';

/**  Geometry Primitives  */
export var line = function(x1, y1, x2, y2, className, id){
	var line = document.createElementNS(svgNS, 'line');
	line.setAttributeNS(null, 'x1', x1);
	line.setAttributeNS(null, 'y1', y1);
	line.setAttributeNS(null, 'x2', x2);
	line.setAttributeNS(null, 'y2', y2);
	if(className != undefined){ line.setAttributeNS(null, 'class', className); }
	if(id != undefined){ line.setAttributeNS(null, 'id', id); }
	return line;
}

export var circle = function(x, y, radius, className, id){
	var dot = document.createElementNS(svgNS, 'circle');
	dot.setAttributeNS(null, 'cx', x);
	dot.setAttributeNS(null, 'cy', y);
	dot.setAttributeNS(null, 'r', radius);
	if(className != undefined){ dot.setAttributeNS(null, 'class', className); }
	if(id != undefined){ dot.setAttributeNS(null, 'id', id); }
	return dot;
}

export var polygon = function(pointArray, className, id){
	var pointsString = pointArray
		.map(function(el){ return (el.constructor === Array) ? el : [el.x, el.y]; })
		.reduce(function(prev,curr){ return prev + curr[0] + "," + curr[1] + " "}, "");
	var polygon = document.createElementNS(svgNS, 'polygon');
	polygon.setAttributeNS(null, 'points', pointsString);
	if(className != undefined){ polygon.setAttributeNS(null, 'class', className); }
	if(id != undefined){ polygon.setAttributeNS(null, 'id', id); }
	return polygon;
}

/**  Geometry Container Types  */
export var group = function(className, id){
	var group = document.createElementNS(svgNS, 'g');
	if(className != undefined){ group.setAttributeNS(null, 'class', className); }
	if(id != undefined){ group.setAttributeNS(null, 'id', id); }
	return group;
}

export var SVG = function(className, id){
	var svg = document.createElementNS(svgNS, 'svg');
	svg.setAttributeNS(null, 'viewBox', '0 0 1 1');
	if(className != undefined){ svg.setAttributeNS(null, 'class', className); }
	if(id != undefined){ svg.setAttributeNS(null, 'id', id); }
	return svg;
}

/**  Operations that modify  */
export var addClass = function(xmlNode, newClass){
	if(xmlNode == undefined){ return; }
	var currentClass = xmlNode.getAttribute('class');
	if(currentClass == undefined){ currentClass = "" }
	var classes = currentClass.split(' ').filter(function(c){ return c != newClass; },this);
	classes.push(newClass);
	xmlNode.setAttributeNS(null, 'class', classes.join(' '));
}

export var removeClass = function(xmlNode, newClass){
	if(xmlNode == undefined){ return; }
	var currentClass = xmlNode.getAttribute('class');
	if(currentClass == undefined){ currentClass = "" }
	var classes = currentClass.split(' ').filter(function(c){ return c != newClass; },this);
	xmlNode.setAttributeNS(null, 'class', classes.join(' '));
}

/**  Math toolbox  */
export var convertToViewbox = function(svg, x, y){
	var pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	var svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return { x: svgPoint.x, y: svgPoint.y };
}
