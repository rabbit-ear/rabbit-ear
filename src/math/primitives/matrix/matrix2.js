/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";

import {
	getVector,
	getMatrix2,
} from "../../general/get.js";

import { cleanNumber } from "../../general/number.js";

import {
	multiplyMatrix2Vector2,
	multiplyMatrix2Line2,
	multiplyMatrices2,
	determinant2,
	invertMatrix2,
	makeMatrix2Translate,
	makeMatrix2Scale,
	makeMatrix2Rotate,
	makeMatrix2Reflect,
} from "../../algebra/matrix2.js";

/**
 * 2D Matrix (2x3) with translation component in x,y
 */
export default {
	matrix2: {
		P: Array.prototype,

		A: function () {
			const matrix = [1, 0, 0, 1, 0, 0];
			const argsMatrix = getMatrix2(arguments);
			if (argsMatrix !== undefined) {
				argsMatrix.forEach((n, i) => { matrix[i] = n; });
			}
			matrix.forEach(m => this.push(m));
		},

		G: {
		},

		M: {
			multiply: function () {
				return Constructors.matrix2(
					multiplyMatrices2(this, getMatrix2(arguments))
						.map(n => cleanNumber(n, 13)),
				);
			},
			determinant: function () {
				return cleanNumber(determinant2(this));
			},
			inverse: function () {
				return Constructors.matrix2(invertMatrix2(this)
					.map(n => cleanNumber(n, 13)));
			},
			translate: function (x, y) {
				return Constructors.matrix2(
					multiplyMatrices2(this, makeMatrix2Translate(x, y))
						.map(n => cleanNumber(n, 13)),
				);
			},
			scale: function () {
				return Constructors.matrix2(
					multiplyMatrices2(this, makeMatrix2Scale(arguments))
						.map(n => cleanNumber(n, 13)),
				);
			},
			rotate: function () {
				return Constructors.matrix2(
					multiplyMatrices2(this, makeMatrix2Rotate(arguments))
						.map(n => cleanNumber(n, 13)),
				);
			},
			reflect: function () {
				return Constructors.matrix2(
					multiplyMatrices2(this, makeMatrix2Reflect(arguments))
						.map(n => cleanNumber(n, 13)),
				);
			},
			transform: function () {
				return Constructors.vector(
					multiplyMatrix2Vector2(this, getVector(arguments))
						.map(n => cleanNumber(n, 13)),
				);
			},
			transformVector: function (vector) {
				return Constructors.matrix2(multiplyMatrix2Vector2(this, vector)
					.map(n => cleanNumber(n, 13)));
			},
			transformLine: function (vector, origin) {
				return Constructors.matrix2(
					multiplyMatrix2Line2(this, vector, origin)
						.map(n => cleanNumber(n, 13)),
				);
			},
		},

		S: {
			makeIdentity: () => Constructors.matrix2(1, 0, 0, 1, 0, 0),
			makeTranslation: (x, y) => Constructors.matrix2(
				makeMatrix2Translate(x, y),
			),
			makeRotation: (angle_radians, origin) => Constructors.matrix2(
				makeMatrix2Rotate(angle_radians, origin)
					.map(n => cleanNumber(n, 13)),
			),
			makeScale: (x, y, origin) => Constructors.matrix2(
				makeMatrix2Scale(x, y, origin).map(n => cleanNumber(n, 13)),
			),
			makeReflection: (vector, origin) => Constructors.matrix2(
				makeMatrix2Reflect(vector, origin).map(n => cleanNumber(n, 13)),
			),
		},
	},
};
