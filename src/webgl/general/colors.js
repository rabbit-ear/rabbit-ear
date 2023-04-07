/**
 * Rabbit Ear (c) Kraft
 */
import { parseColorToRgb } from "../../svg/colors/parseColor.js";

export const dark = {
	B: [0.5, 0.5, 0.5],
	b: [0.5, 0.5, 0.5],
	V: [0.2, 0.4, 0.6],
	v: [0.2, 0.4, 0.6],
	M: [0.75, 0.25, 0.15],
	m: [0.75, 0.25, 0.15],
	F: [0.3, 0.3, 0.3],
	f: [0.3, 0.3, 0.3],
	J: [0.3, 0.2, 0.0],
	j: [0.3, 0.2, 0.0],
	C: [0.5, 0.8, 0.1],
	c: [0.5, 0.8, 0.1],
	U: [0.6, 0.25, 0.9],
	u: [0.6, 0.25, 0.9],
};

export const light = {
	B: [0.0, 0.0, 0.0],
	b: [0.0, 0.0, 0.0],
	V: [0.2, 0.5, 0.8],
	v: [0.2, 0.5, 0.8],
	M: [0.75, 0.25, 0.15],
	m: [0.75, 0.25, 0.15],
	F: [0.75, 0.75, 0.75],
	f: [0.75, 0.75, 0.75],
	J: [1.0, 0.75, 0.25],
	j: [1.0, 0.75, 0.25],
	C: [0.5, 0.8, 0.1],
	c: [0.5, 0.8, 0.1],
	U: [0.6, 0.25, 0.9],
	u: [0.6, 0.25, 0.9],
};
/**
 * @description Convert a color into a WebGL RGB with three
 * float values between 0 and 1
 */
export const parseColorToWebGLRgb = (color) => (
	color !== undefined && color.constructor === Array
		? color.slice(0, 3)
		: parseColorToRgb(color).slice(0, 3).map(n => n / 255)
);
