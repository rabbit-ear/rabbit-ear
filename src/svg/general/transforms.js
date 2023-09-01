/* svg (c) Kraft, MIT License */
import { svg_multiplyMatrices2 } from './algebra.js';

/**
 * SVG (c) Kraft
 */
/** SVG transforms are in DEGREES ! */
/**
 * parse the value of a SVG transform attribute
 * @param {string} transform, like "translate(20 30) rotate(30) skewY(10)"
 * @returns {object[]} array of objects, {transform:__, parameters:__}
 */
const parseTransform = function (transform) {
	const parsed = transform.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?\s*)+\))+/g);
	if (!parsed) { return []; }
	const listForm = parsed.map(a => a.match(/[\w\.\-]+/g));
	return listForm.map(a => ({
		transform: a.shift(),
		parameters: a.map(p => parseFloat(p)),
	}));
};

/**
 * convert the arguments of each SVG affine transform type into matrix form
 */
const matrixFormTranslate = function (params) {
	switch (params.length) {
	case 1: return [1, 0, 0, 1, params[0], 0];
	case 2: return [1, 0, 0, 1, params[0], params[1]];
	default: console.warn(`improper translate, ${params}`);
	}
	return undefined;
};

const matrixFormRotate = function (params) {
	const cos_p = Math.cos(params[0] / (180 * Math.PI));
	const sin_p = Math.sin(params[0] / (180 * Math.PI));
	switch (params.length) {
	case 1: return [cos_p, sin_p, -sin_p, cos_p, 0, 0];
	case 3: return [cos_p, sin_p, -sin_p, cos_p,
		-params[1] * cos_p + params[2] * sin_p + params[1],
		-params[1] * sin_p - params[2] * cos_p + params[2]];
	default: console.warn(`improper rotate, ${params}`);
	}
	return undefined;
};

const matrixFormScale = function (params) {
	switch (params.length) {
	case 1: return [params[0], 0, 0, params[0], 0, 0];
	case 2: return [params[0], 0, 0, params[1], 0, 0];
	default: console.warn(`improper scale, ${params}`);
	}
	return undefined;
};

const matrixFormSkewX = function (params) {
	return [1, 0, Math.tan(params[0] / (180 * Math.PI)), 1, 0, 0];
};

const matrixFormSkewY = function (params) {
	return [1, Math.tan(params[0] / (180 * Math.PI)), 0, 1, 0, 0];
};

const matrixForm = function (transformType, params) {
	switch (transformType) {
	case "translate": return matrixFormTranslate(params);
	case "rotate": return matrixFormRotate(params);
	case "scale": return matrixFormScale(params);
	case "skewX": return matrixFormSkewX(params);
	case "skewY": return matrixFormSkewY(params);
	case "matrix": return params;
	default: console.warn(`unknown transform type ${transformType}`);
	}
	return undefined;
};

const transformStringToMatrix = function (string) {
	return parseTransform(string)
		.map(el => matrixForm(el.transform, el.parameters))
		.filter(a => a !== undefined)
		.reduce((a, b) => svg_multiplyMatrices2(a, b), [1, 0, 0, 1, 0, 0]);
};

export { parseTransform, transformStringToMatrix };
