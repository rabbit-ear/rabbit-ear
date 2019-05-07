import * as Geometry from "../../include/geometry";
import * as Args from "../convert/arguments";

export const axiom = function(number, parameters) {
	let params = Array(...arguments)
	params.shift();
	switch(number) {
		case 1: return axiom1(...params);
		case 2: return axiom2(...params);
		case 3: return axiom3(...params);
		case 4: return axiom4(...params);
		case 5: return axiom5(...params);
		case 6: return axiom6(...params);
		case 7: return axiom7(...params);
		case 0: return paramTest(...params);
	}
};

const paramTest = function(a, b, c, d) {
	console.log("arguments", arguments);
	console.log("...arguments", ...arguments);
	console.log("a", a);
	console.log("b", b);
	console.log("c", c);
	console.log("d", d);
}

// export const axiom = function(number, params) {
// 	let args;
// 	switch(number) {
// 		case 1: args = Args.get_two_vec2(params); break;
// 		case 2: args = Args.get_two_vec2(params); break;
// 		case 3: args = Args.get_two_lines(params); break;
// 		case 4: args = Args.get_two_lines(params); break;
// 		case 5: args = Args.get_two_lines(params); break;
// 		case 6: args = Args.get_two_lines(params); break;
// 		case 7: args = Args.get_two_lines(params); break;
// 	}
// 	// if (args === undefined) {
// 	// 	throw "axiom " + number + " was not provided with the correct inputs";
// 	// }
// 	let crease = Crease(_this, Origami["axiom"+number](_this, ...args));
// 	didModifyGraph();
// 	return crease;
// };
// const axiom1 = function() { return axiom.call(_this, [1, arguments]); };
// const axiom2 = function() { return axiom.call(_this, [2, arguments]); };
// const axiom3 = function() { return axiom.call(_this, [3, arguments]); };
// const axiom4 = function() { return axiom.call(_this, [4, arguments]); };
// const axiom5 = function() { return axiom.call(_this, [5, arguments]); };
// const axiom6 = function() { return axiom.call(_this, [6, arguments]); };
// const axiom7 = function() { return axiom.call(_this, [7, arguments]); };

const makeCrease = function(point, vector) {
	let crease = [point, vector];
	crease.point = point;
	crease.vector = vector;
	return crease;
}

// n-dimension
export const axiom1 = function(pointA, pointB) {
	let a, b;
	a = pointA; b = pointB;
	let p0 = Args.get_vec(pointA);
	let p1 = Args.get_vec(pointB);
	let vec = p0.map((_,i) => p1[i] - p0[i]);
	return makeCrease(p0, vec);
}

// 2-dimension
export const axiom2 = function(a, b) {
	let mid = Geometry.core.midpoint(a, b);
	let vec = Geometry.core.normalize(a.map((_,i) => b[i] - a[i]));
	return makeCrease(mid, [vec[1], -vec[0]]);
}
export const axiom3 = function(pointA, vectorA, pointB, vectorB){
	return Geometry.core.bisect_lines2(pointA, vectorA, pointB, vectorB)
		.map(line => makeCrease(line[0], line[1]));
}
export const axiom4 = function(pointA, vectorA, pointB) {
	let norm = Geometry.core.normalize(vectorA);
	let rightAngle = [norm[1], -norm[0]];
	return [[...pointB], rightAngle];
}
export const axiom5 = function(pointA, vectorA, pointB, pointC) {
	// var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
	// var intersections = new M.Circle(origin, radius).intersection(new M.Edge(line).infiniteLine());
	// var lines = [];
	// for(var i = 0; i < intersections.length; i++){ lines.push(this.axiom2(point, intersections[i])); }
	// return lines;
}
export const axiom6 = function(pointA, vectorA, pointB, vectorB, pointC, pointD) {
}
export const axiom7 = function(pointA, vectorA, pointB, vectorB, pointC) {
	// var newLine = new M.Line(point, new M.Edge(perp).vector());
	// var intersection = newLine.intersection(new M.Edge(ontoLine).infiniteLine());
	// if(intersection === undefined){ return undefined; }
	// return this.axiom2(point, intersection);
};

