'use strict';

var svgNS = 'http://www.w3.org/2000/svg';

export default class SimpleSVG{

	line(x1, y1, x2, y2, className, id){
		var line = document.createElementNS(svgNS, 'line');
		line.setAttributeNS(svgNS, 'x1', x1);
		line.setAttributeNS(svgNS, 'y1', y1);
		line.setAttributeNS(svgNS, 'x2', x2);
		line.setAttributeNS(svgNS, 'y2', y2);
		if(className != undefined){ line.setAttributeNS(svgNS, 'class', className); }
		if(id != undefined){ line.setAttributeNS(svgNS, 'id', id); }
		return line;
	}

	circle(x, y, radius, className, id){
		var dot = document.createElementNS(svgNS, 'circle');
		dot.setAttributeNS(svgNS, 'cx', x);
		dot.setAttributeNS(svgNS, 'cy', y);
		dot.setAttributeNS(svgNS, 'r', radius);
		if(className != undefined){ dot.setAttributeNS(svgNS, 'class', className); }
		if(id != undefined){ dot.setAttributeNS(svgNS, 'id', id); }
		return dot;
	}

	polygon(pointArray, className, id){
		var pointsString = pointArray
			.map(function(el){ return (el.constructor === Array) ? el : [el.x, el.y]; })
			.reduce(function(prev,curr){ return prev + curr[0] + "," + curr[1] + " "}, "");
		var polygon = document.createElementNS(svgNS, 'polygon');
		polygon.setAttributeNS(svgNS, 'points', pointsString);
		if(className != undefined){ polygon.setAttributeNS(svgNS, 'class', className); }
		if(id != undefined){ polygon.setAttributeNS(svgNS, 'id', id); }
		return polygon;
	}

	group(className, id){
		var group = document.createElementNS(svgNS, 'g');
		if(className != undefined){ group.setAttributeNS(svgNS, 'class', className); }
		if(id != undefined){ group.setAttributeNS(svgNS, 'id', id); }
		return group;
	}

	SVG(className, id){
		var svg = document.createElementNS(svgNS, 'svg');
		svg.setAttribute("viewBox", "0 0 1 1");
		if(className != undefined){ svg.setAttributeNS(svgNS, 'class', className); }
		if(id != undefined){ svg.setAttributeNS(svgNS, 'id', id); }
		return svg;
	}

	addClass(xmlNode, newClass){
		if(xmlNode == undefined){ return; }
		var currentClass = xmlNode.getAttribute('class');
		if(currentClass == undefined){ currentClass = "" }
		var classes = currentClass.split(' ').filter(function(c){ return c != newClass; },this);
		classes.push(newClass);
		xmlNode.setAttribute('class', classes.join(' '));
	}

	removeClass(xmlNode, newClass){
		if(xmlNode == undefined){ return; }
		var currentClass = xmlNode.getAttribute('class');
		if(currentClass == undefined){ currentClass = "" }
		var classes = currentClass.split(' ').filter(function(c){ return c != newClass; },this);
		xmlNode.setAttribute('class', classes.join(' '));
	}

	convertToViewbox(svg, x, y){
		var pt = svg.createSVGPoint();
		pt.x = x;
		pt.y = y;
		var svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
		return { x: svgPoint.x, y: svgPoint.y };
	}

}