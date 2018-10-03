/** Simple Geometry library for SVG
 *
 * arguments follows a general rule:
 * 1st comes the necessary attributes for geometry (x,y for lines),
 * next is the class name string, 
 * and the last is always the ID string
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

// export var curve = function(fromX, fromY, midX, midY, toX, toY, className, id){

// }

export var bezier = function(fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY, className, id){
	var d = 'M ' + fromX + ',' + fromY + ' C ' + c1X + ',' + c1Y + ' '  + c2X + ',' + c2Y + ' ' + toX + ',' + toY;
	var path = document.createElementNS(svgNS,"path");
	path.setAttributeNS(null, 'd', d);
	if(className != undefined){ path.setAttributeNS(null, 'class', className); }
	if(id != undefined){ path.setAttributeNS(null, 'id', id); }
	return path;
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

export var setID = function(xmlNode, newID){
	if(xmlNode == undefined){ return; }
	xmlNode.setAttributeNS(null, 'id', newID);
}

/**  Math toolbox  */
export var convertToViewbox = function(svg, x, y){
	var pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	var svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return { x: svgPoint.x, y: svgPoint.y };
}
