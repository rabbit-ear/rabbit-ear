import CreasePattern from './compiled/src/CreasePattern.js'

'use strict';

/** 
 *  1 INPUT: an XML element tree, or a string that can be parsed into one
 */
export default function(_){
	// get the data
	var args = []; for(var i = 0; i < arguments.length; i++){ args.push(arguments[i]); }
	var rootElement = args.filter(function(arg){ return arg instanceof HTMLElement || arg instanceof Document },this).shift();
	if(rootElement == undefined){
		var string = args.filter(function(a){ return typeof a === 'string' || a instanceof String;},this).shift();
		if(string != undefined){
			rootElement = (new window.DOMParser()).parseFromString(string, "text/xml");
		}
	}
	if (rootElement == undefined){ throw "error, the svg parser was given some unrecognizable data."; }

	// console.log(rootElement.childNodes);
	// get CSS style header if it exists
	var cssStyle, styleTag = rootElement.getElementsByTagName('style')[0];
	if(styleTag != undefined && styleTag.childNodes != undefined && styleTag.childNodes.length > 0){
		cssStyle = parseCSSText( styleTag.childNodes[0].nodeValue );
	}
	var svg = rootElement.getElementsByTagName('svg')[0];
	// console.log(svg.SVGStyleElement);
	// console.log(svg.nodeValue);

	var properties = ['x', 'y', 'width', 'height'];
	var values = properties.map(function(prop){
			return svg.attributes[prop] == undefined ? "" : svg.attributes[prop].nodeValue;
		},this)
		.map(function(string){ return parseFloat(string); },this);
	var viewBoxString = svg.attributes['viewBox'] == undefined ? "" :  svg.attributes['viewBox'].nodeValue;
	var viewBoxValues = viewBoxString.split(' ').map(function(el){ return parseFloat(el); },this);
	var bounds = {'origin':{'x':values[0], 'y':values[1]}, 'size':{'width':values[2], 'height':values[3]} };
	if(isNaN(bounds.size.width)){ bounds.size.width = viewBoxValues[2]; }
	if(isNaN(bounds.size.height)){ bounds.size.height = viewBoxValues[3]; }

	var creases = { 'mountain':[], 'valley':[], 'mark':[] };
	depthFirstGetLines(svg.children, creases, cssStyle);

	var cp = new CreasePattern();
	// erase boundary, to be set later by convex hull
	cp.nodes = [];
	cp.edges = [];
	creases.mark.forEach(function(p){ cp.newCrease(p[0], p[1], p[2], p[3]).mark(); },this);
	creases.valley.forEach(function(p){ cp.newCrease(p[0], p[1], p[2], p[3]).valley(); },this);
	creases.mountain.forEach(function(p){ cp.newCrease(p[0], p[1], p[2], p[3]).mountain(); },this);

	// is there a better way to do this?
	cp.edges.forEach(function(edge){
		if( cp.boundary.edges
			.filter(function(b){ return b.parallel(edge); },this)
			.filter(function(b){ return b.collinear(edge.nodes[0]); },this)
			.length > 0){ edge.boundary(); }
	},this);

	// re-sizing down to 1 x aspect size
	cp.scaleToUnitHeight();
	// find the convex hull of the CP, set it to the boundary
	var points = cp.nodes.map(function(p){ return {x:p.x, y:p.y}; },this);
	cp.boundary.convexHull(points);
	cp.clean();
	return cp;
}

function parseCSSText(styleContent) {
	var styleElement = document.createElement("style");
	styleElement.textContent = styleContent;
	document.body.appendChild(styleElement);
	var rules = styleElement.sheet.cssRules;
	document.body.removeChild(styleElement);
	return rules;
}

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

function detectCrease(node, cssStyle){
	var strokeText = undefined;
	if(node.attributes.stroke != undefined){
		strokeText = node.attributes.stroke.nodeValue;
	}
	else if (node.attributes.class != undefined && cssStyle != undefined){
		var found = undefined;
		for(var i = 0; i < cssStyle.length; i++){
			if(cssStyle[i].selectorText == '.' + node.attributes.class.nodeValue){ found = cssStyle[i].style; }
		}
		if(found != undefined){ strokeText = found.stroke; }
	}
	// if color is found, detect best match for crease type
	if(strokeText != undefined){
		var colors = parseColor(strokeText);
		// todo add:
		// cut lines are green
		// facet creases are yellow
		// undriven creases are magenta
		if(Math.abs(colors[2]-colors[1]) < 10 && Math.abs(colors[1] - colors[0]) < 10 ){ return 'mark'; }
		else if(colors[0] > colors[2]){ return 'mountain'; }
		else if(colors[2] > colors[0]){ return 'valley'; }
	}
	return 'mark';
}


function depthFirstGetLines(children, creases, cssStyle){
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
				creases[detectCrease(node, cssStyle)].push( [vals[0], vals[1], vals[2], vals[3]] );
				break;
			case 'rect':
				var x = parseFloat(node.attributes.x.nodeValue);
				var y = parseFloat(node.attributes.y.nodeValue);
				var width = parseFloat(node.attributes.width.nodeValue);
				var height = parseFloat(node.attributes.height.nodeValue);
				var rectArray = [ [x, y], [x+width, y], [x+width, y+height], [x, y+height] ];
				var creaseType = detectCrease(node, cssStyle);
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
				var creaseType = detectCrease(node, cssStyle);
				pathPoints.forEach(function(point, i){
					if(i == pathPoints.length-1 && !closed){ return; }
					var nextPoint = pathPoints[ (i+1)%pathPoints.length ];
					creases[creaseType].push( [point.x, point.y, nextPoint.x, nextPoint.y] );
				},this);
				break;
			case 'circle':
				var C_RESOLUTION = 64;
				var x = parseFloat(node.attributes.cx.nodeValue);
				var y = parseFloat(node.attributes.cy.nodeValue);
				var r = parseFloat(node.attributes.r.nodeValue);
				var circlePts = [];
				var creaseType = detectCrease(node, cssStyle);
				for(var i = 0; i < C_RESOLUTION; i++){
					circlePts.push([ x + r*Math.cos(i*2*Math.PI/C_RESOLUTION), y + r*Math.sin(i*2*Math.PI/C_RESOLUTION) ]);
				}
				circlePts.forEach(function(point, i){
					var nextPoint = circlePts[ (i+1)%circlePts.length ];
					creases[creaseType].push( [point[0], point[1], nextPoint[0], nextPoint[1]] );
				},this);
				break;
			case 'polygon':
			case 'polyline':
				var closed = (node.nodeName == 'polygon') ? true : false;
				var points = node.attributes.points.nodeValue
					.split(' ')
					.filter(function(el){ return el != ""; },this)
					.map(function(el){ return el.split(',').map(function(coord){ return parseFloat(coord); },this) },this);
				var creaseType = detectCrease(node, cssStyle);
				points.forEach(function(point, i){
						if(i == points.length-1 && !closed ){ return; }
						var nextPoint = points[ (i+1)%points.length ];
						creases[creaseType].push( [point[0], point[1], nextPoint[0], nextPoint[1]] );
					},this);
				break;
			default:
				if (node.childNodes !== undefined && node.childNodes.length > 0){
					depthFirstGetLines(node.childNodes, creases, cssStyle);
				}
			break;
		}
	},this);
}



var colorlist = {
	'aliceblue':'rgb(240,248,255)','antiquewhite':'rgb(250,235,215)','aqua':'rgb(0,255,255)','aquamarine':'rgb(127,255,212)','azure':'rgb(240,255,255)','beige':'rgb(245,245,220)','bisque':'rgb(255,228,196)','black':'rgb(0,0,0)','blanchedalmond':'rgb(255,235,205)','blue':'rgb(0,0,255)','blueviolet':'rgb(138,43,226)','brown':'rgb(165,42,42)','burlywood':'rgb(222,184,135)','cadetblue':'rgb(95,158,160)','chartreuse':'rgb(127,255,0)','chocolate':'rgb(210,105,30)','coral':'rgb(255,127,80)','lightpink' :'rgb(255,182,193)','lightsalmon' :'rgb(255,160,122)','lightseagreen' :'rgb(32,178,170)','lightskyblue' :'rgb(135,206,250)','lightslategray' :'rgb(119,136,153)','lightslategrey' :'rgb(119,136,153)','lightsteelblue' :'rgb(176,196,222)','lightyellow' :'rgb(255,255,224)','lime' :'rgb(0,255,0)','limegreen' :'rgb(50,205,50)','linen' :'rgb(250,240,230)','magenta' :'rgb(255,0,255)','maroon' :'rgb(128,0,0)','mediumaquamarine' :'rgb(102,205,170)','mediumblue' :'rgb(0,0,205)','mediumorchid' :'rgb(186,85,211)','cornflowerblue':'rgb(100,149,237)','cornsilk':'rgb(255,248,220)','crimson':'rgb(220,20,60)','cyan':'rgb(0,255,255)','darkblue':'rgb(0,0,139)','darkcyan':'rgb(0,139,139)','darkgoldenrod':'rgb(184,134,11)','darkgray':'rgb(169,169,169)','darkgreen':'rgb(0,100,0)','darkgrey':'rgb(169,169,169)','darkkhaki':'rgb(189,183,107)','darkmagenta':'rgb(139,0,139)','darkolivegreen':'rgb(85,107,47)','darkorange':'rgb(255,140,0)','darkorchid':'rgb(153,50,204)','darkred':'rgb(139,0,0)','darksalmon':'rgb(233,150,122)','darkseagreen':'rgb(143,188,143)','darkslateblue':'rgb(72,61,139)','darkslategray':'rgb(47,79,79)','darkslategrey':'rgb(47,79,79)','darkturquoise':'rgb(0,206,209)','darkviolet':'rgb(148,0,211)','deeppink':'rgb(255,20,147)','deepskyblue':'rgb(0,191,255)','dimgray':'rgb(105,105,105)','dimgrey':'rgb(105,105,105)','dodgerblue':'rgb(30,144,255)','firebrick':'rgb(178,34,34)','floralwhite':'rgb(255,250,240)','forestgreen':'rgb(34,139,34)','fuchsia':'rgb(255,0,255)','gainsboro':'rgb(220,220,220)','ghostwhite':'rgb(248,248,255)','gold':'rgb(255,215,0)','goldenrod':'rgb(218,165,32)','gray':'rgb(128,128,128)','grey':'rgb(128,128,128)','green':'rgb(0,128,0)','greenyellow':'rgb(173,255,47)','honeydew':'rgb(240,255,240)','hotpink':'rgb(255,105,180)','indianred':'rgb(205,92,92)','indigo':'rgb(75,0,130)','ivory':'rgb(255,255,240)','khaki':'rgb(240,230,140)','lavender':'rgb(230,230,250)','lavenderblush':'rgb(255,240,245)','mediumpurple':'rgb(147,112,219)','mediumseagreen':'rgb(60,179,113)','mediumslateblue':'rgb(123,104,238)','mediumspringgreen':'rgb(0,250,154)','mediumturquoise':'rgb(72,209,204)','mediumvioletred':'rgb(199,21,133)','midnightblue':'rgb(25,25,112)','mintcream':'rgb(245,255,250)','mistyrose':'rgb(255,228,225)','moccasin':'rgb(255,228,181)','navajowhite':'rgb(255,222,173)','navy':'rgb(0,0,128)','oldlace':'rgb(253,245,230)','olive':'rgb(128,128,0)','olivedrab':'rgb(107,142,35)','orange':'rgb(255,165,0)','orangered':'rgb(255,69,0)','orchid':'rgb(218,112,214)','palegoldenrod':'rgb(238,232,170)','palegreen':'rgb(152,251,152)','paleturquoise':'rgb(175,238,238)','palevioletred':'rgb(219,112,147)','papayawhip':'rgb(255,239,213)','peachpuff':'rgb(255,218,185)','peru':'rgb(205,133,63)','pink':'rgb(255,192,203)','plum':'rgb(221,160,221)','powderblue':'rgb(176,224,230)','purple':'rgb(128,0,128)','red':'rgb(255,0,0)','rosybrown':'rgb(188,143,143)','royalblue':'rgb(65,105,225)','saddlebrown':'rgb(139,69,19)','salmon':'rgb(250,128,114)','sandybrown':'rgb(244,164,96)','seagreen':'rgb(46,139,87)','seashell':'rgb(255,245,238)','sienna':'rgb(160,82,45)','silver':'rgb(192,192,192)','skyblue':'rgb(135,206,235)','slateblue':'rgb(106,90,205)','slategray':'rgb(112,128,144)','slategrey':'rgb(112,128,144)','snow':'rgb(255,250,250)','springgreen':'rgb(0,255,127)','steelblue':'rgb(70,130,180)','tan':'rgb(210,180,140)','teal':'rgb(0,128,128)','lawngreen':'rgb(124,252,0)','lemonchiffon':'rgb(255,250,205)','lightblue':'rgb(173,216,230)','lightcoral':'rgb(240,128,128)','lightcyan':'rgb(224,255,255)','lightgoldenrodyellow':'rgb(250,250,210)','lightgray':'rgb(211,211,211)','lightgreen':'rgb(144,238,144)','lightgrey':'rgb(211,211,211)','thistle':'rgb(216,191,216)','tomato':'rgb(255,99,71)','turquoise':'rgb(64,224,208)','violet':'rgb(238,130,238)','wheat':'rgb(245,222,179)','white':'rgb(255,255,255)','whitesmoke':'rgb(245,245,245)','yellow':'rgb(255,255,0)','yellowgreen':'rgb(154,205,50)'
};