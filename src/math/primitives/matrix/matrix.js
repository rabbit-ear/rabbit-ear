/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";

import {
	getVector,
	getLine,
	getMatrix3x4,
} from "../../general/get.js";

import {
	resize,
} from "../../algebra/vector.js";

import {
	isIdentity3x4,
	multiplyMatrix3Vector3,
	multiplyMatrix3Line3,
	multiplyMatrices3,
	determinant3,
	invertMatrix3,
	makeMatrix3Translate,
	makeMatrix3RotateX,
	makeMatrix3RotateY,
	makeMatrix3RotateZ,
	makeMatrix3Rotate,
	makeMatrix3Scale,
	makeMatrix3ReflectZ,
} from "../../algebra/matrix3.js";

/**
 * 3D Matrix (3x4) with translation component in x,y,z. column-major order
 *
 *   x y z translation
 *   | | | |           indices
 * [ 1 0 0 0 ]   x   [ 0 3 6 9 ]
 * [ 0 1 0 0 ]   y   [ 1 4 7 10]
 * [ 0 0 1 0 ]   z   [ 2 5 8 11]
 */

// this is 4x faster than calling Object.assign(thisMat, mat)
const array_assign = (thisMat, mat) => {
	for (let i = 0; i < 12; i += 1) {
		thisMat[i] = mat[i];
	}
	return thisMat;
};

export default {
	matrix: {
		P: Array.prototype,

		A: function () {
			// [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0].forEach(m => this.push(m));
			getMatrix3x4(arguments).forEach(m => this.push(m));
		},

		G: {
		},

		M: {
			copy: function () { return Constructors.matrix(...Array.from(this)); },
			set: function () {
				return array_assign(this, getMatrix3x4(arguments));
			},
			isIdentity: function () { return isIdentity3x4(this); },
			// todo: is this right, on the right hand side?
			multiply: function (mat) {
				return array_assign(this, multiplyMatrices3(this, mat));
			},
			determinant: function () {
				return determinant3(this);
			},
			inverse: function () {
				return array_assign(this, invertMatrix3(this));
			},
			// todo: is this the right order (this, transform)?
			translate: function (x, y, z) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3Translate(x, y, z)),
				);
			},
			rotateX: function (radians) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3RotateX(radians)),
				);
			},
			rotateY: function (radians) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3RotateY(radians)),
				);
			},
			rotateZ: function (radians) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3RotateZ(radians)),
				);
			},
			rotate: function (radians, vector, origin) {
				const transform = makeMatrix3Rotate(radians, vector, origin);
				return array_assign(this, multiplyMatrices3(this, transform));
			},
			scale: function (...args) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3Scale(...args)),
				);
			},
			reflectZ: function (vector, origin) {
				const transform = makeMatrix3ReflectZ(vector, origin);
				return array_assign(this, multiplyMatrices3(this, transform));
			},
			// todo, do type checking
			transform: function (...innerArgs) {
				return Constructors.vector(
					multiplyMatrix3Vector3(this, resize(3, getVector(innerArgs))),
				);
			},
			transformVector: function (vector) {
				return Constructors.vector(
					multiplyMatrix3Vector3(this, resize(3, getVector(vector))),
				);
			},
			transformLine: function (...innerArgs) {
				const l = getLine(innerArgs);
				return Constructors.line(multiplyMatrix3Line3(this, l.vector, l.origin));
			},
		},

		S: {},
	},
};
