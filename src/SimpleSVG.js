/** Simple Geometry library for SVG
 *
 * arguments follows a general rule:
 * 1st comes the necessary attributes for geometry (x,y for lines)
 * second is the class name string,
 * and the last is always the ID string
 *
 */
/*jslint browser:true */

const svgNS = "http://www.w3.org/2000/svg";

/**  Geometry Primitives  */
export function line(x1, y1, x2, y2, className, id) {
    let ln = document.createElementNS(svgNS, "line");
    ln.setAttributeNS(null, "x1", x1);
    ln.setAttributeNS(null, "y1", y1);
    ln.setAttributeNS(null, "x2", x2);
    ln.setAttributeNS(null, "y2", y2);
    if (className !== undefined) {
        ln.setAttributeNS(null, "class", className);
    }
    if (id !== undefined) {
        ln.setAttributeNS(null, "id", id);
    }
    return ln;
}

export function circle(x, y, radius, className, id) {
    let dot = document.createElementNS(svgNS, "circle");
    dot.setAttributeNS(null, "cx", x);
    dot.setAttributeNS(null, "cy", y);
    dot.setAttributeNS(null, "r", radius);
    if (className !== undefined) {
        dot.setAttributeNS(null, "class", className);
    }
    if (id !== undefined) {
        dot.setAttributeNS(null, "id", id);
    }
    return dot;
}

export function polygon(pointArray, className, id) {
    let pointsString = pointArray.map((el) => (
        el.constructor === Array
        ? el
        : [el.x, el.y]
    )).reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
    let poly = document.createElementNS(svgNS, "polygon");
    poly.setAttributeNS(null, "points", pointsString);
    if (className !== undefined) {
        poly.setAttributeNS(null, "class", className);
    }
    if (id !== undefined) {
        poly.setAttributeNS(null, "id", id);
    }
    return poly;
}

// export function curve(fromX, fromY, midX, midY, toX, toY, className, id) {

// }

export function bezier(fromX, fromY, c1X, c1Y, c2X, c2Y,
        toX, toY, className, id) {
    let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y +
            " " + c2X + "," + c2Y + " " + toX + "," + toY;
    let path = document.createElementNS(svgNS, "path");
    path.setAttributeNS(null, "d", d);
    if (className !== undefined) {
        path.setAttributeNS(null, "class", className);
    }
    if (id !== undefined) {
        path.setAttributeNS(null, "id", id);
    }
    return path;
}

/**  Geometry Container Types  */
export function group(className, id) {
    let g = document.createElementNS(svgNS, "g");
    if (className !== undefined) {
        g.setAttributeNS(null, "class", className);
    }
    if (id !== undefined) {
        g.setAttributeNS(null, "id", id);
    }
    return g;
}

export function SVG(className, id) {
    let svg = document.createElementNS(svgNS, "svg");
    svg.setAttributeNS(null, "viewBox", "0 0 1 1");
    if (className !== undefined) {
        svg.setAttributeNS(null, "class", className);
    }
    if (id !== undefined) {
        svg.setAttributeNS(null, "id", id);
    }
    return svg;
}

/**  Operations that modify  */
export function addClass(xmlNode, newClass) {
    if (xmlNode === undefined) {
        return;
    }
    let currentClass = xmlNode.getAttribute("class");
    if (currentClass === undefined) {
        currentClass = "";
    }
    let classes = currentClass.split(" ").filter((c) => c !== newClass);
    classes.push(newClass);
    xmlNode.setAttributeNS(null, "class", classes.join(" "));
}

export function removeClass(xmlNode, newClass) {
    if (xmlNode === undefined) {
        return;
    }
    let currentClass = xmlNode.getAttribute("class");
    if (currentClass === undefined) {
        currentClass = "";
    }
    let classes = currentClass.split(" ").filter((c) => c !== newClass);
    xmlNode.setAttributeNS(null, "class", classes.join(" "));
}

export function setID(xmlNode, newID) {
    if (xmlNode === undefined) {
        return;
    }
    xmlNode.setAttributeNS(null, "id", newID);
}

/**  Math toolbox  */
export function convertToViewbox(svg, x, y) {
    let pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    let svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    return {
        x: svgPoint.x,
        y: svgPoint.y
    };
}
