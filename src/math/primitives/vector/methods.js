/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";
import { epsilonEqualVectors } from "../../general/function.js";
import { counterClockwiseBisect2 } from "../../geometry/radial.js";

import {
	getVector,
	getMatrix3x4,
} from "../../general/get.js";

import {
	magnitude,
	normalize,
	scale,
	add,
	subtract,
	lerp,
	midpoint,
	dot,
	cross3,
	distance,
	flip,
	rotate90,
	rotate270,
	parallel,
	resize,
	resizeUp,
} from "../../algebra/vector.js";

import {
	makeMatrix2Rotate,
} from "../../algebra/matrix2.js";

import {
	multiplyMatrix3Vector3,
} from "../../algebra/matrix3.js";

import overlap from "../../intersect/overlapMethod.js";

const table = {
	preserve: { // don't transform the return type. preserve it
		magnitude: function () { return magnitude(this); },
		isEquivalent: function () {
			return epsilonEqualVectors(this, getVector(arguments));
		},
		isParallel: function () {
			return parallel(...resizeUp(this, getVector(arguments)));
		},
		isCollinear: function (line) {
			return overlap(this, line);
		},
		dot: function () {
			return dot(...resizeUp(this, getVector(arguments)));
		},
		distanceTo: function () {
			return distance(...resizeUp(this, getVector(arguments)));
		},
		overlap: function (other) {
			return overlap(this, other);
		},
	},
	vector: { // return type
		copy: function () { return [...this]; },
		normalize: function () { return normalize(this); },
		scale: function () { return scale(this, arguments[0]); },
		flip: function () { return flip(this); },
		rotate90: function () { return rotate90(this); },
		rotate270: function () { return rotate270(this); },
		cross: function () {
			return cross3(
				resize(3, this),
				resize(3, getVector(arguments)),
			);
		},
		transform: function () {
			return multiplyMatrix3Vector3(
				getMatrix3x4(arguments),
				resize(3, this),
			);
		},
		/**
		 * @description add a vector to this vector.
		 * @param {number[]} vector one vector
		 * @returns {number[]} one vector, the sum of this and the input vector
		 */
		add: function () {
			return add(this, resize(this.length, getVector(arguments)));
		},
		subtract: function () {
			return subtract(this, resize(this.length, getVector(arguments)));
		},
		// todo, can this be improved?
		rotateZ: function (angle, origin) {
			return multiplyMatrix3Vector3(
				getMatrix3x4(makeMatrix2Rotate(angle, origin)),
				resize(3, this),
			);
		},
		lerp: function (vector, pct) {
			return lerp(this, resize(this.length, getVector(vector)), pct);
		},
		midpoint: function () {
			return midpoint(...resizeUp(this, getVector(arguments)));
		},
		bisect: function () {
			return counterClockwiseBisect2(this, getVector(arguments));
		},
	},
};

// the default export
const VectorMethods = {};

Object.keys(table.preserve).forEach(key => {
	VectorMethods[key] = table.preserve[key];
});

Object.keys(table.vector).forEach(key => {
	VectorMethods[key] = function () {
		return Constructors.vector(...table.vector[key].apply(this, arguments));
	};
});

export default VectorMethods;
