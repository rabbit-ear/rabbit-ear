/** Simple Geometry library for SVG
 *
 * argument order follows a general rule:
 * 1: the necessary parameters for this geometry. length of arguments varies
 * 2,3: className, followed by ID
 * last: the parent container to append this new element (or none)
 *
 * return: the new geometry XML object.
 */


const svgNS = "http://www.w3.org/2000/svg";

/**  Geometry Primitives  */
function line(x1, y1, x2, y2, className, id, parent) {
	let shape = document.createElementNS(svgNS, "line");
	shape.setAttributeNS(null, "x1", x1);
	shape.setAttributeNS(null, "y1", y1);
	shape.setAttributeNS(null, "x2", x2);
	shape.setAttributeNS(null, "y2", y2);
	if (className != null) {
		shape.setAttributeNS(null, "class", className);
	}
	if (id != null) {
		shape.setAttributeNS(null, "id", id);
	}
	if (parent != null) {
		parent.appendChild(shape);
	}
	return shape;
}

function circle(x, y, radius, className, id, parent) {
	let shape = document.createElementNS(svgNS, "circle");
	shape.setAttributeNS(null, "cx", x);
	shape.setAttributeNS(null, "cy", y);
	shape.setAttributeNS(null, "r", radius);
	if (className != null) {
		shape.setAttributeNS(null, "class", className);
	}
	if (id != null) {
		shape.setAttributeNS(null, "id", id);
	}
	if (parent != null) {
		parent.appendChild(shape);
	}
	return shape;
}

function polygon(pointArray, className, id, parent) {
	let pointsString = pointArray.map((el) => (
		el.constructor === Array ? el : [el.x, el.y]
	)).reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	let shape = document.createElementNS(svgNS, "polygon");
	shape.setAttributeNS(null, "points", pointsString);
	if (className != null) {
		shape.setAttributeNS(null, "class", className);
	}
	if (id != null) {
		shape.setAttributeNS(null, "id", id);
	}
	if (parent != null) {
		parent.appendChild(shape);
	}
	return shape;
}

function bezier(fromX, fromY, c1X, c1Y, c2X, c2Y,
		toX, toY, className, id, parent) {
	let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y +
			" " + c2X + "," + c2Y + " " + toX + "," + toY;
	let shape = document.createElementNS(svgNS, "path");
	shape.setAttributeNS(null, "d", d);
	if (className != null) {
		shape.setAttributeNS(null, "class", className);
	}
	if (id != null) {
		shape.setAttributeNS(null, "id", id);
	}
	if (parent != null) {
		parent.appendChild(shape);
	}
	return shape;
}
// function curve(fromX, fromY, midX, midY, toX, toY, className, id)

/**  Container Types  */
function group(className, id, parent) {
	let g = document.createElementNS(svgNS, "g");
	if (className != null) {
		g.setAttributeNS(null, "class", className);
	}
	if (id != null) {
		g.setAttributeNS(null, "id", id);
	}
	if (parent != null) {
		parent.appendChild(g);
	}
	return g;
}

function SVG(className, id, parent) {
	let svg = document.createElementNS(svgNS, "svg");
	svg.setAttributeNS(null, "viewBox", "0 0 1 1");
	if (className != null) {
		svg.setAttributeNS(null, "class", className);
	}
	if (id != null) {
		svg.setAttributeNS(null, "id", id);
	}
	if (parent != null) {
		parent.appendChild(svg);
	}
	return svg;
}

/**  Operations that modify  */
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

function removeChildren(group) {
	while (group.lastChild) {
		group.removeChild(group.lastChild);
	}
}

/**  Math  */
function convertToViewbox(svg, x, y) {
	let pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	let svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return {
		x: svgPoint.x,
		y: svgPoint.y
	};
}

export default {
	line, circle, polygon, bezier,
	group, SVG,
	addClass, removeClass, setId, removeChildren, convertToViewbox
}
